import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductSpecDto {
  @ApiProperty()
  @IsString()
  labelZh: string;

  @ApiProperty()
  @IsString()
  labelEn: string;

  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  titleZh: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiProperty()
  @IsString()
  descriptionZh: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summaryZh?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summaryEn?: string;

  @ApiPropertyOptional({ type: [ProductSpecDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecDto)
  specs?: ProductSpecDto[];

  @ApiPropertyOptional({ type: 'array', additionalProperties: true })
  @IsOptional()
  @IsArray()
  productAttributes?: Record<string, unknown>[];

  @ApiPropertyOptional({ type: 'array', additionalProperties: true })
  @IsOptional()
  @IsArray()
  attributePairs?: Record<string, unknown>[];

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  pricing?: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'array', additionalProperties: true })
  @IsOptional()
  @IsArray()
  customizationOptions?: Record<string, unknown>[];

  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  seoKeywords?: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  detailConfig?: Record<string, unknown>;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  rawData?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cover?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
