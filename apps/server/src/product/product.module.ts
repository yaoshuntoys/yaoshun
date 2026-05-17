import { Module } from '@nestjs/common';

import { ContentRevisionModule } from '../content-revision/content-revision.module';
import { MediaReferenceModule } from '../media-reference/media-reference.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [PrismaModule, ContentRevisionModule, MediaReferenceModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
