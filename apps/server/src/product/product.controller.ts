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
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

type RequestWithUser = Request & {
  user?: {
    username?: string;
  };
};

@ApiTags('产品中心')
@Controller('admin/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @Post()
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  @OperationLog({
    module: '产品中心',
    action: '创建产品',
    details: ({ body }) => `创建产品：${String(body.titleZh ?? body.slug ?? 'unknown')}`,
  })
  create(@Body() dto: CreateProductDto, @Req() request: RequestWithUser) {
    return this.productService.create(dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Get(':id/revisions')
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  findRevisions(@Param('id') id: string) {
    return this.productService.findRevisions(+id);
  }

  @ApiBearerAuth()
  @Get()
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @ApiBearerAuth()
  @Get('slug/:slug')
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @ApiBearerAuth()
  @Get(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  @OperationLog({
    module: '产品中心',
    action: '更新产品',
    details: ({ body, params }) => `更新产品：${String(body.titleZh ?? params.id ?? 'unknown')}`,
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() request: RequestWithUser,
  ) {
    return this.productService.update(+id, dto, request.user?.username);
  }

  @ApiBearerAuth()
  @Post(':id/rollback/:revisionId')
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  @OperationLog({
    module: '产品中心',
    action: '恢复产品历史',
    details: ({ params }) =>
      `恢复产品历史：${String(params.id ?? 'unknown')} #${String(params.revisionId ?? 'unknown')}`,
  })
  rollback(
    @Param('id') id: string,
    @Param('revisionId') revisionId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.productService.rollback(
      +id,
      revisionId,
      request.user?.username,
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  @RequirePermissions(PERMISSIONS.CONTENT_PRODUCT_MANAGE)
  @OperationLog({
    module: '产品中心',
    action: '删除产品',
    details: ({ params }) => `删除产品：${String(params.id ?? 'unknown')}`,
  })
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.productService.remove(+id, request.user?.username);
  }
}
