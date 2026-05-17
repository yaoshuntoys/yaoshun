import { Module } from '@nestjs/common';

import { ContentRevisionModule } from '../content-revision/content-revision.module';
import { MediaReferenceModule } from '../media-reference/media-reference.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';

@Module({
  imports: [PrismaModule, ContentRevisionModule, MediaReferenceModule],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class FaqModule {}
