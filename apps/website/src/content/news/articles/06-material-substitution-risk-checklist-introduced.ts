import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "March 8, 2026",
    "zh": "2026 年 3 月 8 日"
  },
  "category": {
    "en": "Engineering Update",
    "zh": "工程动态"
  },
  "title": {
    "en": "Material Substitution Risk Checklist Introduced",
    "zh": "材料替代风险清单正式启用"
  },
  "text": {
    "en": "When sourcing alternatives are proposed, teams now evaluate compatibility, odor, color drift, and mold-fit impact in one standard checklist before approval.",
    "zh": "当项目提出材料替代方案时，团队会在放行前统一评估兼容性、气味、色偏与模具匹配影响。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601730326005/4.webp",
    "coverAlt": {
      "en": "PVC tube profile reference",
      "zh": "PVC 管材截面示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601316583146/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601362237263/4.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Change-Control Note",
      "zh": "变更控制说明"
    },
    "lead": {
      "en": "The substitution checklist defines when material change should start and how release risk should be judged with evidence.",
      "zh": "材料替代清单明确了启动条件和放行判定，减少了临时替代带来的决策风险。"
    },
    "sections": [
      {
        "title": {
          "en": "When To Start A Substitution Review",
          "zh": "哪些情况下必须启动替代评审"
        },
        "paragraphs": [
          {
            "en": "Supplier shortage, cost shock, or compliance updates can trigger substitution, but each trigger must be documented with expected impact.",
            "zh": "原料短缺、成本波动或法规更新都可能触发替代，但触发原因和影响范围必须写清楚。"
          },
          {
            "en": "If interface fit or odor sensitivity is involved, substitution should be treated as a structural risk item, not only a purchasing item.",
            "zh": "只要牵涉接口配合或气味敏感，替代就不只是采购问题，而是实打实的结构风险。"
          }
        ],
        "imageAlt": {
          "en": "PVC tube application sample",
          "zh": "PVC 管材应用样件"
        },
        "imageCaption": {
          "en": "Substitution review starts with trigger clarity.",
          "zh": "替代评审的第一步是触发条件清晰化。"
        }
      },
      {
        "title": {
          "en": "Release Gate Should Include Three Views",
          "zh": "放行门槛需要三维度"
        },
        "paragraphs": [
          {
            "en": "A practical gate includes: compatibility test, appearance stability, and process repeatability in pilot lot.",
            "zh": "放行前至少要过三关：兼容性、外观稳定性、试产重复性，三项缺一都不建议急着放。"
          },
          {
            "en": "Release reports should compare old and new material side by side to support buyer approval efficiency.",
            "zh": "报告里把新旧材料并排展示，客户能更快看懂替代到底改变了什么。"
          }
        ],
        "imageAlt": {
          "en": "TPU and PVC material comparison",
          "zh": "TPU 与 PVC 材质对比"
        },
        "imageCaption": {
          "en": "Release by evidence, not by urgency.",
          "zh": "替代放行应以证据为依据，而非以紧急程度为依据。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Substitution Gate Checklist",
      "zh": "替代放行清单"
    },
    "checklist": [
      {
        "en": "Document trigger reason and impact scope.",
        "zh": "记录替代触发原因与影响范围。"
      },
      {
        "en": "Compare old and new materials in one report.",
        "zh": "新旧材料在同一报告中对比。"
      },
      {
        "en": "Complete pilot repeatability verification before release.",
        "zh": "放行前完成试产重复性验证。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
