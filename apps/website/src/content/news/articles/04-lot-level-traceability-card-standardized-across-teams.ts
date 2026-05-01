import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "March 22, 2026",
    "zh": "2026 年 3 月 22 日"
  },
  "category": {
    "en": "Factory News",
    "zh": "工厂新闻"
  },
  "title": {
    "en": "Lot-Level Traceability Card Standardized Across Teams",
    "zh": "批次级追溯卡在各团队统一实施"
  },
  "text": {
    "en": "Incoming inspection, in-process control, and shipment release now follow one lot card format. Buyers can review issue closure and ownership in the same record chain.",
    "zh": "来料检验、过程控制与出货放行已统一批次追溯卡格式，客户可在同一链路内查看问题闭环与责任归属。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1600884595638/3.webp",
    "coverAlt": {
      "en": "Lot-level project sample",
      "zh": "批次项目样品示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601313719232/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601214840405/3.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Traceability SOP",
      "zh": "追溯SOP"
    },
    "lead": {
      "en": "A single lot-card format now connects incoming, in-process, and shipment release checkpoints in one traceability chain.",
      "zh": "统一批次卡已打通来料、过程和放行节点，让追溯链路更完整。"
    },
    "sections": [
      {
        "title": {
          "en": "What Must Be On Every Lot Card",
          "zh": "每张批次卡的必填项"
        },
        "paragraphs": [
          {
            "en": "At minimum: material lot, process station, test method, result code, and responsible role. Missing one field breaks cross-stage tracking.",
            "zh": "一张批次卡最少要写清原料批次、工位、测试方法、结果编码和责任角色，缺任何一项都会断掉追溯链路。"
          },
          {
            "en": "Use controlled vocabulary for defect names to avoid different teams describing the same issue in different words.",
            "zh": "缺陷命名最好统一成同一套词表，不然同一个问题在不同团队会被写成不同名字。"
          }
        ],
        "imageAlt": {
          "en": "Tube lot reference sample",
          "zh": "管材批次样件"
        },
        "imageCaption": {
          "en": "Uniform fields are the foundation of usable traceability.",
          "zh": "字段统一是追溯可用的前提。"
        }
      },
      {
        "title": {
          "en": "How To Close Issues Faster",
          "zh": "如何让问题关闭更快"
        },
        "paragraphs": [
          {
            "en": "When lot cards are linked, quality meetings can jump directly from issue code to owner and action deadline instead of repeating data collection.",
            "zh": "批次卡打通后，质量会议可以直接从问题编号跳到负责人和截止时间，少了很多重复取数。"
          },
          {
            "en": "Buyer-side visibility improves when closure status is shown in the same chain as initial inspection records.",
            "zh": "关闭状态如果回写在同一条记录里，客户也能一眼看懂问题走到哪一步。"
          }
        ],
        "imageAlt": {
          "en": "Toy set batch reference",
          "zh": "玩具套装批次示意"
        },
        "imageCaption": {
          "en": "Traceability value appears when issue and closure share one chain.",
          "zh": "同链路展示“问题-处理-关闭”才有追溯价值。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Lot Card SOP Checklist",
      "zh": "批次卡SOP清单"
    },
    "checklist": [
      {
        "en": "Use one defect vocabulary list across teams.",
        "zh": "跨团队统一缺陷命名词表。"
      },
      {
        "en": "Require owner and due date for each open issue.",
        "zh": "每个未关闭问题必须标注责任人与截止时间。"
      },
      {
        "en": "Keep closure evidence in the same lot record thread.",
        "zh": "关闭证据必须回写到同一批次记录链路。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
