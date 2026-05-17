import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountSecurityService } from './account-security.service';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [PrismaModule, MailModule, PermissionModule],
  controllers: [AccountController],
  providers: [AccountService, AccountSecurityService],
  exports: [AccountService],
})
export class AccountModule {}
