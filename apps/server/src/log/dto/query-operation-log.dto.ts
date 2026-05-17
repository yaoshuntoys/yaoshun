import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryOperationLogDto extends PaginationDto {
  @ApiPropertyOptional({ description: '操作人 ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({ description: '操作模块' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ description: '关键字，搜索操作人/操作/详情' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '开始时间 ISO 字符串' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间 ISO 字符串' })
  @IsOptional()
  @IsString()
  endTime?: string;
}
