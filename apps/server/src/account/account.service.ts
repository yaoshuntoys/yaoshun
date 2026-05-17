import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { buildPaginatedResult, getPaginationParams } from '../common/utils/pagination.util';
import { MailService } from '../mail/mail.service';
import { PermissionService } from '../permission/permission.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccountSecurityService } from './account-security.service';
import { ACCOUNT_SELECT, serializeAccount } from './account.serializer';
import { CreateAccountDto } from './dto/create-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly permissionService: PermissionService,
    private readonly securityService: AccountSecurityService,
  ) {}

  async create(dto: CreateAccountDto) {
    const { password, ...rest } = dto;

    await this.ensureUniqueConstraints({
      username: rest.username,
      email: rest.email,
    });
    await this.permissionService.ensureRoleExists(rest.role);

    const hashedPassword = await this.securityService.hashPassword(password);
    const account = await this.prisma.account.create({
      data: { ...rest, password: hashedPassword },
      select: ACCOUNT_SELECT,
    });

    return serializeAccount(account);
  }

  async findAll(query: QueryAccountDto = {}) {
    const { page, pageSize, skip } = getPaginationParams(query);
    const where = this.buildWhere(query);

    const [total, items] = await Promise.all([
      this.prisma.account.count({ where }),
      this.prisma.account.findMany({
        where,
        select: ACCOUNT_SELECT,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return buildPaginatedResult(
      items.map((item) => serializeAccount(item)),
      total,
      page,
      pageSize,
    );
  }

  async findList() {
    const items = await this.prisma.account.findMany({
      select: ACCOUNT_SELECT,
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => serializeAccount(item));
  }

  async findOne(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      select: ACCOUNT_SELECT,
    });

    return account ? serializeAccount(account) : null;
  }

  findByUsername(username: string) {
    return this.prisma.account.findUnique({
      where: { username },
      select: {
        ...ACCOUNT_SELECT,
        password: true,
      },
    });
  }

  async update(id: number, dto: UpdateAccountDto) {
    const current = await this.getAccountOrThrow(id);
    this.ensureAccountEditable(current);

    await this.ensureUniqueConstraints({
      id,
      username: dto.username,
      email: dto.email,
    });
    await this.permissionService.ensureRoleExists(dto.role);

    const data: Record<string, unknown> = { ...dto };
    if (data.password) {
      data.password = await this.securityService.hashPassword(data.password as string);
    }

    const account = await this.prisma.account.update({
      where: { id },
      data,
      select: ACCOUNT_SELECT,
    });

    return serializeAccount(account);
  }

  async resetPassword(id: number, password: string) {
    await this.ensureExists(id);

    const hashed = await this.securityService.hashPassword(password);
    const account = await this.prisma.account.update({
      where: { id },
      data: { password: hashed },
      select: ACCOUNT_SELECT,
    });

    const serialized = serializeAccount(account);
    await this.mailService.sendPasswordResetNotification(serialized);
    return serialized;
  }

  async toggleStatus(id: number) {
    const account = await this.getAccountOrThrow(id);
    const nextStatus = account.status === 'active' ? 'inactive' : 'active';

    const updated = await this.prisma.account.update({
      where: { id },
      data: { status: nextStatus },
      select: ACCOUNT_SELECT,
    });

    return serializeAccount(updated);
  }

  async updateLastLogin(id: number) {
    return this.prisma.account.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async updateProfile(
    id: number,
    dto: { name?: string; nickname?: string; email?: string },
  ) {
    await this.ensureExists(id);

    await this.ensureUniqueConstraints({
      id,
      email: dto.email,
    });

    const account = await this.prisma.account.update({
      where: { id },
      data: {
        name: dto.name,
        nickname: dto.nickname,
        email: dto.email,
      },
      select: ACCOUNT_SELECT,
    });

    return serializeAccount(account);
  }

  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const account = await this.getAccountOrThrow(id);
    const isMatched = await this.securityService.comparePassword(
      oldPassword,
      account.password,
    );

    if (!isMatched) {
      throw new UnauthorizedException('原密码错误');
    }

    const hashedPassword = await this.securityService.hashPassword(newPassword);
    const updated = await this.prisma.account.update({
      where: { id },
      data: { password: hashedPassword },
      select: ACCOUNT_SELECT,
    });

    return serializeAccount(updated);
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const account = await this.prisma.account.findFirst({
      where: { email: normalizedEmail },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        nickname: true,
      },
    });

    if (!account) {
      return this.buildForgotPasswordResponse();
    }

    const { rawToken, tokenHash, expiresAt } =
      this.securityService.createResetToken();

    await this.prisma.passwordResetToken.create({
      data: {
        accountId: account.id,
        tokenHash,
        expiresAt,
      },
    });

    await this.mailService.sendPasswordResetTokenNotification(account, {
      token: rawToken,
      expiresAt,
    });

    return this.buildForgotPasswordResponse();
  }

  async resetForgottenPassword(token: string, newPassword: string) {
    const tokenHash = this.securityService.hashResetToken(token.trim());
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        accountId: true,
        expiresAt: true,
        usedAt: true,
        account: {
          select: {
            status: true,
          },
        },
      },
    });

    const now = new Date();
    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() <= now.getTime() ||
      resetToken.account.status !== 'active'
    ) {
      throw new BadRequestException('重置链接无效或已过期');
    }

    const hashedPassword = await this.securityService.hashPassword(newPassword);
    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: resetToken.accountId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: now },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: {
          accountId: resetToken.accountId,
          usedAt: null,
          id: { not: resetToken.id },
        },
        data: { usedAt: now },
      }),
    ]);

    return {
      message: '密码已重置，请使用新密码登录。',
    };
  }

  private buildForgotPasswordResponse() {
    return {
      message: '如果邮箱已绑定账号，重置密码链接将发送至该邮箱。',
    };
  }

  remove(id: number) {
    return this.removeAccount(id);
  }

  private async removeAccount(id: number) {
    const account = await this.getAccountOrThrow(id);
    this.ensureAccountEditable(account);

    return this.prisma.account.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    await this.getAccountOrThrow(id);
  }

  private async getAccountOrThrow(id: number) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  private ensureAccountEditable(account: { isSystem?: boolean }) {
    if (account.isSystem) {
      throw new BadRequestException('系统账号不允许编辑或删除');
    }
  }

  private async ensureUniqueConstraints(params: {
    id?: number;
    username?: string;
    email?: string;
  }) {
    const { id, username, email } = params;
    await this.ensureUniqueField('username', username, id, '用户名已存在');
    await this.ensureUniqueField('email', email, id, '邮箱已存在');
  }

  private buildWhere(query: QueryAccountDto) {
    const where: Record<string, unknown> = {};

    if (query.keyword) {
      where.OR = [
        { username: { contains: query.keyword, mode: 'insensitive' } },
        { nickname: { contains: query.keyword, mode: 'insensitive' } },
        { name: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;

    return where;
  }

  private async ensureUniqueField(
    field: 'username' | 'email',
    value: string | undefined,
    currentId: number | undefined,
    message: string,
  ) {
    if (!value) return;

    const exists = await this.prisma.account.findUnique({
      where: field === 'username' ? { username: value } : { email: value },
      select: { id: true },
    });
    if (exists && exists.id !== currentId) {
      throw new ConflictException(message);
    }
  }
}
