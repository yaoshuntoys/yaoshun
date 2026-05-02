import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "March 15, 2026",
    "zh": "2026 年 3 月 15 日"
  },
  "category": {
    "en": "Quality Update",
    "zh": "质量动态"
  },
  "title": {
    "en": "Visual Defect Atlas 2.0 Released For Sampling Stage",
    "zh": "打样阶段外观缺陷图谱 2.0 发布"
  },
  "text": {
    "en": "A refreshed defect atlas now defines acceptance examples for color difference, flow marks, and minor flash. Sampling reviews can align decisions faster across teams.",
    "zh": "新版图谱补充了色差、流痕与轻微披锋的判定样例，打样评审时可更快形成统一判断。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/1.webp",
    "coverAlt": {
      "en": "Glow-series toy visual sample",
      "zh": "夜光系列外观样件"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/5.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Visual Standard Update",
      "zh": "判定标准更新"
    },
    "lead": {
      "en": "Visual defect atlas 2.0 improves sampling-stage consistency by giving teams clearer acceptance boundaries.",
      "zh": "外观缺陷图谱 2.0 通过更清晰的边界样例，提升了打样阶段的一致判定。"
    },
    "sections": [
      {
        "title": {
          "en": "Define Defect Grades With Examples",
          "zh": "用示例定义缺陷等级"
        },
        "paragraphs": [
          {
            "en": "Color drift, flow mark, and flash need visual examples for acceptable and reject boundaries. Text-only rules are not enough.",
            "zh": "色差、流痕、披锋这些问题，光靠文字很难统一标准，必须配“可接受/不可接受”的边界样图。"
          },
          {
            "en": "The atlas should include lighting condition, view distance, and inspection angle to keep review context stable.",
            "zh": "图谱里还要写明光照、观察距离和角度，不然同一件样品换个人看就会得出不同结论。"
          }
        ],
        "imageAlt": {
          "en": "Glow toy appearance sample",
          "zh": "夜光玩具外观样件"
        },
        "imageCaption": {
          "en": "Visual standards must include boundary examples, not only labels.",
          "zh": "外观标准必须有边界样例，而不仅是标签描述。"
        }
      },
      {
        "title": {
          "en": "Calibrate Teams Before Formal Review",
          "zh": "正式评审前先做团队标定"
        },
        "paragraphs": [
          {
            "en": "Run quick cross-role calibration with engineering, quality, and merchandising teams so acceptance language is aligned before buyer review.",
            "zh": "正式给客户看样前，先让工程、质量和业务做一轮内部标定，先把口径对齐。"
          },
          {
            "en": "Keep approved golden samples and photo IDs synchronized to avoid drift in later reruns.",
            "zh": "金样和图片编号要一起维护，后面复样时才不会因为版本混乱而跑偏。"
          }
        ],
        "imageAlt": {
          "en": "Glow series quality sample",
          "zh": "夜光系列质量样件"
        },
        "imageCaption": {
          "en": "Calibration first, review second, argument last.",
          "zh": "先标定、再评审，最后才讨论争议项。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Visual Review Checklist",
      "zh": "外观评审清单"
    },
    "checklist": [
      {
        "en": "Pair each defect grade with a photo example.",
        "zh": "每级缺陷都要对应图片示例。"
      },
      {
        "en": "Lock lighting and viewing distance in the checklist.",
        "zh": "检查清单中锁定光照与观察距离。"
      },
      {
        "en": "Maintain golden sample IDs for rerun alignment.",
        "zh": "维护金样编号用于复样对齐。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
