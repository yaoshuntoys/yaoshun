import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { OperationLog } from '../log/decorators/operation-log.decorator';
import { RequirePermissions } from '../permission/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.constants';
import { TranslateDto } from './dto/translate.dto';
import { TranslationService } from './translation.service';

@ApiTags('通用翻译')
@ApiBearerAuth()
@Controller('admin/translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post('translate')
  @RequirePermissions(PERMISSIONS.PAGE_MANAGE)
  @ApiOperation({ summary: '通用内容翻译' })
  @OperationLog({
    module: '通用翻译',
    action: '翻译内容',
    details: ({ body }) =>
      `翻译内容：${String(body.sourceLocale ?? 'zh')} -> ${String(body.targetLocale ?? 'en')}`,
  })
  translate(@Body() dto: TranslateDto) {
    return this.translationService.translate(dto);
  }
}
