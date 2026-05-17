import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdatePageConfigDto {
  @ApiProperty({
    description: '页面配置内容',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  content!: Record<string, unknown>;
}

export class SavePageDraftDto {
  @ApiProperty({
    description: '中文页面配置内容',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  zh!: Record<string, unknown>;

  @ApiProperty({
    description: '英文页面配置内容',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  en!: Record<string, unknown>;
}
