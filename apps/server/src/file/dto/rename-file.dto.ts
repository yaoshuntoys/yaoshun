import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RenameFileDto {
  @ApiProperty({ description: '新的显示名称（不含扩展名）' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[^/\\:*?"<>|]+$/, { message: '文件名包含非法字符' })
  name: string;
}
