import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { FileService } from './file.service';
import { QueryFileDto } from './dto/query-file.dto';
import { RenameFileDto } from './dto/rename-file.dto';
import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const allowedUploadTypes = new Map([
  ['.avif', ['image/avif']],
  ['.bmp', ['image/bmp']],
  ['.gif', ['image/gif']],
  ['.jpeg', ['image/jpeg']],
  ['.jpg', ['image/jpeg']],
  ['.png', ['image/png']],
  ['.webp', ['image/webp']],
  ['.mov', ['video/quicktime']],
  ['.mp4', ['video/mp4']],
  ['.webm', ['video/webm']],
  ['.pdf', ['application/pdf']],
  ['.doc', ['application/msword']],
  ['.docx', ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']],
  ['.xls', ['application/vnd.ms-excel']],
  ['.xlsx', ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']],
  ['.ppt', ['application/vnd.ms-powerpoint']],
  ['.pptx', ['application/vnd.openxmlformats-officedocument.presentationml.presentation']],
]);

const fileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const ext = extname(file.originalname).toLowerCase();
  const allowedMimeTypes = allowedUploadTypes.get(ext);
  if (!allowedMimeTypes?.includes(file.mimetype)) {
    callback(new BadRequestException('不支持的文件类型'), false);
    return;
  }

  callback(null, true);
};

const storage = diskStorage({
  destination: (_req, _file, callback) => {
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('媒体库')
@ApiBearerAuth()
@Controller('admin/media/assets')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('page')
  @ApiOperation({ summary: '文件分页列表' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  findAll(@Query() query: QueryFileDto) {
    return this.fileService.findAll(query);
  }

  @Post('detail')
  @ApiOperation({ summary: '文件详情' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  findOne(@Body() body: { id: number }) {
    return this.fileService.findOne(body.id);
  }

  @Post('upload')
  @ApiOperation({ summary: '上传单个文件' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '媒体库',
    action: '上传文件',
    details: ({ result }) =>
      `上传文件：${String((result as { originalName?: string })?.originalName ?? 'unknown')}`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folderId: { type: 'number' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folderId') folderId?: string,
  ) {
    return this.fileService.saveUploadedFile(file, folderId ? +folderId : undefined);
  }

  @Post('upload/batch')
  @ApiOperation({ summary: '批量上传文件' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '媒体库',
    action: '批量上传文件',
    details: ({ result }) =>
      `批量上传文件：共 ${String(Array.isArray(result) ? result.length : 0)} 个`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        folderId: { type: 'number' },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage,
      fileFilter,
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('folderId') folderId?: string,
  ) {
    return Promise.all(
      files.map((file) =>
        this.fileService.saveUploadedFile(
          file,
          folderId ? +folderId : undefined,
        ),
      ),
    );
  }

  @Post('rename')
  @ApiOperation({ summary: '重命名文件' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '媒体库',
    action: '重命名文件',
    details: ({ result, body }) =>
      `重命名文件：${String((result as { originalName?: string })?.originalName ?? (body.id ?? 'unknown'))}`,
  })
  rename(@Body() body: { id: number } & RenameFileDto) {
    const { id, ...dto } = body;
    return this.fileService.rename(id, dto);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除文件' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '媒体库',
    action: '删除文件',
    details: ({ result, body }) =>
      `删除文件：${String((result as { originalName?: string })?.originalName ?? (body.id ?? 'unknown'))}`,
  })
  remove(@Body() body: { id: number }) {
    return this.fileService.remove(body.id);
  }
}
