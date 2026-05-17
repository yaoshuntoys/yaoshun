import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { getPaginationParams, buildPaginatedResult } from '../common/utils/pagination.util';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateMessageDto) {
    const message = await this.prisma.customerMessage.create({ data: dto });
    await this.mailService.sendMessageNotification(message);
    return message;
  }

  async findAll(query: { page?: string; pageSize?: string; isRead?: string; keyword?: string }) {
    const page = parseInt(query.page || '1');
    const pageSize = parseInt(query.pageSize || '10');
    const { skip } = getPaginationParams({ page, pageSize });

    const where: Record<string, unknown> = {};
    where.isRead = query.isRead === 'true' ? true : false;
    if (query.keyword) {
      where.OR = [
        { name: { contains: query.keyword, mode: 'insensitive' } },
        { email: { contains: query.keyword, mode: 'insensitive' } },
        { subject: { contains: query.keyword, mode: 'insensitive' } },
        { message: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.customerMessage.count({ where }),
      this.prisma.customerMessage.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
    ]);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async unreadCount() {
    const count = await this.prisma.customerMessage.count({ where: { isRead: false } });
    return { count };
  }

  async findOne(id: number) {
    const message = await this.prisma.customerMessage.findUnique({ where: { id } });
    if (message && !message.isRead) {
      await this.prisma.customerMessage.update({ where: { id }, data: { isRead: true } });
    }
    return message ? { ...message, isRead: true } : message;
  }

  markRead(id: number) {
    return this.prisma.customerMessage.update({ where: { id }, data: { isRead: true } });
  }

  remove(id: number) {
    return this.prisma.customerMessage.delete({ where: { id } });
  }
}
