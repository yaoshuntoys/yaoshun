import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: '主题', required: false })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ description: '留言内容' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
