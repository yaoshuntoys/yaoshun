import { Controller, Get, Post, Body } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';

@ApiTags('文件夹管理')
@ApiBearerAuth()
@Controller('admin/media/folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('tree')
  @ApiOperation({ summary: '获取文件夹树' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  tree() {
    return this.folderService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: '新建文件夹' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '文件夹管理',
    action: '新建文件夹',
    details: ({ result, body }) =>
      `新建文件夹：${String((result as { name?: string })?.name ?? (body.name ?? 'unknown'))}`,
  })
  create(@Body() dto: CreateFolderDto) {
    return this.folderService.create(dto);
  }

  @Post('rename')
  @ApiOperation({ summary: '重命名文件夹' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '文件夹管理',
    action: '重命名文件夹',
    details: ({ result, body }) =>
      `重命名文件夹：${String((result as { name?: string })?.name ?? (body.id ?? 'unknown'))}`,
  })
  rename(@Body() body: { id: number; name: string }) {
    return this.folderService.rename(body.id, body.name);
  }

  @Post('move')
  @ApiOperation({ summary: '移动文件夹' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '文件夹管理',
    action: '移动文件夹',
    details: ({ result, body }) => {
      const folder = result as { name?: string; parentId?: number | null };
      return `移动文件夹：${String(folder.name ?? body.id ?? 'unknown')} -> ${String(folder.parentId ?? 'root')}`;
    },
  })
  move(@Body() body: { id: number; parentId: number | null }) {
    return this.folderService.move(body.id, body.parentId);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除文件夹' })
  @RequirePermissions(PERMISSIONS.CONTENT_MEDIA_MANAGE)
  @OperationLog({
    module: '文件夹管理',
    action: '删除文件夹',
    details: ({ result, body }) =>
      `删除文件夹：${String((result as { name?: string })?.name ?? (body.id ?? 'unknown'))}`,
  })
  remove(@Body() body: { id: number }) {
    return this.folderService.remove(body.id);
  }
}
