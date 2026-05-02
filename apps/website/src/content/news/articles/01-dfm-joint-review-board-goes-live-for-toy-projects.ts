import type {NewsArticleSeed} from '@/content/news/types'

const article: NewsArticleSeed = {
  "date": {
    "en": "April 8, 2026",
    "zh": "2026 年 4 月 8 日"
  },
  "category": {
    "en": "Factory News",
    "zh": "工厂新闻"
  },
  "title": {
    "en": "DFM Joint Review Board Goes Live For Toy Projects",
    "zh": "玩具项目 DFM 联合评审机制上线"
  },
  "text": {
    "en": "Engineering, tooling, and trade teams now run one shared DFM checklist before sample kickoff. Earlier alignment has reduced repeated structure revisions in first-round samples.",
    "zh": "工程、模具与外贸团队在打样前统一使用 DFM 清单进行联合评审。前置对齐后，首轮样品的结构反复修改明显减少。"
  },
  "media": {
    "cover": "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601213973459/1.webp",
    "coverAlt": {
      "en": "Fort connector assembly reference",
      "zh": "帐篷连接件装配示意"
    },
    "sections": [
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601213973459/3.webp",
      "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/products-q92/1601213973459/4.webp"
    ]
  },
  "detailDraft": {
    "formatLabel": {
      "en": "Project Review",
      "zh": "项目复盘"
    },
    "lead": {
      "en": "The DFM joint board moved structural risks from repeated sample rework to pre-sample alignment and gave teams a clearer first-pass plan.",
      "zh": "DFM 联合评审把结构风险从“打样返工”前移到“打样前对齐”阶段，首轮样品决策更清晰。"
    },
    "sections": [
      {
        "title": {
          "en": "Where Rework Usually Starts",
          "zh": "返工通常从哪里开始"
        },
        "paragraphs": [
          {
            "en": "Most first-round rework happens when drawing version, connector tolerance, and material assumptions are not locked in one meeting note.",
            "zh": "项目一开工最怕的不是做不出来，而是图纸版本、公差和材质假设分散在不同记录里，大家理解不一致，样件一出来就要返工。"
          },
          {
            "en": "In fort-structure projects, a 0.1 to 0.2 mm mismatch at the interface can trigger repeated opening force and stability debates.",
            "zh": "拼搭帐篷件对接口很敏感，哪怕只差 0.1~0.2 mm，现场就会出现“这个太紧、那个太松”的反复讨论。"
          }
        ],
        "imageAlt": {
          "en": "DFM sample and connector view",
          "zh": "DFM 样件与连接件视图"
        },
        "imageCaption": {
          "en": "Use one interface drawing and one tolerance language before sample release.",
          "zh": "样前统一接口图和公差语言，可减少结构争议。"
        }
      },
      {
        "title": {
          "en": "What Changed In This Round",
          "zh": "本轮机制具体改了什么"
        },
        "paragraphs": [
          {
            "en": "Engineering, tooling, and trade now sign one checklist together, and each risk item has an owner plus expected closure date.",
            "zh": "这次把工程、模具和业务放到同一张风险清单上签字，每条问题都写清负责人和关闭日期，不再口头承诺。"
          },
          {
            "en": "The board also requires a quick connector-force mock test before color confirmation, so structure risk is handled first.",
            "zh": "另外把连接力小样前置到配色确认之前，先把结构可行性跑通，再进入外观讨论，节奏明显顺了很多。"
          }
        ],
        "imageAlt": {
          "en": "Toy project review flow",
          "zh": "玩具项目评审流程"
        },
        "imageCaption": {
          "en": "Move high-risk checks to pre-sample stage, not post-sample debate.",
          "zh": "高风险项前移到样前评审，而不是样后争论。"
        }
      }
    ],
    "checklistTitle": {
      "en": "Execution Checklist",
      "zh": "落地检查清单"
    },
    "checklist": [
      {
        "en": "Lock one drawing version and issue date before sample kickoff.",
        "zh": "打样前锁定唯一图纸版本与发布日期。"
      },
      {
        "en": "Mark connector force range with a measurable method.",
        "zh": "连接力必须定义可测量的方法和区间。"
      },
      {
        "en": "Assign each risk to one owner and one closure date.",
        "zh": "每个风险项必须对应一个责任人和关闭日期。"
      }
    ],
    "sourceNote": {
      "en": "Prepared from Yaoshun toy, tube, and equipment project practices plus public product modules. Snapshot date: April 12, 2026.",
      "zh": "内容基于尧顺玩具、管材、设备项目实践与公开商品模块整理。数据快照时间：2026 年 4 月 12 日。"
    }
  }
}

export default article
