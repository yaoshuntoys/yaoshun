import { Module } from '@nestjs/common';

import { ContentRevisionModule } from '../content-revision/content-revision.module';
import { MediaReferenceModule } from '../media-reference/media-reference.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  imports: [PrismaModule, ContentRevisionModule, MediaReferenceModule],
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
