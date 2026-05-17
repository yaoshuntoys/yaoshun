import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { TranslatableContent, TranslateDto } from './dto/translate.dto';

export interface TranslateResult {
  sourceLocale: 'zh' | 'en';
  targetLocale: 'zh' | 'en';
  provider: string;
  translated: TranslatableContent;
}

@Injectable()
export class TranslationService {
  constructor(private readonly configService: ConfigService) {}

  async translate(dto: TranslateDto): Promise<TranslateResult> {
    const sourceLocale = dto.sourceLocale ?? 'zh';
    const targetLocale = dto.targetLocale ?? 'en';
    const provider = this.configService.get<string>('TRANSLATION_PROVIDER') || 'fallback';

    return {
      sourceLocale,
      targetLocale,
      provider,
      translated: this.translateValue(dto.content),
    };
  }

  private translateValue(value: TranslatableContent): TranslatableContent {
    if (Array.isArray(value)) {
      return value.map((item) => this.translateValue(item));
    }

    if (value && typeof value === 'object') {
      return this.translateObject(value);
    }

    if (typeof value !== 'string') {
      return value;
    }

    if (this.shouldKeepOriginal(value)) {
      return value;
    }

    // Fallback provider keeps the original text so the save/publish workflow is
    // usable before a real translation provider is configured.
    return value;
  }

  private translateObject(
    value: Record<string, TranslatableContent>,
  ): Record<string, TranslatableContent> {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, this.translateValue(entry)]),
    );
  }

  private shouldKeepOriginal(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) return true;
    if (/^https?:\/\//i.test(trimmed)) return true;
    if (/^\/[\w./-]+$/.test(trimmed)) return true;
    if (/^[\w.-]+@[\w.-]+\.\w+$/.test(trimmed)) return true;
    if (/^[+()\d\s-]+$/.test(trimmed)) return true;
    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(trimmed)) return true;
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(trimmed)) return true;
    return false;
  }
}
