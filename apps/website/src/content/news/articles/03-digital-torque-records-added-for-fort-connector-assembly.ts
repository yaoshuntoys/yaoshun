import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "March 29, 2026",
    "zh": "2026 年 3 月 29 日"
  },
  "category": {
    "en": "Quality Update",
    "zh": "质量动态"
  },
  "title": {
    "en": "Digital Torque Records Added For Fort Connector Assembly",
    "zh": "帐篷拼搭连接件装配新增数字化扭矩记录"
  },
  "text": {
    "en": "Critical fastening points for DIY fort connector sets now log torque ranges and operator IDs. This improves consistency control for high-volume PP structural components.",
    "zh": "DIY 帐篷连接件套装的关键锁付点位已记录扭矩区间与操作人员编号，进一步提升 PP 结构件放量项目的一致性控制。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601728749802/3.webp",
    "coverAlt": {
      "en": "Connector fastening point close-up",
      "zh": "连接件锁付点位示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601724919450/4.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products/1601730326005/3.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Process Log",
      "zh": "过程日志"
    },
    "lead": {
      "en": "Digital torque records now support more stable connector assembly quality in high-volume production.",
      "zh": "数字化扭矩记录正在提升大批量连接件装配的一致性和追溯效率。"
    },
    "sections": [
      {
        "title": {
          "en": "Set Torque Window By Joint Type",
          "zh": "按连接结构设定扭矩窗口"
        },
        "paragraphs": [
          {
            "en": "Different connector wall thickness and screw depth require different torque ranges. One global setting often causes either crack or looseness.",
            "zh": "不同连接件壁厚和锁付深度差别很大，扭矩如果只用一个值，要么开裂，要么越用越松。"
          },
          {
            "en": "A practical method is to build pilot windows by joint family and freeze the approved values into line parameters.",
            "zh": "更稳妥的做法是先按结构族群跑一轮试产窗口，确认通过后再把参数固化到产线。"
          }
        ],
        "imageAlt": {
          "en": "Servo cutting and assembly device",
          "zh": "伺服设备与装配工位"
        },
        "imageCaption": {
          "en": "Torque window should match connector family, not only SKU name.",
          "zh": "扭矩窗口应按连接结构族群设定，而非仅按 SKU 名称。"
        }
      },
      {
        "title": {
          "en": "Close The Traceability Loop",
          "zh": "把追溯链路真正闭环"
        },
        "paragraphs": [
          {
            "en": "Recording torque without operator, lot, and shift info is not enough for root-cause analysis when field complaints appear.",
            "zh": "只记录扭矩数字还不够，如果缺少人员、班次和批次信息，售后异常基本追不到根因。"
          },
          {
            "en": "Linking torque records with lot cards allows faster comparison between normal and abnormal runs.",
            "zh": "扭矩数据和批次卡打通后，异常批和正常批可以直接对比，定位问题会快很多。"
          }
        ],
        "imageAlt": {
          "en": "Connector assembly sample",
          "zh": "连接件装配样品"
        },
        "imageCaption": {
          "en": "Process records should support diagnosis, not only archiving.",
          "zh": "过程记录应服务诊断，而不是只做归档。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Torque Control Checklist",
      "zh": "扭矩控制清单"
    },
    "checklist": [
      {
        "en": "Define torque range by connector family.",
        "zh": "按连接结构族群定义扭矩区间。"
      },
      {
        "en": "Bind records to lot, shift, and operator IDs.",
        "zh": "记录必须绑定批次、班次、人员信息。"
      },
      {
        "en": "Review out-of-window alerts in daily standup.",
        "zh": "每日例会复盘超窗报警与处理结果。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
