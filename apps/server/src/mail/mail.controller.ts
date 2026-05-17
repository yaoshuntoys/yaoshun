import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';
import { QueryMailRecordDto } from './dto/query-mail-record.dto';
import { MailService } from './mail.service';

@ApiTags('邮件记录')
@ApiBearerAuth()
@Controller('admin/mail-records')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('page')
  @ApiOperation({ summary: '邮件记录分页列表' })
  @RequirePermissions(PERMISSIONS.RECORD_MAIL_VIEW)
  page(@Query() query: QueryMailRecordDto) {
    return this.mailService.page(query);
  }
}
