import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "December 20, 2025",
    "zh": "2025 年 12 月 20 日"
  },
  "category": {
    "en": "Engineering Explainer",
    "zh": "工程科普"
  },
  "title": {
    "en": "Servo Tube Cutting Basics: Why Length Tolerance Matters",
    "zh": "伺服裁管基础：为什么长度公差会影响拼搭体验"
  },
  "text": {
    "en": "In toy fort PP tube sets, unstable cut length can cause frame looseness and uneven corner stress. Servo cutting with routine blade checks helps keep assembly fit and repeatability in control.",
    "zh": "在玩具帐篷 PP 管套件中，裁切长度不稳会导致框架松动与角位受力不均。通过伺服裁断并结合刀具点检，可稳定装配匹配和重复一致性。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601313719232/3.webp",
    "coverAlt": {
      "en": "Servo cutter and tube process line",
      "zh": "伺服裁断与管件工序线"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601313719232/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601313719232/5.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Equipment Operation SOP",
      "zh": "设备SOP"
    },
    "lead": {
      "en": "Servo tube-cutting tolerance has a direct impact on fort assembly fit and should be controlled as a daily core process.",
      "zh": "伺服裁管公差会直接影响拼搭装配体验，应作为日常核心工艺项持续控制。"
    },
    "sections": [
      {
        "title": {
          "en": "Tolerance Strategy For Assembly Fit",
          "zh": "面向装配匹配的公差策略"
        },
        "paragraphs": [
          {
            "en": "In fort tube systems, unstable cut length leads to uneven node stress and visible frame skew after assembly.",
            "zh": "在帐篷管件系统里，长度一旦波动，节点受力就会不均，装起来常见的结果就是框架歪斜。"
          },
          {
            "en": "Set tolerance bands by tube role and validate insertion-force consistency during first-piece checks.",
            "zh": "公差带要按管件功能分开设定，并在首件阶段同步确认插接力是否一致。"
          }
        ],
        "imageAlt": {
          "en": "Servo cutting machine operation",
          "zh": "伺服裁断设备运行"
        },
        "imageCaption": {
          "en": "Length tolerance directly impacts final assembly feel.",
          "zh": "长度公差会直接影响最终装配体验。"
        }
      },
      {
        "title": {
          "en": "Daily Control And Preventive Maintenance",
          "zh": "日常控制与预防性保养"
        },
        "paragraphs": [
          {
            "en": "Blade wear, feed drift, and sensor offset should be checked by shift to avoid silent drift in length output.",
            "zh": "刀具磨损、送料偏移和传感器偏差建议按班次点检，不然会出现“没报警但长度慢慢漂”的隐性问题。"
          },
          {
            "en": "A short first-piece and last-piece comparison record gives quick evidence for line stability before lot release.",
            "zh": "每批保留首件和末件对比记录，放行前看一眼，产线稳不稳基本就有数了。"
          }
        ],
        "imageAlt": {
          "en": "Tube and connector process sample",
          "zh": "管件与连接件工艺样件"
        },
        "imageCaption": {
          "en": "Stable equipment rhythm is the foundation of stable assembly rhythm.",
          "zh": "设备节奏稳定，是装配节奏稳定的前提。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Servo Cutting SOP Checklist",
      "zh": "伺服裁断SOP清单"
    },
    "checklist": [
      {
        "en": "Define tolerance band by tube function role.",
        "zh": "按管件功能定义长度公差带。"
      },
      {
        "en": "Run shift-based blade and sensor checks.",
        "zh": "执行班次级刀具与传感器点检。"
      },
      {
        "en": "Archive first-piece and last-piece comparison records.",
        "zh": "归档首件与末件对比记录。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
