import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "January 9, 2026",
    "zh": "2026 年 1 月 9 日"
  },
  "category": {
    "en": "Science Explainer",
    "zh": "科普文章"
  },
  "title": {
    "en": "Glow-Series Color Stability: Preventing Yellowing And Shade Drift",
    "zh": "夜光系列颜色稳定性：如何降低黄变与色差漂移"
  },
  "text": {
    "en": "For glow fort products, color drift can come from raw material variation, drying conditions, and process temperature windows. Stable glow-masterbatch sourcing plus controlled molding parameters are the key controls.",
    "zh": "针对夜光拼搭产品，色差漂移常由原料波动、干燥条件和工艺温区引起。稳定夜光母粒供应与受控成型参数是核心控制点。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/1.webp",
    "coverAlt": {
      "en": "Glow material color sample",
      "zh": "夜光材质颜色样件"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/5.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Color Control Playbook",
      "zh": "颜色控制手册"
    },
    "lead": {
      "en": "Glow-series color stability depends on incoming control, process windows, and storage conditions working together.",
      "zh": "夜光系列的颜色稳定性取决于来料、工艺窗口和储运条件的协同控制。"
    },
    "sections": [
      {
        "title": {
          "en": "Stabilize Material And Drying Stage",
          "zh": "先稳定来料与干燥阶段"
        },
        "paragraphs": [
          {
            "en": "Color drift frequently starts from mixed batch usage and inconsistent drying condition. Material segregation and drying logs are basic controls.",
            "zh": "夜光件的色差漂移，很多时候不是单点问题，常见原因是混批用料和干燥条件不一致。"
          },
          {
            "en": "Glow masterbatch ratio should be locked by approved range, and any adjustment must trigger sample reconfirmation.",
            "zh": "母粒比例要锁在批准区间内，任何临时调整都应先回到样件复核。"
          }
        ],
        "imageAlt": {
          "en": "Glow set color sample",
          "zh": "夜光套装颜色样件"
        },
        "imageCaption": {
          "en": "Color consistency starts before molding.",
          "zh": "颜色一致性控制始于成型之前。"
        }
      },
      {
        "title": {
          "en": "Control Process And Packing Exposure",
          "zh": "再控制成型与包装暴露"
        },
        "paragraphs": [
          {
            "en": "Molding temperature window and cooling rhythm impact shade consistency. End-of-line check should include side-by-side color cards.",
            "zh": "成型温区和冷却节奏会直接影响色调一致性，末端最好做并排色卡比对。"
          },
          {
            "en": "Avoid long light exposure before packing for glow parts that are sensitive to appearance drift in storage.",
            "zh": "对容易漂移的夜光件，包装前尽量减少强光暴露，能降低仓储阶段的外观变化。"
          }
        ],
        "imageAlt": {
          "en": "Glow color process verification",
          "zh": "夜光颜色过程验证"
        },
        "imageCaption": {
          "en": "Process window and storage control should be managed as one system.",
          "zh": "工艺窗口与储运控制应作为一个系统管理。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Color Stability Checklist",
      "zh": "颜色稳定清单"
    },
    "checklist": [
      {
        "en": "Separate material lots and track drying logs.",
        "zh": "分批用料并记录干燥日志。"
      },
      {
        "en": "Lock glow masterbatch ratio within approved range.",
        "zh": "夜光母粒比例锁定在批准区间。"
      },
      {
        "en": "Include side-by-side color card check at line end.",
        "zh": "产线末端增加并排色卡检查。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
