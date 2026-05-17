import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryMailRecordDto extends PaginationDto {
  @ApiPropertyOptional({ description: '关键词，支持收件人/主题/内容/错误原因' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '场景', enum: ['message_notification', 'password_reset', 'test'] })
  @IsOptional()
  @IsIn(['message_notification', 'password_reset', 'test'])
  scene?: string;

  @ApiPropertyOptional({ description: '状态', enum: ['sent', 'failed', 'skipped'] })
  @IsOptional()
  @IsIn(['sent', 'failed', 'skipped'])
  status?: string;

  @ApiPropertyOptional({ description: '开始时间 ISO 字符串' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间 ISO 字符串' })
  @IsOptional()
  @IsString()
  endTime?: string;
}
