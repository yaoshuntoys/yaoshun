import { Module } from '@nestjs/common';

import { FaqModule } from '../faq/faq.module';
import { MessageModule } from '../message/message.module';
import { NewsModule } from '../news/news.module';
import { PageModule } from '../page/page.module';
import { PartnerModule } from '../partner/partner.module';
import { ProductModule } from '../product/product.module';
import { SettingModule } from '../setting/setting.module';
import { SiteController } from './site.controller';

@Module({
  imports: [
    SettingModule,
    PageModule,
    ProductModule,
    NewsModule,
    FaqModule,
    PartnerModule,
    MessageModule,
  ],
  controllers: [SiteController],
})
export class SiteModule {}
