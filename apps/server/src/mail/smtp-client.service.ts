import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as net from 'net';
import * as tls from 'tls';

import { MailConfigDto } from '../setting/dto/mail-config.dto';
import type { SmtpMailPayload } from './mail.types';

type SocketLike = net.Socket | tls.TLSSocket;

@Injectable()
export class SmtpClientService {
  constructor(private readonly configService: ConfigService) {}

  async send(config: MailConfigDto, mail: SmtpMailPayload) {
    let socket = await this.createSocket(config);

    try {
      const greeting = await this.readResponse(socket);
      this.assertResponse(greeting, [220]);

      let ehloResponse = await this.sendCommand(socket, 'EHLO yaoshuntoys.local', [250]);
      if (!config.smtpSecure && /STARTTLS/i.test(ehloResponse)) {
        await this.sendCommand(socket, 'STARTTLS', [220]);
        socket = await this.upgradeToTls(socket as net.Socket, config.smtpHost);
        ehloResponse = await this.sendCommand(socket, 'EHLO yaoshuntoys.local', [250]);
      }
      void ehloResponse;

      await this.sendCommand(socket, 'AUTH LOGIN', [334]);
      await this.sendCommand(socket, this.toBase64(config.username), [334]);
      await this.sendCommand(socket, this.toBase64(config.password), [235]);
      await this.sendCommand(socket, `MAIL FROM:<${config.fromEmail}>`, [250]);
      await this.sendCommand(socket, `RCPT TO:<${mail.toEmail}>`, [250, 251]);
      await this.sendCommand(socket, 'DATA', [354]);
      await this.sendData(socket, this.buildMimeMessage(config, mail));
      this.assertResponse(await this.readResponse(socket), [250]);
      await this.sendCommand(socket, 'QUIT', [221]);
    } finally {
      socket.end();
      socket.destroy();
    }
  }

  private buildMimeMessage(config: MailConfigDto, mail: SmtpMailPayload) {
    const headers = [
      `From: ${this.formatAddress(config.fromName, config.fromEmail)}`,
      `To: <${mail.toEmail}>`,
      `Subject: ${this.encodeHeader(mail.subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      `Date: ${new Date().toUTCString()}`,
      '',
      this.wrapBase64(this.toBase64(mail.content)),
    ];

    return `${headers.join('\r\n')}\r\n.\r\n`;
  }

  private formatAddress(name: string, email: string) {
    return `${this.encodeHeader(name)} <${email}>`;
  }

  private encodeHeader(value: string) {
    return `=?UTF-8?B?${this.toBase64(value)}?=`;
  }

  private wrapBase64(value: string) {
    return value.match(/.{1,76}/g)?.join('\r\n') ?? value;
  }

  private toBase64(value: string) {
    return Buffer.from(value, 'utf8').toString('base64');
  }

  private async createSocket(config: MailConfigDto): Promise<SocketLike> {
    if (config.smtpSecure) {
      return new Promise<tls.TLSSocket>((resolve, reject) => {
        const socket = tls.connect(
          {
            host: config.smtpHost,
            port: config.smtpPort,
            servername: config.smtpHost,
            rejectUnauthorized: this.shouldRejectUnauthorized(),
          },
          () => resolve(socket),
        );
        this.prepareSocket(socket, reject, 'SMTP 连接超时');
      });
    }

    return new Promise<net.Socket>((resolve, reject) => {
      const socket = net.createConnection(
        {
          host: config.smtpHost,
          port: config.smtpPort,
        },
        () => resolve(socket),
      );
      this.prepareSocket(socket, reject, 'SMTP 连接超时');
    });
  }

  private async upgradeToTls(socket: net.Socket, host: string): Promise<tls.TLSSocket> {
    return new Promise<tls.TLSSocket>((resolve, reject) => {
      const secureSocket = tls.connect(
        {
          socket,
          servername: host,
          rejectUnauthorized: this.shouldRejectUnauthorized(),
        },
        () => resolve(secureSocket),
      );
      this.prepareSocket(secureSocket, reject, 'STARTTLS 升级超时');
    });
  }

  private prepareSocket(
    socket: SocketLike,
    reject: (reason?: unknown) => void,
    timeoutMessage: string,
  ) {
    socket.setEncoding('utf8');
    socket.setTimeout(15000);
    socket.once('error', reject);
    socket.once('timeout', () => reject(new Error(timeoutMessage)));
  }

  private async sendCommand(
    socket: SocketLike,
    command: string,
    successCodes: number[],
  ) {
    socket.write(`${command}\r\n`);
    const response = await this.readResponse(socket);
    this.assertResponse(response, successCodes);
    return response;
  }

  private async sendData(socket: SocketLike, data: string) {
    return new Promise<void>((resolve, reject) => {
      socket.write(data, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private async readResponse(socket: SocketLike): Promise<string> {
    return new Promise((resolve, reject) => {
      let buffer = '';

      const cleanup = () => {
        socket.off('data', onData);
        socket.off('error', onError);
        socket.off('close', onClose);
      };

      const onData = (chunk: Buffer | string) => {
        buffer += chunk.toString();
        if (this.isCompleteResponse(buffer)) {
          cleanup();
          resolve(buffer);
        }
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const onClose = () => {
        if (!buffer) {
          cleanup();
          reject(new Error('SMTP 连接已关闭'));
        }
      };

      socket.on('data', onData);
      socket.on('error', onError);
      socket.on('close', onClose);
    });
  }

  private isCompleteResponse(value: string) {
    const lines = value.split('\r\n').filter(Boolean);
    if (lines.length === 0) return false;
    return /^\d{3}\s/.test(lines[lines.length - 1]);
  }

  private assertResponse(response: string, successCodes: number[]) {
    const lines = response.split('\r\n').filter(Boolean);
    const lastLine = lines[lines.length - 1] ?? '';
    const code = Number(lastLine.slice(0, 3));

    if (!successCodes.includes(code)) {
      throw new Error(lastLine || `SMTP 响应异常：${response}`);
    }
  }

  private shouldRejectUnauthorized() {
    return (
      this.configService.get<string>('SMTP_REJECT_UNAUTHORIZED') ?? 'true'
    ).toLowerCase() !== 'false';
  }
}
