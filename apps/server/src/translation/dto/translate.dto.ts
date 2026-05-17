import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow, IsIn, IsOptional, IsString } from 'class-validator';

export type TranslatableContent =
  | string
  | number
  | boolean
  | null
  | TranslatableContent[]
  | { [key: string]: TranslatableContent };

export class TranslateDto {
  @ApiPropertyOptional({ default: 'zh' })
  @IsOptional()
  @IsString()
  @IsIn(['zh', 'en'])
  sourceLocale?: 'zh' | 'en';

  @ApiPropertyOptional({ default: 'en' })
  @IsOptional()
  @IsString()
  @IsIn(['zh', 'en'])
  targetLocale?: 'zh' | 'en';

  @ApiProperty({
    description: '待翻译内容，支持字符串、数组和对象',
    oneOf: [
      { type: 'string' },
      { type: 'array' },
      { type: 'object', additionalProperties: true },
    ],
  })
  @Allow()
  content!: TranslatableContent;
}
