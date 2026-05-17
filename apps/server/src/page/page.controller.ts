import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';
import {
  SavePageDraftDto,
  UpdatePageConfigDto,
} from './dto/update-page-config.dto';
import { PageService } from './page.service';

type RequestWithUser = Request & {
  user?: {
    username?: string;
  };
};

@ApiTags('页面管理')
@Controller('admin/pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  @ApiOperation({ summary: '获取所有页面配置' })
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  findAll() {
    return this.pageService.findAdminList();
  }

  @ApiBearerAuth()
  @Get(':key/draft')
  @ApiOperation({ summary: '获取页面草稿详情' })
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  findDraft(@Param('key') key: string) {
    return this.pageService.findDraft(key);
  }

  @ApiBearerAuth()
  @Get(':key/revisions')
  @ApiOperation({ summary: '获取页面历史版本' })
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  findRevisions(@Param('key') key: string) {
    return this.pageService.findRevisions(key);
  }

  @ApiBearerAuth()
  @Post(':key/save-draft')
  @ApiOperation({ summary: '保存页面中英文草稿' })
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  @OperationLog({
    module: '页面管理',
    action: '保存页面草稿',
    details: ({ params }) =>
      `保存页面草稿：${String(params.key ?? 'unknown')}`,
  })
  saveDraft(
    @Param('key') key: string,
    @Body() dto: SavePageDraftDto,
    @Req() request: RequestWithUser,
  ) {
    return this.pageService.saveDraft(key, dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Post(':key/publish')
  @ApiOperation({ summary: '发布页面配置' })
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  @OperationLog({
    module: '页面管理',
    action: '发布页面配置',
    details: ({ params }) =>
      `发布页面配置：${String(params.key ?? 'unknown')}`,
  })
  publish(@Param('key') key: string, @Req() request: RequestWithUser) {
    return this.pageService.publish(key, request.user?.username);
  }

  @ApiBearerAuth()
  @Post(':key/rollback/:revisionId')
  @ApiOperation({ summary: '恢复页面历史版本为草稿' })
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  @OperationLog({
    module: '页面管理',
    action: '恢复页面历史',
    details: ({ params }) =>
      `恢复页面历史：${String(params.key ?? 'unknown')} #${String(params.revisionId ?? 'unknown')}`,
  })
  rollback(
    @Param('key') key: string,
    @Param('revisionId') revisionId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.pageService.rollback(
      key,
      revisionId,
      request.user?.username,
    );
  }

  @ApiBearerAuth()
  @Patch(':key')
  @ApiOperation({ summary: '更新页面配置' })
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  @OperationLog({
    module: '页面管理',
    action: '更新页面配置',
    details: ({ params }) =>
      `更新页面配置：${String(params.key ?? 'unknown')}`,
  })
  update(
    @Param('key') key: string,
    @Body() updatePageConfigDto: UpdatePageConfigDto,
  ) {
    return this.pageService.update(key, updatePageConfigDto);
  }
}
