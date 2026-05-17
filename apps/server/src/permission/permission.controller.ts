import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from './decorators/permissions.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PERMISSIONS } from './permission.constants';
import { PermissionService } from './permission.service';

@ApiTags('角色权限')
@ApiBearerAuth()
@Controller('admin/roles')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('page')
  @ApiOperation({ summary: '角色分页列表' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  page(@Query() query: QueryRoleDto) {
    return this.permissionService.page(query);
  }

  @Get('list')
  @ApiOperation({ summary: '角色列表' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  list(@Query('status') status?: string) {
    return this.permissionService.list(status);
  }

  @Get('assignable-roles')
  @ApiOperation({ summary: '获取可分配角色列表' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  assignableRoles() {
    return this.permissionService.list('active');
  }

  @Get('catalog')
  @ApiOperation({ summary: '权限目录' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  catalog() {
    return this.permissionService.listPermissions();
  }

  @Post('detail')
  @ApiOperation({ summary: '角色详情' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  detail(@Body() body: { id: number }) {
    return this.permissionService.detail(body.id);
  }

  @Post('create')
  @ApiOperation({ summary: '创建角色' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  @OperationLog({
    module: '角色管理',
    action: '创建角色',
    details: ({ result, body }) =>
      `创建角色：${String((result as { name?: string })?.name ?? body.name ?? 'unknown')}`,
  })
  create(@Body() dto: CreateRoleDto) {
    return this.permissionService.create(dto);
  }

  @Post('update')
  @ApiOperation({ summary: '更新角色' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  @OperationLog({
    module: '角色管理',
    action: '更新角色',
    details: ({ result, body }) =>
      `更新角色：${String((result as { name?: string })?.name ?? body.id ?? 'unknown')}`,
  })
  update(@Body() dto: UpdateRoleDto & { id: number }) {
    const { id, ...rest } = dto;
    return this.permissionService.update(id, rest);
  }

  @Post('toggle')
  @ApiOperation({ summary: '切换角色状态' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  @OperationLog({
    module: '角色管理',
    action: '切换角色状态',
    details: ({ result, body }) =>
      `切换角色状态：${String((result as { code?: string; status?: string })?.code ?? body.id ?? 'unknown')} -> ${String((result as { status?: string })?.status ?? 'unknown')}`,
  })
  toggle(@Body() body: { id: number }) {
    return this.permissionService.toggle(body.id);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除角色' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ROLE_MANAGE)
  @OperationLog({
    module: '角色管理',
    action: '删除角色',
    details: ({ result, body }) =>
      `删除角色：${String((result as { code?: string })?.code ?? body.id ?? 'unknown')}`,
  })
  remove(@Body() body: { id: number }) {
    return this.permissionService.remove(body.id);
  }
}
