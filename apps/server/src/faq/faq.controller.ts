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
import { CreateFaqDto } from './dto/create-faq.dto';
import { QueryFaqDto } from './dto/query-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';

type RequestWithUser = Request & {
  user?: {
    username?: string;
  };
};

@ApiTags('常见问题')
@Controller('admin/faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiBearerAuth()
  @Post()
  @RequirePermissions(PERMISSIONS.CONTENT_FAQ_MANAGE)
  @OperationLog({
    module: '常见问题',
    action: '创建 FAQ',
    details: ({ body }) => `创建 FAQ：${String(body.questionZh ?? 'unknown')}`,
  })
  create(@Body() dto: CreateFaqDto, @Req() request: RequestWithUser) {
    return this.faqService.create(dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Get(':id/revisions')
  @RequirePermissions(PERMISSIONS.CONTENT_FAQ_MANAGE)
  findRevisions(@Param('id') id: string) {
    return this.faqService.findRevisions(+id);
  }

  @ApiBearerAuth()
  @Get()
  @RequirePermissions(PERMISSIONS.CONTENT_FAQ_MANAGE)
  findAll(@Query() query: QueryFaqDto) {
    return this.faqService.findAll(query);
  }

  @ApiBearerAuth()
  @Get(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_FAQ_MANAGE)
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_FAQ_MANAGE)
  @OperationLog({
    module: '常见问题',
    action: '更新 FAQ',
    details: ({ body, params }) =>
      `更新 FAQ：${String(body.questionZh ?? params.id ?? 'unknown')}`,
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFaqDto,
    @Req() request: RequestWithUser,
  ) {
    return this.faqService.update(+id, dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Post(':id/rollback/:revisionId')
  @RequirePermissions(PERMISSIONS.CONTENT_FAQ_MANAGE)
  @OperationLog({
    module: '常见问题',
    action: '恢复 FAQ 历史',
    details: ({ params }) =>
      `恢复 FAQ 历史：${String(params.id ?? 'unknown')} #${String(params.revisionId ?? 'unknown')}`,
  })
  rollback(
    @Param('id') id: string,
    @Param('revisionId') revisionId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.faqService.rollback(+id, revisionId, request.user?.username);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_FAQ_MANAGE)
  @OperationLog({
    module: '常见问题',
    action: '删除 FAQ',
    details: ({ params }) => `删除 FAQ：${String(params.id ?? 'unknown')}`,
  })
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.faqService.remove(+id, request.user?.username);
  }
}
