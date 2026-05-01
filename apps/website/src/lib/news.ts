import {newsArticleSeeds} from '@/content/news/articles'
import type {NewsArticleSummary as NewsArticleSummaryBase, NewsDetailDraft, NewsDetailDraftSection, NewsMediaSet} from '@/content/news/types'
import type {LocalizedText} from '@/content/site/shared'
import type {Locale} from '@/lib/i18n'

type NewsArticleSummary = NewsArticleSummaryBase

export type NewsDetailSection = NewsDetailDraftSection & {image: string}

export type NewsArticleDetail = {
  formatLabel: LocalizedText
  lead: LocalizedText
  narrative: LocalizedText[]
  sections: NewsDetailSection[]
  checklistTitle: LocalizedText
  checklist: LocalizedText[]
  sourceNote: LocalizedText
}

export type NewsArticle = NewsArticleSummary & {
  slug: string
  coverImage: string
  coverImageAlt: LocalizedText
  detail: NewsArticleDetail
}

const ARTICLE_MEDIA_SETS: NewsMediaSet[] = newsArticleSeeds.map((item) => item.media)
const ARTICLE_DETAIL_DRAFTS: NewsDetailDraft[] = newsArticleSeeds.map((item) => item.detailDraft)
const NEWS_ARTICLE_SUMMARIES: NewsArticleSummary[] = newsArticleSeeds.map(({media, detailDraft, ...summary}) => summary)

const BASE_SOURCE_NOTE: LocalizedText =
  newsArticleSeeds[0]?.detailDraft?.sourceNote ||
  {
    en: 'Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.',
    zh: '内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。'
  }

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

  return normalized || 'news-article'
}

function buildFallbackDetail(article: NewsArticleSummary): NewsDetailDraft {
  return {
    formatLabel: {en: 'Article Brief', zh: '文章简报'},
    lead: {
      en: article.text.en || article.text.zh || 'Article details are being updated.',
      zh: article.text.zh || article.text.en || '文章详情正在补充中。'
    },
    sections: [
      {
        title: {en: 'Background', zh: '背景'},
        paragraphs: [
          {
            en: article.text.en || article.text.zh || 'No additional details yet.',
            zh: article.text.zh || article.text.en || '暂无更多内容。'
          }
        ],
        imageAlt: {en: 'Article reference image', zh: '文章参考图片'},
        imageCaption: {en: 'Reference image for this topic.', zh: '该主题参考图片。'}
      }
    ],
    checklistTitle: {en: 'Quick Checklist', zh: '快速清单'},
    checklist: [
      {en: 'Confirm requirement scope.', zh: '确认需求范围。'},
      {en: 'Align quality criteria.', zh: '对齐质量标准。'},
      {en: 'Review delivery readiness.', zh: '复核交付准备度。'}
    ],
    sourceNote: BASE_SOURCE_NOTE
  }
}

function resolveDetail(index: number, article: NewsArticleSummary): {media: NewsMediaSet; detail: NewsArticleDetail} {
  const media = ARTICLE_MEDIA_SETS[index] || ARTICLE_MEDIA_SETS[0]
  const draft = ARTICLE_DETAIL_DRAFTS[index] || buildFallbackDetail(article)
  return {
    media,
    detail: {
      formatLabel: draft.formatLabel,
      lead: draft.lead,
      narrative: draft.narrative || [],
      sections: draft.sections.map((section, sectionIndex) => ({
        ...section,
        image: media.sections[sectionIndex] || media.cover
      })),
      checklistTitle: draft.checklistTitle,
      checklist: draft.checklist,
      sourceNote: draft.sourceNote
    }
  }
}

export function getNewsArticles(): NewsArticle[] {
  return NEWS_ARTICLE_SUMMARIES.map((item, index) => {
    const baseTitle = item.title.en || item.title.zh || `news-article-${index + 1}`
    const slug = `${String(index + 1).padStart(2, '0')}-${slugify(baseTitle)}`
    const {media, detail} = resolveDetail(index, item)

    return {
      ...item,
      slug,
      coverImage: media.cover,
      coverImageAlt: media.coverAlt,
      detail
    }
  })
}

export function findNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return getNewsArticles().find((item) => item.slug === slug)
}

export function newsArticlePath(locale: Locale, slug: string): string {
  return `/${locale}/news/${slug}`
}

const MONTH_MAP: Record<string, string> = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12'
}

export function toIsoDateFromEnglishLabel(value: string): string | null {
  const match = value.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/)
  if (!match) return null

  const month = MONTH_MAP[match[1].toLowerCase()]
  if (!month) return null

  const day = match[2].padStart(2, '0')
  const year = match[3]

  return `${year}-${month}-${day}`
}
