import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';

@ApiTags('账号管理')
@ApiBearerAuth()
@Controller('admin/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('page')
  @ApiOperation({ summary: '分页获取账号列表' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  page(@Query() query: QueryAccountDto) {
    return this.accountService.findAll(query);
  }

  @Get('list')
  @ApiOperation({ summary: '获取全部账号列表' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  list() {
    return this.accountService.findList();
  }

  @Post('detail')
  @ApiOperation({ summary: '获取账号详情' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  detail(@Body() body: { id: number }) {
    return this.accountService.findOne(body.id);
  }

  @Post('create')
  @ApiOperation({ summary: '创建账号' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  @OperationLog({
    module: '账号管理',
    action: '创建账号',
    details: ({ result, body }) =>
      `创建账号：${String((result as { username?: string })?.username ?? (body.username ?? 'unknown'))}`,
  })
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @Post('update')
  @ApiOperation({ summary: '更新账号信息' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  @OperationLog({
    module: '账号管理',
    action: '更新账号',
    details: ({ result, body }) =>
      `更新账号：${String((result as { username?: string })?.username ?? (body.id ?? 'unknown'))}`,
  })
  update(@Body() dto: UpdateAccountDto & { id: number }) {
    const { id, ...rest } = dto;
    return this.accountService.update(id, rest);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除账号' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  @OperationLog({
    module: '账号管理',
    action: '删除账号',
    details: ({ result, body }) =>
      `删除账号：${String((result as { username?: string })?.username ?? (body.id ?? 'unknown'))}`,
  })
  remove(@Body() body: { id: number }) {
    return this.accountService.remove(body.id);
  }

  @Post('reset-password')
  @ApiOperation({ summary: '重置密码' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  @OperationLog({
    module: '账号管理',
    action: '重置密码',
    details: ({ result, body }) =>
      `重置账号密码：${String((result as { username?: string })?.username ?? (body.id ?? 'unknown'))}`,
  })
  resetPassword(
    @Body() body: { id: number; password: string },
  ): Promise<unknown> {
    return this.accountService.resetPassword(body.id, body.password);
  }

  @Post('toggle')
  @ApiOperation({ summary: '切换账号状态' })
  @RequirePermissions(PERMISSIONS.SYSTEM_ACCOUNT_MANAGE)
  @OperationLog({
    module: '账号管理',
    action: '切换账号状态',
    details: ({ result, body }) => {
      const account = result as { username?: string; status?: string };
      return `切换账号状态：${String(account.username ?? body.id ?? 'unknown')} -> ${String(account.status ?? 'unknown')}`;
    },
  })
  toggleStatus(@Body() body: { id: number }): Promise<unknown> {
    return this.accountService.toggleStatus(body.id);
  }
}
