import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';
import { QueryOperationLogDto } from './dto/query-operation-log.dto';
import { LogService } from './log.service';

@ApiTags('操作日志')
@ApiBearerAuth()
@Controller('admin/logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('page')
  @ApiOperation({ summary: '操作日志分页列表' })
  @RequirePermissions(PERMISSIONS.RECORD_LOG_VIEW)
  page(@Query() query: QueryOperationLogDto) {
    return this.logService.findAll(query);
  }
}
