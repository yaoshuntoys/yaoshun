import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { SmtpClientService } from './smtp-client.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [MailController],
  providers: [MailService, SmtpClientService],
  exports: [MailService],
})
export class MailModule {}
