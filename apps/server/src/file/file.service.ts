import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { QueryFileDto } from './dto/query-file.dto';
import { RenameFileDto } from './dto/rename-file.dto';
import { readFile, unlink } from 'fs/promises';
import { isAbsolute, join, basename } from 'path';
import { PrismaClient, MediaAsset, Prisma } from '@prisma/client';
import { put, del } from '@vercel/blob';
import {
  getPaginationParams,
  buildPaginatedResult,
} from '../common/utils/pagination.util';

@Injectable()
export class FileService {
  private readonly uploadDir = process.env.UPLOAD_DIR || 'uploads';
  private readonly appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
  private readonly db: PrismaClient;

  constructor(
    prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.db = prisma as unknown as PrismaClient;
  }

  async saveUploadedFile(
    file: Express.Multer.File,
    folderId?: number,
  ): Promise<MediaAsset> {
    if (this.getBlobToken()) {
      return this.saveBlobRecord(file, folderId);
    }

    const url = `${this.appUrl}/${this.getPublicUploadPath(file.filename)}`;
    return this.saveRecord(file, url, folderId, {
      storageProvider: 'local',
      storageKey: file.filename,
      pathname: this.getPublicUploadPath(file.filename),
    });
  }

  saveRecord(
    file: Express.Multer.File,
    url: string,
    folderId?: number,
    options: {
      storageProvider?: string;
      storageKey?: string | null;
      pathname?: string | null;
    } = {},
  ): Promise<MediaAsset> {
    return this.db.mediaAsset.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url,
        storageProvider: options.storageProvider ?? 'local',
        storageKey: options.storageKey ?? null,
        pathname: options.pathname ?? null,
        folderId: folderId ?? null,
      },
    });
  }

  async findAll(query: QueryFileDto) {
    const { page, pageSize, skip } = getPaginationParams(query);
    const { mimetype, search, folderId, orderBy = 'createdAt', order = 'desc' } = query;

    const where: Prisma.MediaAssetWhereInput = { deletedAt: null };
    if (mimetype) where.mimetype = { contains: mimetype };
    if (search) where.originalName = { contains: search, mode: 'insensitive' };
    if (folderId !== undefined) where.folderId = folderId;

    const [total, items] = await Promise.all([
      this.db.mediaAsset.count({ where }),
      this.db.mediaAsset.findMany({
        where,
        include: { folder: { select: { id: true, name: true } } },
        orderBy: { [orderBy]: order },
        skip,
        take: pageSize,
      }),
    ]);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async findOne(id: number): Promise<MediaAsset> {
    const file = await this.db.mediaAsset.findFirst({ where: { id, deletedAt: null } });
    if (!file) throw new NotFoundException(`File #${id} not found`);
    return file;
  }

  async rename(id: number, dto: RenameFileDto): Promise<MediaAsset> {
    const file = await this.findOne(id);
    void file;
    return this.db.mediaAsset.update({
      where: { id },
      data: {
        originalName: dto.name,
      },
    });
  }

  async remove(id: number): Promise<MediaAsset> {
    const file = await this.findOne(id);
    const references = await this.db.mediaReference.findMany({
      where: { assetId: id },
      orderBy: { createdAt: 'desc' },
    });
    if (references.length > 0) {
      throw new BadRequestException({
        message: '媒体资源已被引用，不能删除',
        references,
      });
    }
    if (file.storageProvider === 'vercel-blob') {
      try {
        await del(file.url);
      } catch {
        // 远程文件删除失败时仍删除数据库记录，避免后台卡死。
      }
    } else {
      const filePath = this.getLocalFilePath(file.filename);

      try {
        await unlink(filePath);
      } catch {
        // 文件不存在时仍删除数据库记录
      }
    }

    return this.db.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async saveBlobRecord(
    file: Express.Multer.File,
    folderId?: number,
  ): Promise<MediaAsset> {
    const fileBuffer = await readFile(file.path);
    const safeOriginalName = basename(file.originalname).replace(/[^\w.-]+/g, '-');
    const prefix =
      this.configService.get<string>('BLOB_UPLOAD_PREFIX') || 'yaoshun-media';
    const pathname = `${prefix}/${Date.now()}-${file.filename}-${safeOriginalName}`;
    const blob = await put(pathname, fileBuffer, {
      access: 'public',
      contentType: file.mimetype,
      token: this.getBlobToken(),
    });

    try {
      await unlink(file.path);
    } catch {
      // 临时文件清理失败不影响远程上传结果。
    }

    return this.saveRecord(file, blob.url, folderId, {
      storageProvider: 'vercel-blob',
      storageKey: blob.pathname,
      pathname: blob.pathname,
    });
  }

  private getBlobToken() {
    return this.configService.get<string>('BLOB_READ_WRITE_TOKEN')?.trim();
  }

  private getLocalFilePath(filename: string) {
    return join(this.uploadDir, filename);
  }

  private getPublicUploadPath(filename: string) {
    const publicUploadDir = isAbsolute(this.uploadDir)
      ? 'uploads'
      : this.uploadDir;
    return `${publicUploadDir}/${filename}`;
  }
}
