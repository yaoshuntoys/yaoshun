import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "February 27, 2026",
    "zh": "2026 年 2 月 27 日"
  },
  "category": {
    "en": "Supplier Program",
    "zh": "供应链项目"
  },
  "title": {
    "en": "Supplier Workshop Focuses On PP Glow-Masterbatch Stability",
    "zh": "供应商培训聚焦 PP 夜光母粒稳定性"
  },
  "text": {
    "en": "The latest workshop focused on batch consistency, moisture control, and contamination checks for glow-series fort rods and connector balls. Color effect and impact strength are reviewed together in the same incoming process.",
    "zh": "本期培训重点覆盖夜光系列帐篷杆与连接珠的批次一致性、水分控制与杂质检测。来料环节将发光效果与冲击强度一并评审。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/1.webp",
    "coverAlt": {
      "en": "Glow fort component sample",
      "zh": "夜光拼搭件样品"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/3.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601110728943/5.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Supplier Workshop Memo",
      "zh": "供应链培训纪要"
    },
    "lead": {
      "en": "The supplier workshop summarized practical controls for PP glow-masterbatch stability and incoming risk management.",
      "zh": "本次供应商培训沉淀了 PP 夜光母粒稳定性的关键控制点和来料管理方法。"
    },
    "sections": [
      {
        "title": {
          "en": "Incoming Control Focus",
          "zh": "来料控制重点"
        },
        "paragraphs": [
          {
            "en": "Batch color shift, moisture, and contamination are three top failure sources for glow components and should be checked together.",
            "zh": "对夜光件来说，批次色偏、含水率和杂质是最常见的三类失稳来源，来料时要一起看。"
          },
          {
            "en": "A fast incoming panel under fixed light condition helps detect outlier batches before molding starts.",
            "zh": "固定光源下做来料快检很有用，异常批次通常在开机前就能被识别出来。"
          }
        ],
        "imageAlt": {
          "en": "Glow component incoming batch",
          "zh": "夜光部件来料批次"
        },
        "imageCaption": {
          "en": "Incoming checks must combine visual and process indicators.",
          "zh": "来料检查要同时看外观指标和工艺指标。"
        }
      },
      {
        "title": {
          "en": "Process Window In Production",
          "zh": "产线过程窗口控制"
        },
        "paragraphs": [
          {
            "en": "Drying time and melt temperature strongly impact glow consistency. Line settings should be bounded with alarms, not operator memory only.",
            "zh": "干燥时长和熔融温区一旦波动，夜光一致性就会明显下滑，所以参数要有报警边界，不能只靠老师傅经验。"
          },
          {
            "en": "Shift-end sample retention helps compare trend drift between lots and supports faster correction at next run.",
            "zh": "每个班次留一组末样，后面比对批间趋势会直观很多，也方便下一轮快速修正。"
          }
        ],
        "imageAlt": {
          "en": "Glow line quality comparison",
          "zh": "夜光产线质量对比"
        },
        "imageCaption": {
          "en": "Stability comes from controlled windows, not single-point tuning.",
          "zh": "稳定性来自参数窗口控制，而非单点调机。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Supplier Alignment Checklist",
      "zh": "供应商对齐清单"
    },
    "checklist": [
      {
        "en": "Use fixed-light incoming color panel.",
        "zh": "使用固定光源来料比对板。"
      },
      {
        "en": "Set moisture and temperature alarm thresholds.",
        "zh": "设置水分和温区报警阈值。"
      },
      {
        "en": "Retain shift-end samples for trend review.",
        "zh": "留存班次末样用于趋势复盘。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
