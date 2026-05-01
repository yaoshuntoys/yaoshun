import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "January 24, 2026",
    "zh": "2026 年 1 月 24 日"
  },
  "category": {
    "en": "Science Explainer",
    "zh": "科普文章"
  },
  "title": {
    "en": "AQL Sampling In Plain Language For Buyer Teams",
    "zh": "采购团队易懂版 AQL 抽检说明"
  },
  "text": {
    "en": "AQL does not mean zero defects; it defines acceptable risk under a sampling plan. Understanding lot size, sample size, and acceptance numbers helps both sides avoid disputes.",
    "zh": "AQL 并不等于零缺陷，而是通过抽样方案约定可接受风险。理解批量、抽样量和接收数，能显著减少交付争议。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601214840405/1.webp",
    "coverAlt": {
      "en": "Procurement sampling batch",
      "zh": "采购抽检批次示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601214840405/3.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601214840405/4.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Procurement FAQ",
      "zh": "采购问答"
    },
    "lead": {
      "en": "For buyer teams, understanding AQL as a risk-control method helps avoid common acceptance disputes at shipment stage.",
      "zh": "对采购团队来说，把 AQL 理解为风险控制方法，能明显减少出货验收争议。"
    },
    "sections": [
      {
        "title": {
          "en": "Q1: Does AQL Mean Zero Defect?",
          "zh": "Q1：AQL 是否等于零缺陷？"
        },
        "paragraphs": [
          {
            "en": "No. AQL defines acceptable risk level under a sampling plan. It is a decision framework, not a promise that every unit is flawless.",
            "zh": "先说结论：AQL 不是“零缺陷承诺”，它本质上是抽样条件下的风险约定。"
          },
          {
            "en": "If teams expect zero-defect language but execute AQL sampling, disputes are almost guaranteed at shipment review stage.",
            "zh": "如果前期对外说“零缺陷”，执行时却按 AQL 抽检，出货评审阶段基本都会起争议。"
          }
        ],
        "imageAlt": {
          "en": "Sampling lot visual example",
          "zh": "抽样批次示意图"
        },
        "imageCaption": {
          "en": "AQL is a risk agreement model, not a perfection model.",
          "zh": "AQL 是风险约定模型，不是完美模型。"
        }
      },
      {
        "title": {
          "en": "Q2: How To Use AQL In Real Projects?",
          "zh": "Q2：项目里如何正确使用 AQL？"
        },
        "paragraphs": [
          {
            "en": "Align lot size, sample size, and defect classification before inspection day. Keep evidence photos and codebook consistent between both teams.",
            "zh": "验货日前要把批量、抽样量和缺陷分级先对齐，证据照片和编码词典也要用同一套。"
          },
          {
            "en": "For repeated SKUs, maintain a rolling defect trend so acceptance decisions are based on trajectory, not one-time snapshots.",
            "zh": "对复购 SKU，建议持续看滚动趋势，不要只盯某一次抽检结果。"
          }
        ],
        "imageAlt": {
          "en": "Procurement batch comparison sample",
          "zh": "采购批次对比样件"
        },
        "imageCaption": {
          "en": "AQL works best when rule, evidence, and trend are connected.",
          "zh": "规则、证据、趋势联动时，AQL 才真正有效。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Buyer AQL Checklist",
      "zh": "采购AQL检查清单"
    },
    "checklist": [
      {
        "en": "Confirm lot size and sample size before inspection date.",
        "zh": "验货日前确认批量与抽样量。"
      },
      {
        "en": "Use one defect codebook on both sides.",
        "zh": "双方使用同一缺陷编码词典。"
      },
      {
        "en": "Track recurring SKU defect trends across batches.",
        "zh": "跨批次追踪重复 SKU 缺陷趋势。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
