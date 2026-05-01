import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "February 18, 2026",
    "zh": "2026 年 2 月 18 日"
  },
  "category": {
    "en": "Science Explainer",
    "zh": "科普文章"
  },
  "title": {
    "en": "Why Pilot Runs Matter Before Mass Production",
    "zh": "为什么量产前必须做试产验证"
  },
  "text": {
    "en": "Pilot runs reveal assembly mismatch, process drift, and packaging weak points that are hard to detect on bench samples. Fixing these early avoids costly rework after scale-up.",
    "zh": "试产可以提前暴露台架样品难以发现的装配偏差、工艺波动与包装薄弱点，避免放量后高成本返工。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601729187617/1.webp",
    "coverAlt": {
      "en": "Pilot build set reference",
      "zh": "试产拼搭套装示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601729187617/3.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601729187617/4.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Pilot Decision Guide",
      "zh": "试产决策指南"
    },
    "lead": {
      "en": "Pilot runs should verify what bench samples cannot: line rhythm, defect trend, and release-readiness under real production conditions.",
      "zh": "试产要验证的不只是样件外观，还包括真实节拍下的缺陷趋势和放行可行性。"
    },
    "sections": [
      {
        "title": {
          "en": "Pilot Is Not A Bigger Sample",
          "zh": "试产不是“放大版样品”"
        },
        "paragraphs": [
          {
            "en": "Pilot should verify rhythm under real line conditions: assembly takt, reject pattern, and pack-out efficiency.",
            "zh": "试产的价值在于验证真实节拍，而不是放大版打样。装配节奏、不良分布和包装效率都要在这一阶段看清楚。"
          },
          {
            "en": "Problems hidden in hand-made samples often appear when operators, fixtures, and shifts change.",
            "zh": "很多问题在手工样件阶段看不出来，往往等到换班、换工装、换人之后才集中暴露。"
          }
        ],
        "imageAlt": {
          "en": "Pilot run product set",
          "zh": "试产产品套装"
        },
        "imageCaption": {
          "en": "Pilot should simulate production context, not only verify appearance.",
          "zh": "试产应模拟量产语境，而不只是看外观。"
        }
      },
      {
        "title": {
          "en": "Go And No-Go Signals",
          "zh": "放行与拦截信号"
        },
        "paragraphs": [
          {
            "en": "No-go signals include repeated interface failure, unstable packing damage rate, and unresolved critical defect root causes.",
            "zh": "一旦出现接口失效反复、包装破损率波动大、关键缺陷根因没关掉，就该果断拦截，不要硬放量。"
          },
          {
            "en": "Go decision needs evidence package: process window, defect trend, and packaging validation result in one release file.",
            "zh": "真正放行前要把工艺窗口、缺陷趋势和包装验证放在同一份证据包里，决策才站得住。"
          }
        ],
        "imageAlt": {
          "en": "Production equipment and pilot evidence",
          "zh": "量产设备与试产证据"
        },
        "imageCaption": {
          "en": "Release should be based on evidence bundle, not calendar pressure.",
          "zh": "放行应基于证据包，而非仅基于时间压力。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Pilot Gate Checklist",
      "zh": "试产关口清单"
    },
    "checklist": [
      {
        "en": "Verify line rhythm and reject trend by shift.",
        "zh": "按班次验证节拍与不良趋势。"
      },
      {
        "en": "Block release if critical root cause remains open.",
        "zh": "关键根因未关闭时禁止放行。"
      },
      {
        "en": "Archive one integrated pilot evidence package.",
        "zh": "归档一份完整试产证据包。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
