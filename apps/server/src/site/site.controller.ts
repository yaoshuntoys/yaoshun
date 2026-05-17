import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/public.decorator';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { MessageService } from '../message/message.service';
import { PageService } from '../page/page.service';
import { QueryFaqDto } from '../faq/dto/query-faq.dto';
import { QueryNewsDto } from '../news/dto/query-news.dto';
import { QueryPartnerDto } from '../partner/dto/query-partner.dto';
import { QueryProductDto } from '../product/dto/query-product.dto';
import { FaqService } from '../faq/faq.service';
import { NewsService } from '../news/news.service';
import { PartnerService } from '../partner/partner.service';
import { ProductService } from '../product/product.service';
import { SettingService } from '../setting/setting.service';

@ApiTags('官网公开接口')
@Public()
@Controller('site')
export class SiteController {
  constructor(
    private readonly settingService: SettingService,
    private readonly pageService: PageService,
    private readonly productService: ProductService,
    private readonly newsService: NewsService,
    private readonly faqService: FaqService,
    private readonly partnerService: PartnerService,
    private readonly messageService: MessageService,
  ) {}

  @Get('config')
  @ApiOperation({ summary: '获取公开站点配置' })
  getConfig() {
    return this.settingService.getPublicEnterpriseConfig();
  }

  @Get('pages/:key')
  @ApiOperation({ summary: '获取已发布页面配置' })
  getPage(@Param('key') key: string) {
    return this.pageService.findPublished(key);
  }

  @Get('products')
  @ApiOperation({ summary: '获取公开商品列表' })
  getProducts(@Query() query: QueryProductDto) {
    return this.productService.findAll(query, true);
  }

  @Get('products/:slug')
  @ApiOperation({ summary: '获取公开商品详情' })
  getProduct(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug, true);
  }

  @Get('news')
  @ApiOperation({ summary: '获取公开新闻列表' })
  getNewsList(@Query() query: QueryNewsDto) {
    return this.newsService.findAll(query, true);
  }

  @Get('news/:slug')
  @ApiOperation({ summary: '获取公开新闻详情' })
  getNews(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug, true);
  }

  @Get('faqs')
  @ApiOperation({ summary: '获取公开 FAQ 列表' })
  getFaqs(@Query() query: QueryFaqDto) {
    return this.faqService.findAll(query, true);
  }

  @Get('partners')
  @ApiOperation({ summary: '获取公开合作客户列表' })
  getPartners(@Query() query: QueryPartnerDto) {
    return this.partnerService.findAll(query, true);
  }

  @Post('contact-message')
  @ApiOperation({ summary: '提交官网客户留言' })
  createContactMessage(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }
}
