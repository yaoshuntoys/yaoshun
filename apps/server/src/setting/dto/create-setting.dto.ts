import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty({ description: '设置键' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: '设置值' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
