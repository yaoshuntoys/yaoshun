import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';
import { CreateNewsDto } from './dto/create-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

type RequestWithUser = Request & {
  user?: {
    username?: string;
  };
};

@ApiTags('新闻中心')
@Controller('admin/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiBearerAuth()
  @Post()
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  @OperationLog({
    module: '新闻中心',
    action: '创建新闻',
    details: ({ body }) => `创建新闻：${String(body.titleZh ?? body.slug ?? 'unknown')}`,
  })
  create(@Body() dto: CreateNewsDto, @Req() request: RequestWithUser) {
    return this.newsService.create(dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Get(':id/revisions')
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  findRevisions(@Param('id') id: string) {
    return this.newsService.findRevisions(+id);
  }

  @ApiBearerAuth()
  @Get()
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  findAll(@Query() query: QueryNewsDto) {
    return this.newsService.findAll(query);
  }

  @ApiBearerAuth()
  @Get('slug/:slug')
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @ApiBearerAuth()
  @Get(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  @OperationLog({
    module: '新闻中心',
    action: '更新新闻',
    details: ({ body, params }) => `更新新闻：${String(body.titleZh ?? params.id ?? 'unknown')}`,
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
    @Req() request: RequestWithUser,
  ) {
    return this.newsService.update(+id, dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Post(':id/rollback/:revisionId')
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  @OperationLog({
    module: '新闻中心',
    action: '恢复新闻历史',
    details: ({ params }) =>
      `恢复新闻历史：${String(params.id ?? 'unknown')} #${String(params.revisionId ?? 'unknown')}`,
  })
  rollback(
    @Param('id') id: string,
    @Param('revisionId') revisionId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.newsService.rollback(
      +id,
      revisionId,
      request.user?.username,
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_NEWS_MANAGE)
  @OperationLog({
    module: '新闻中心',
    action: '删除新闻',
    details: ({ params }) => `删除新闻：${String(params.id ?? 'unknown')}`,
  })
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.newsService.remove(+id, request.user?.username);
  }
}
