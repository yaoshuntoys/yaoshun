import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  buildPaginatedResult,
  getPaginationParams,
} from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async page(query: QueryRoleDto = {}) {
    const { page, pageSize, skip } = getPaginationParams(query);
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.keyword) {
      where.OR = [
        { name: { contains: query.keyword, mode: 'insensitive' } },
        { code: { contains: query.keyword, mode: 'insensitive' } },
        { description: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          _count: {
            select: {
              accounts: true,
              permissions: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: [{ createdAt: 'desc' }],
      }),
    ]);

    return buildPaginatedResult(
      items.map((item) => this.serializeRole(item)),
      total,
      page,
      pageSize,
    );
  }

  async list(status?: string) {
    return (
      await this.prisma.role.findMany({
        where: status ? { status } : undefined,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          _count: {
            select: {
              accounts: true,
              permissions: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
      })
    ).map((item) => this.serializeRole(item));
  }

  async detail(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            accounts: true,
            permissions: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return this.serializeRole(role);
  }

  async create(dto: CreateRoleDto) {
    await this.ensureRoleCodeUnique(dto.code);
    const permissions = await this.loadPermissions(dto.permissionCodes);

    const role = await this.prisma.role.create({
      data: {
        code: dto.code.trim(),
        name: dto.name.trim(),
        description: dto.description?.trim(),
        status: dto.status ?? 'active',
        permissions: {
          create: permissions.map((permission) => ({
            permissionId: permission.id,
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            accounts: true,
            permissions: true,
          },
        },
      },
    });

    return this.serializeRole(role);
  }

  async update(id: number, dto: UpdateRoleDto) {
    const existing = await this.prisma.role.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('角色不存在');
    }
    if (existing.isSystem) {
      throw new ConflictException('系统角色不允许编辑');
    }

    if (dto.code && dto.code !== existing.code) {
      await this.ensureRoleCodeUnique(dto.code, id);
    }

    const permissions = await this.loadPermissions(dto.permissionCodes);

    const role = await this.prisma.role.update({
      where: { id },
      data: {
        code: dto.code?.trim(),
        name: dto.name?.trim(),
        description:
          dto.description === undefined ? undefined : dto.description?.trim(),
        status: dto.status,
        permissions:
          dto.permissionCodes === undefined
            ? undefined
            : {
                deleteMany: {},
                create: permissions.map((permission) => ({
                  permissionId: permission.id,
                })),
              },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            accounts: true,
            permissions: true,
          },
        },
      },
    });

    return this.serializeRole(role);
  }

  async toggle(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    if (role.isSystem) {
      throw new ConflictException('系统角色不允许编辑');
    }

    const nextStatus = role.status === 'active' ? 'inactive' : 'active';

    return this.prisma.role.update({
      where: { id },
      data: { status: nextStatus },
    });
  }

  async remove(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    if (role.isSystem) {
      throw new ConflictException('系统内置角色不允许删除');
    }

    if (role._count.accounts > 0) {
      throw new ConflictException('该角色下仍有关联账号，无法删除');
    }

    return this.prisma.role.delete({ where: { id } });
  }

  listPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async ensureRoleExists(code?: string) {
    if (!code) {
      return;
    }

    const role = await this.prisma.role.findUnique({
      where: { code },
      select: { code: true, status: true },
    });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    if (role.status !== 'active') {
      throw new ConflictException('角色已停用，无法分配给账号');
    }
  }

  private async ensureRoleCodeUnique(code: string, id?: number) {
    const exists = await this.prisma.role.findUnique({
      where: { code: code.trim() },
      select: { id: true },
    });

    if (exists && exists.id !== id) {
      throw new ConflictException('角色编码已存在');
    }
  }

  private async loadPermissions(permissionCodes?: string[]) {
    if (!permissionCodes) {
      return [];
    }

    const normalizedCodes = [...new Set(permissionCodes.map((item) => item.trim()))];
    const permissions = await this.prisma.permission.findMany({
      where: {
        code: {
          in: normalizedCodes,
        },
      },
    });

    if (permissions.length !== normalizedCodes.length) {
      throw new NotFoundException('存在无效的权限编码');
    }

    return permissions;
  }

  private serializeRole(
    role: {
      id: number;
      code: string;
      name: string;
      description: string | null;
      status: string;
      isSystem: boolean;
      sortOrder: number;
      createdAt: Date;
      updatedAt: Date;
      permissions: Array<{ permission: { code: string; name: string; module: string } }>;
      _count?: { accounts: number; permissions: number };
    },
  ) {
    const permissions = role.permissions.map((item) => item.permission);

    return {
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description,
      status: role.status,
      isSystem: role.isSystem,
      sortOrder: role.sortOrder,
      permissionCodes: permissions.map((item) => item.code),
      permissions,
      permissionCount: role._count?.permissions ?? permissions.length,
      accountCount: role._count?.accounts ?? 0,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
