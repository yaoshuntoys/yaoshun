import { IsOptional, IsString, IsIn, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryFileDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'MIME 类型过滤，如 image/png' })
  @IsOptional()
  @IsString()
  mimetype?: string;

  @ApiPropertyOptional({ description: '文件名搜索关键词' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: '文件夹 ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  folderId?: number;

  @ApiPropertyOptional({
    description: '排序字段',
    enum: ['createdAt', 'size', 'originalName'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'size', 'originalName'])
  orderBy?: 'createdAt' | 'size' | 'originalName' = 'createdAt';

  @ApiPropertyOptional({ description: '排序方向', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
