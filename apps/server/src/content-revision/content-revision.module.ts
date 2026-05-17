import { Module } from '@nestjs/common';

import { ContentRevisionService } from './content-revision.service';

@Module({
  providers: [ContentRevisionService],
  exports: [ContentRevisionService],
})
export class ContentRevisionModule {}

