import { Module } from '@nestjs/common';

import { KeepaliveController } from './keepalive.controller';
import { KeepaliveService } from './keepalive.service';

@Module({
  controllers: [KeepaliveController],
  providers: [KeepaliveService],
})
export class KeepaliveModule {}
