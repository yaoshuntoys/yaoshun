import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FolderService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFolderDto) {
    return this.prisma.mediaFolder.create({
      data: dto,
      include: { children: true },
    });
  }

  findAll() {
    return this.prisma.mediaFolder.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { children: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  rename(id: number, name: string) {
    return this.prisma.mediaFolder.update({
      where: { id },
      data: { name },
    });
  }

  move(id: number, parentId: number | null) {
    return this.prisma.mediaFolder.update({
      where: { id },
      data: { parentId },
    });
  }

  async remove(id: number) {
    const folder = await this.prisma.mediaFolder.findUnique({ where: { id } });
    if (folder?.isSystem) {
      throw new BadRequestException('系统目录不允许删除');
    }
    return this.prisma.mediaFolder.delete({ where: { id } });
  }
}
