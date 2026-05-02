import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "April 4, 2026",
    "zh": "2026 年 4 月 4 日"
  },
  "category": {
    "en": "Delivery Update",
    "zh": "交付动态"
  },
  "title": {
    "en": "Cross-Border Packaging Drop-Test Matrix Updated",
    "zh": "跨境包装跌落测试矩阵更新"
  },
  "text": {
    "en": "Drop-test scenarios now include stacked-carton corners and humid transit simulation. The new matrix is required for sea shipping and mixed-channel delivery projects.",
    "zh": "新版测试增加了叠箱角位与高湿运输模拟场景，已纳入海运与多渠道交付项目的必测项。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601316583146/2.webp",
    "coverAlt": {
      "en": "Toy set packaging view",
      "zh": "玩具套装包装场景"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1600900125789/2.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601728749802/2.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Test Playbook",
      "zh": "测试手册"
    },
    "lead": {
      "en": "The updated drop-test matrix focuses on often-missed cross-border transit scenarios and gives teams a clearer pass and fail baseline.",
      "zh": "更新后的跌落测试矩阵补齐了跨境运输中常被忽略的场景，并给出了更清晰的通过判定基线。"
    },
    "sections": [
      {
        "title": {
          "en": "Define Transit Profile First",
          "zh": "先定义运输剖面"
        },
        "paragraphs": [
          {
            "en": "Sea shipping, mixed warehouse transfer, and local parcel handling create different stress patterns. One drop test recipe cannot cover all routes.",
            "zh": "同样是跨境发货，海运整柜、海外仓中转和本地快递受力完全不一样，用一套跌落参数很难覆盖全链路。"
          },
          {
            "en": "Teams should confirm carton stacking height, humidity exposure, and handling frequency before selecting test sequence.",
            "zh": "所以测试前先把码垛高度、湿度暴露和装卸频次说清楚，再决定先测什么、后测什么。"
          }
        ],
        "imageAlt": {
          "en": "Packaging and shipment sample",
          "zh": "包装与运输样件"
        },
        "imageCaption": {
          "en": "Transit profile decides test profile, not the other way around.",
          "zh": "先有运输剖面，再有测试剖面。"
        }
      },
      {
        "title": {
          "en": "Update Pass Criteria",
          "zh": "更新通过判定标准"
        },
        "paragraphs": [
          {
            "en": "Besides product damage, carton corner collapse, label readability, and internal accessory displacement should be checked in the same report.",
            "zh": "现在报告不只看产品有没有摔坏，还会同时记录箱角塌陷、标签是否清楚、内配件有没有移位。"
          },
          {
            "en": "For buyer communication, photos from each drop direction and a clear severity code reduce post-shipment argument risk.",
            "zh": "对外沟通时，按跌落方向附现场照片并标注严重等级，后续复盘就不容易各说各话。"
          }
        ],
        "imageAlt": {
          "en": "Packaging structure comparison",
          "zh": "包装结构对比"
        },
        "imageCaption": {
          "en": "Judge packaging by structural protection and readability together.",
          "zh": "包装判定要同时覆盖防护能力与信息可读性。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Drop-Test Checklist",
      "zh": "跌落验证清单"
    },
    "checklist": [
      {
        "en": "Confirm target route and handling model before test setup.",
        "zh": "测试前先确认目标物流路径与搬运模型。"
      },
      {
        "en": "Record six-face and key-corner evidence with photos.",
        "zh": "六面与关键角位均需留存照片证据。"
      },
      {
        "en": "Use one severity codebook in both factory and buyer reports.",
        "zh": "工厂与客户报告统一严重度编码。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
