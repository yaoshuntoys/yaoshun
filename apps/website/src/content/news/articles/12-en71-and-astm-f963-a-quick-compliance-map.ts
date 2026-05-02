import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "January 16, 2026",
    "zh": "2026 年 1 月 16 日"
  },
  "category": {
    "en": "Science Explainer",
    "zh": "科普文章"
  },
  "title": {
    "en": "EN71 And ASTM F963: A Quick Compliance Map",
    "zh": "EN71 与 ASTM F963 的快速合规对照"
  },
  "text": {
    "en": "Different markets ask for different safety frameworks, but both standards emphasize material safety, mechanical hazards, and labeling clarity. Early target-market definition prevents repeated testing.",
    "zh": "不同市场对应不同标准框架，但都关注材料安全、机械风险与标签信息。越早明确目标市场，越能减少重复测试。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601362237263/3.webp",
    "coverAlt": {
      "en": "Compliance sample set",
      "zh": "合规测试样品组"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601362237263/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601362237263/5.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Compliance Mapping",
      "zh": "合规速查图"
    },
    "lead": {
      "en": "A quick EN71 and ASTM F963 map helps teams set market-specific compliance priorities earlier in the project.",
      "zh": "将 EN71 与 ASTM F963 先做市场映射，能更早明确项目合规优先级。"
    },
    "sections": [
      {
        "title": {
          "en": "Map Standards To Market Early",
          "zh": "先把标准映射到目标市场"
        },
        "paragraphs": [
          {
            "en": "If destination markets are not frozen early, projects often repeat tests because submission path and label requirements shift midway.",
            "zh": "目标市场如果不在前期冻结，项目中途很容易因为送检路径和标签要求变化而被迫重测。"
          },
          {
            "en": "A simple market-to-standard matrix should be part of kickoff package, not added near shipment.",
            "zh": "所以市场和标准的映射表应该放进立项包里，而不是临近出货才临时补。"
          }
        ],
        "imageAlt": {
          "en": "Compliance sample product set",
          "zh": "合规测试样品组"
        },
        "imageCaption": {
          "en": "Compliance planning begins at market definition stage.",
          "zh": "合规规划应从市场定义阶段开始。"
        }
      },
      {
        "title": {
          "en": "Schedule Tests By Risk Priority",
          "zh": "按风险优先级排测试顺序"
        },
        "paragraphs": [
          {
            "en": "Material safety and mechanical hazard items usually deserve early testing, while low-risk documentation checks can be parallelized later.",
            "zh": "在排测试顺序时，材料安全和机械风险建议前置，低风险文档项可以后排并行。"
          },
          {
            "en": "This sequencing improves launch predictability and avoids late-stage blocking caused by one failed critical item.",
            "zh": "这样做的好处是上市节奏更可预期，不会因为一个关键项失败把后面全部拖住。"
          }
        ],
        "imageAlt": {
          "en": "Cross-market toy compliance sample",
          "zh": "跨市场玩具合规样件"
        },
        "imageCaption": {
          "en": "Sequence tests by risk impact, not by convenience.",
          "zh": "测试排序应按风险影响，而不是按执行便利。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Compliance Kickoff Checklist",
      "zh": "合规立项清单"
    },
    "checklist": [
      {
        "en": "Freeze destination market list before test booking.",
        "zh": "预约测试前先冻结目标市场清单。"
      },
      {
        "en": "Create market-to-standard matrix in kickoff package.",
        "zh": "立项包内建立市场-标准映射矩阵。"
      },
      {
        "en": "Prioritize high-risk test items in early phase.",
        "zh": "高风险测试项前置执行。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
