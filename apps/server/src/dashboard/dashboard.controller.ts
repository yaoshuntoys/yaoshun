import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';
import { DashboardService } from './dashboard.service';

@ApiTags('仪表盘')
@ApiBearerAuth()
@Controller('admin/dashboard')
@RequirePermissions(PERMISSIONS.DASHBOARD_VIEW)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: '获取仪表盘统计数据' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('activities')
  @ApiOperation({ summary: '获取最近操作动态' })
  getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }
}
