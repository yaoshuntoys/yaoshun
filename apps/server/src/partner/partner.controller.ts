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
import { CreatePartnerDto } from './dto/create-partner.dto';
import { QueryPartnerDto } from './dto/query-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerService } from './partner.service';

type RequestWithUser = Request & {
  user?: {
    username?: string;
  };
};

@ApiTags('合作客户')
@Controller('admin/partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @ApiBearerAuth()
  @Post()
  @RequirePermissions(PERMISSIONS.CONTENT_PARTNER_MANAGE)
  @OperationLog({
    module: '合作客户',
    action: '创建合作客户',
    details: ({ body }) => `创建合作客户：${String(body.nameZh ?? 'unknown')}`,
  })
  create(@Body() dto: CreatePartnerDto, @Req() request: RequestWithUser) {
    return this.partnerService.create(dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Get(':id/revisions')
  @RequirePermissions(PERMISSIONS.CONTENT_PARTNER_MANAGE)
  findRevisions(@Param('id') id: string) {
    return this.partnerService.findRevisions(+id);
  }

  @ApiBearerAuth()
  @Get()
  @RequirePermissions(PERMISSIONS.CONTENT_PARTNER_MANAGE)
  findAll(@Query() query: QueryPartnerDto) {
    return this.partnerService.findAll(query);
  }

  @ApiBearerAuth()
  @Get(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_PARTNER_MANAGE)
  findOne(@Param('id') id: string) {
    return this.partnerService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_PARTNER_MANAGE)
  @OperationLog({
    module: '合作客户',
    action: '更新合作客户',
    details: ({ body, params }) =>
      `更新合作客户：${String(body.nameZh ?? params.id ?? 'unknown')}`,
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerDto,
    @Req() request: RequestWithUser,
  ) {
    return this.partnerService.update(+id, dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Post(':id/rollback/:revisionId')
  @RequirePermissions(PERMISSIONS.CONTENT_PARTNER_MANAGE)
  @OperationLog({
    module: '合作客户',
    action: '恢复合作客户历史',
    details: ({ params }) =>
      `恢复合作客户历史：${String(params.id ?? 'unknown')} #${String(params.revisionId ?? 'unknown')}`,
  })
  rollback(
    @Param('id') id: string,
    @Param('revisionId') revisionId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.partnerService.rollback(
      +id,
      revisionId,
      request.user?.username,
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_PARTNER_MANAGE)
  @OperationLog({
    module: '合作客户',
    action: '删除合作客户',
    details: ({ params }) => `删除合作客户：${String(params.id ?? 'unknown')}`,
  })
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.partnerService.remove(+id, request.user?.username);
  }
}
