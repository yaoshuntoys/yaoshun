import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { MediaReferenceService } from './media-reference.service';

@Module({
  imports: [PrismaModule],
  providers: [MediaReferenceService],
  exports: [MediaReferenceService],
})
export class MediaReferenceModule {}
