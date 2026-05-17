import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EnterpriseConfigDto {
  @ApiProperty({ description: '企业中文全称', example: '东莞市尧顺科技有限公司' })
  @IsString()
  companyName: string;

  @ApiPropertyOptional({
    description: '企业英文全称',
    example: 'Dongguan Yaoshun Technology Co., Ltd.',
  })
  @IsOptional()
  @IsString()
  companyNameEn?: string;

  @ApiPropertyOptional({ description: '中文品牌名', example: '尧顺玩具' })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional({ description: '英文品牌名', example: 'Yaoshun Toys' })
  @IsOptional()
  @IsString()
  brandNameEn?: string;

  @ApiPropertyOptional({ description: '企业 Logo 地址' })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiPropertyOptional({ description: '联系邮箱' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'WhatsApp 联系方式' })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({ description: '微信联系方式' })
  @IsOptional()
  @IsString()
  wechat?: string;

  @ApiPropertyOptional({ description: '联系地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: '英文联系地址' })
  @IsOptional()
  @IsString()
  addressEn?: string;

  @ApiPropertyOptional({ description: '成立日期', example: '2016-08-26' })
  @IsOptional()
  @IsString()
  foundedAt?: string;

  @ApiPropertyOptional({ description: '注册资本', example: '300 万元人民币' })
  @IsOptional()
  @IsString()
  registeredCapital?: string;

  @ApiPropertyOptional({ description: '主营业务范围' })
  @IsOptional()
  @IsString()
  businessScope?: string;

  @ApiPropertyOptional({ description: 'SEO 关键字' })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional({ description: '企业简介' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '企业官网地址' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: '版权信息' })
  @IsOptional()
  @IsString()
  copyright?: string;

  @ApiPropertyOptional({ description: '备案号' })
  @IsOptional()
  @IsString()
  icp?: string;
}
