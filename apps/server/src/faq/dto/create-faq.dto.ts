import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty()
  @IsString()
  categoryKey: string;

  @ApiProperty()
  @IsString()
  categoryLabelZh: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryLabelEn?: string;

  @ApiProperty()
  @IsString()
  questionZh: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  questionEn?: string;

  @ApiProperty()
  @IsString()
  answerZh: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  answerEn?: string;

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
