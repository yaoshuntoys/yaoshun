import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MailConfigDto {
  @ApiProperty({ description: 'SMTP 服务器地址', example: 'smtp.gmail.com' })
  @IsString()
  @IsNotEmpty()
  smtpHost: string;

  @ApiProperty({ description: 'SMTP 端口', example: 465 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  smtpPort: number;

  @ApiProperty({ description: '是否启用 SSL/TLS', example: true })
  @IsBoolean()
  smtpSecure: boolean;

  @ApiProperty({ description: 'SMTP 用户名', example: 'yaoshuntoys@gmail.com' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'SMTP 密码或授权码' })
  @IsString()
  password: string;

  @ApiProperty({ description: '发件人名称', example: 'Yaoshun Toys' })
  @IsString()
  @IsNotEmpty()
  fromName: string;

  @ApiProperty({ description: '发件人邮箱', example: 'yaoshuntoys@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  fromEmail: string;

  @ApiProperty({ description: '是否接收新留言通知', example: true })
  @IsBoolean()
  notifyOnContact: boolean;

  @ApiProperty({ description: '是否开启找回密码通知', example: true })
  @IsBoolean()
  notifyOnPasswordReset: boolean;
}
