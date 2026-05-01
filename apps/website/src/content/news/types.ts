import type {LocalizedText} from '@/content/site/shared'

export type NewsArticleSummary = {
  date: LocalizedText
  category: LocalizedText
  title: LocalizedText
  text: LocalizedText
}

export type NewsDetailDraftSection = {
  title: LocalizedText
  paragraphs: LocalizedText[]
  imageAlt: LocalizedText
  imageCaption: LocalizedText
}

export type NewsDetailDraft = {
  formatLabel: LocalizedText
  lead: LocalizedText
  narrative?: LocalizedText[]
  sections: NewsDetailDraftSection[]
  checklistTitle: LocalizedText
  checklist: LocalizedText[]
  sourceNote: LocalizedText
}

export type NewsMediaSet = {
  cover: string
  coverAlt: LocalizedText
  sections: string[]
}

export type NewsArticleSeed = NewsArticleSummary & {
  media: NewsMediaSet
  detailDraft: NewsDetailDraft
}
