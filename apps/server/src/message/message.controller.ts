import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';

@ApiTags('留言反馈')
@ApiBearerAuth()
@Controller('admin/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('create')
  @ApiOperation({ summary: '提交留言' })
  @RequirePermissions(PERMISSIONS.CUSTOMER_MESSAGE_MANAGE)
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }

  @Get('page')
  @ApiOperation({ summary: '留言分页列表' })
  @RequirePermissions(PERMISSIONS.CUSTOMER_MESSAGE_MANAGE)
  findAll(@Query() query: { page?: string; pageSize?: string; isRead?: string; keyword?: string }) {
    return this.messageService.findAll(query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: '未读留言数量' })
  @RequirePermissions(PERMISSIONS.CUSTOMER_MESSAGE_MANAGE)
  unreadCount() {
    return this.messageService.unreadCount();
  }

  @Post('detail')
  @ApiOperation({ summary: '留言详情（自动标记已读）' })
  @RequirePermissions(PERMISSIONS.CUSTOMER_MESSAGE_MANAGE)
  @OperationLog({
    module: '留言管理',
    action: '查看留言详情',
    details: ({ result, body }) =>
      `查看留言详情：${String((result as { email?: string; name?: string })?.name ?? (result as { email?: string })?.email ?? (body.id ?? 'unknown'))}`,
  })
  findOne(@Body() body: { id: number }) {
    return this.messageService.findOne(body.id);
  }

  @Post('mark-read')
  @ApiOperation({ summary: '标记已读' })
  @RequirePermissions(PERMISSIONS.CUSTOMER_MESSAGE_MANAGE)
  @OperationLog({
    module: '留言管理',
    action: '标记已读',
    details: ({ result, body }) =>
      `标记留言已读：${String((result as { name?: string; email?: string })?.name ?? (result as { email?: string })?.email ?? (body.id ?? 'unknown'))}`,
  })
  markRead(@Body() body: { id: number }) {
    return this.messageService.markRead(body.id);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除留言' })
  @RequirePermissions(PERMISSIONS.CUSTOMER_MESSAGE_MANAGE)
  @OperationLog({
    module: '留言管理',
    action: '删除留言',
    details: ({ result, body }) =>
      `删除留言：${String((result as { name?: string; email?: string })?.name ?? (result as { email?: string })?.email ?? (body.id ?? 'unknown'))}`,
  })
  remove(@Body() body: { id: number }) {
    return this.messageService.remove(body.id);
  }
}
