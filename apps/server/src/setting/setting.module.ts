import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { ContentRevisionModule } from '../content-revision/content-revision.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { MediaReferenceModule } from '../media-reference/media-reference.module';

@Module({
  imports: [PrismaModule, ContentRevisionModule, MailModule, MediaReferenceModule],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
