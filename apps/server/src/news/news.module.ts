import { Module } from '@nestjs/common';

import { ContentRevisionModule } from '../content-revision/content-revision.module';
import { MediaReferenceModule } from '../media-reference/media-reference.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [PrismaModule, ContentRevisionModule, MediaReferenceModule],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
