import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "February 1, 2026",
    "zh": "2026 年 2 月 1 日"
  },
  "category": {
    "en": "Science Explainer",
    "zh": "科普文章"
  },
  "title": {
    "en": "How Injection-Molding Shrinkage Impacts Part Fit",
    "zh": "注塑收缩率如何影响结构件装配"
  },
  "text": {
    "en": "If shrinkage is not compensated in mold design, final parts may show gap, stress, or snap-fit instability. Early DFM review of wall thickness and gate position is critical.",
    "zh": "若模具设计未充分补偿收缩率，成品会出现缝隙、应力或卡扣不稳。前期 DFM 对壁厚与进胶位置的评审非常关键。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601730435470/3.webp",
    "coverAlt": {
      "en": "Injection part profile sample",
      "zh": "注塑结构件示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601730435470/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601730435470/2.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "DFM Engineering Note",
      "zh": "工程笔记"
    },
    "lead": {
      "en": "Injection-molding shrinkage directly affects part fit, and many risks can be reduced during the DFM stage.",
      "zh": "注塑收缩会直接影响装配匹配，很多风险应在 DFM 阶段提前消化。"
    },
    "sections": [
      {
        "title": {
          "en": "Why Shrinkage Becomes Fit Risk",
          "zh": "收缩率为什么会变成装配风险"
        },
        "paragraphs": [
          {
            "en": "Uneven wall thickness and non-optimized gate position can produce local shrinkage differences, leading to gap or stress during assembly.",
            "zh": "壁厚不均或进胶位置不合理，会让局部收缩差拉大，装配时就容易出现缝隙和应力集中。"
          },
          {
            "en": "In interlocking components, small dimensional drift can directly change insertion force and long-term stability perception.",
            "zh": "尤其是卡扣件，尺寸漂一点点，插拔手感和长期稳定性都会被放大。"
          }
        ],
        "imageAlt": {
          "en": "Injection profile component",
          "zh": "注塑结构件剖面"
        },
        "imageCaption": {
          "en": "Shrinkage risk should be reviewed at geometry stage, not after tooling freeze.",
          "zh": "收缩风险应在几何设计阶段评审，而非开模后补救。"
        }
      },
      {
        "title": {
          "en": "DFM Compensation Practices",
          "zh": "DFM阶段的补偿做法"
        },
        "paragraphs": [
          {
            "en": "Common compensation includes local wall tuning, rib transition optimization, and gate redesign with mold-flow evidence.",
            "zh": "常见补偿动作包括局部壁厚微调、筋位过渡优化，以及结合流动分析调整进胶方案。"
          },
          {
            "en": "A short pilot with dimensional map is recommended before final release to verify actual shrink response by cavity.",
            "zh": "放行前最好跑一轮短周期试产并输出尺寸地图，看看各模穴的收缩响应是否在可控范围内。"
          }
        ],
        "imageAlt": {
          "en": "Connector fit sample",
          "zh": "连接件匹配样件"
        },
        "imageCaption": {
          "en": "Compensation should be verified by dimensional map, not visual judgment only.",
          "zh": "补偿有效性应通过尺寸地图验证，而不是只看外观。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Shrinkage Control Checklist",
      "zh": "收缩控制清单"
    },
    "checklist": [
      {
        "en": "Review wall thickness and gate plan in DFM kickoff.",
        "zh": "DFM 启动时审查壁厚与进胶方案。"
      },
      {
        "en": "Use mold-flow evidence for compensation decisions.",
        "zh": "补偿决策应有流动分析依据。"
      },
      {
        "en": "Validate cavity-level dimensions in pilot lot.",
        "zh": "试产阶段验证模穴级尺寸稳定性。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
