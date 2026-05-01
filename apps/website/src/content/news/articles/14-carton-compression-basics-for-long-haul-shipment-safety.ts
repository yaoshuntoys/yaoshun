import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "December 29, 2025",
    "zh": "2025 年 12 月 29 日"
  },
  "category": {
    "en": "Science Explainer",
    "zh": "科普文章"
  },
  "title": {
    "en": "Carton Compression Basics For Long-Haul Shipment Safety",
    "zh": "长途运输中的纸箱抗压基础知识"
  },
  "text": {
    "en": "Even with good product quality, weak carton compression can cause transit damage. Carton grade, pallet stacking logic, and humidity conditions must be reviewed together.",
    "zh": "即使产品本体质量稳定，纸箱抗压不足仍会导致运输破损。箱材等级、码垛方式与湿度环境应一并评估。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1600900125789/2.webp",
    "coverAlt": {
      "en": "Carton and set shipping example",
      "zh": "套装纸箱运输示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601316583146/2.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601728749802/2.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Logistics Risk Brief",
      "zh": "物流风险简报"
    },
    "lead": {
      "en": "Carton compression performance in long-haul shipping depends on the full packaging system, not carton grade alone.",
      "zh": "长途运输中的纸箱抗压表现取决于整套包装系统，而不只是箱材等级。"
    },
    "sections": [
      {
        "title": {
          "en": "Compression Is A System Question",
          "zh": "抗压不是单一纸箱问题"
        },
        "paragraphs": [
          {
            "en": "Carton grade, internal support, product center of gravity, and pallet stacking pattern jointly decide compression performance.",
            "zh": "抗压表现是系统问题，不只看纸箱材质，还要看内衬支撑、产品重心和码垛方式是否匹配。"
          },
          {
            "en": "Improving one factor while ignoring others often gives unstable results in real shipping cycles.",
            "zh": "只盯一个变量去优化，运输周期一拉长就容易失效，现场表现往往不稳定。"
          }
        ],
        "imageAlt": {
          "en": "Shipping carton reference set",
          "zh": "运输纸箱套装示意"
        },
        "imageCaption": {
          "en": "Compression quality depends on full packaging system design.",
          "zh": "抗压能力取决于整套包装系统设计。"
        }
      },
      {
        "title": {
          "en": "Field Controls During Shipment",
          "zh": "运输现场控制动作"
        },
        "paragraphs": [
          {
            "en": "Humidity-sensitive routes need stronger moisture barrier and clearer pallet wrapping rules to avoid soft-carton collapse.",
            "zh": "高湿线路建议加防潮层并统一缠膜标准，否则中转几次后很容易出现软箱塌陷。"
          },
          {
            "en": "Stack-height marking and random drop checks at transfer points help detect handling risks before final delivery.",
            "zh": "中转节点加堆高标识并做抽检跌落，通常能更早发现搬运动作带来的风险。"
          }
        ],
        "imageAlt": {
          "en": "Transit packing control sample",
          "zh": "运输包装控制样件"
        },
        "imageCaption": {
          "en": "Shipment risk drops when packing rules and transfer controls are both executed.",
          "zh": "包装规则与中转控制同步执行，运输风险才会下降。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Long-Haul Packing Checklist",
      "zh": "长途包装检查清单"
    },
    "checklist": [
      {
        "en": "Review carton grade with product weight distribution.",
        "zh": "结合产品重量分布评估箱材等级。"
      },
      {
        "en": "Define humidity protection and pallet wrap rules.",
        "zh": "定义防潮方案与缠膜规则。"
      },
      {
        "en": "Apply stack-height marking at transfer points.",
        "zh": "在中转环节执行堆高标识控制。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
