import { Module } from '@nestjs/common';

import { ContentRevisionModule } from '../content-revision/content-revision.module';
import { MediaReferenceModule } from '../media-reference/media-reference.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

@Module({
  imports: [PrismaModule, ContentRevisionModule, MediaReferenceModule],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
