import {seoKeywordPools} from '@/content/site/shared';

export const aboutContent = {
  seo: {
    title: {
      en: "About Yaoshun | Dongguan Toy OEM/ODM Factory",
      zh: "关于尧顺 | 东莞玩具 OEM/ODM 工厂",
    },
    description: {
      en: "Learn about Yaoshun's Dongguan source factory for fort building toys, STEM kits, toy OEM/ODM, molding, packaging, compliance and export delivery.",
      zh: "了解尧顺东莞源头工厂：主营堡垒拼搭玩具、STEM搭建套装，支持玩具 OEM/ODM、注塑、包装、合规资料与出口交付。",
    },
    keywords: {
      en: [
        ...seoKeywordPools.company.en,
        ...seoKeywordPools.factoryCapabilities.en,
        ...seoKeywordPools.compliance.en.slice(0, 5),
        "Dongguan Yaoshun company profile",
        "OEM ODM toy enterprise",
      ],
      zh: [
        ...seoKeywordPools.company.zh,
        ...seoKeywordPools.factoryCapabilities.zh,
        ...seoKeywordPools.compliance.zh.slice(0, 5),
        "尧顺企业简介",
        "东莞市尧顺科技有限公司资料",
        "OEM ODM玩具企业",
      ],
    },
  },
  hero: {
    eyebrow: { en: "Dongguan Source Factory Founded In 2016", zh: "成立于 2016 年的东莞源头工厂" },
    title: {
      en: "A Source Toy Factory Built For OEM/ODM And Custom Development",
      zh: "面向 OEM/ODM 与定制化开发的源头玩具工厂",
    },
    description: {
      en: "Yaoshun focuses on building toys, custom toys, educational toys, interlocking toy projects, custom toy development, precision injection molding, tubing, profiles, and coordinated factory delivery workflows.",
      zh: "尧顺聚焦搭建玩具、定制玩具、益智玩具、拼插玩具项目、玩具定制化开发、精密注塑件、管材型材及协同工厂交付流程。",
    },
  },
  positioning: {
    title: { en: "Positioning & Mission", zh: "定位与使命" },
    vision: {
      en: "Toy-focused OEM/ODM manufacturing partner with execution discipline and practical communication.",
      zh: "以玩具为核心的 OEM/ODM 制造伙伴，强调执行纪律与务实沟通。",
    },
    mission: {
      en: "Deliver stable quality, predictable schedule, and clear project collaboration for global buyer teams.",
      zh: "为全球客户提供稳定质量、可预期排期与清晰协作体验。",
    },
  },
  integratedSection: {
    title: {
      en: "Company + Factory + Compliance In One View",
      zh: "公司 + 工厂 + 资质的一体化视图",
    },
    description: {
      en: "Buyers often review company profile, factory execution model, and compliance readiness together. This section presents them in one place.",
      zh: "采购团队通常会同时查看公司资料、工厂执行模型与合规准备能力，本页将三部分信息集中展示。",
    },
    cards: [
      {
        title: { en: "Company Profile", zh: "公司概况" },
        text: {
          en: "Long-term focus on educational toys and interlocking toy projects, with supporting capabilities in tubing, profiles, and plastic process manufacturing.",
          zh: "长期聚焦益智玩具与拼插玩具项目，并具备管材、型材及塑胶工艺配套能力。",
        },
      },
      {
        title: { en: "Factory Execution", zh: "工厂执行" },
        text: {
          en: "Covers sampling, tooling coordination, production, assembly, packaging, and shipment handoff.",
          zh: "覆盖打样、模具协同、生产、组装、包装与出货交接。",
        },
      },
      {
        title: { en: "Compliance Readiness", zh: "合规准备" },
        text: {
          en: "Supports buyer-side document review, quality records, and project-level compliance preparation.",
          zh: "支持客户资料审核、质量记录管理与项目级合规准备。",
        },
      },
    ],
  },
  enterpriseSnapshotSection: {
    title: {
      en: "Enterprise Facts From 1688 Factory Card",
      zh: "来自 1688 工厂名片的企业信息",
    },
    description: {
      en: "Core enterprise fields are synchronized from the public 1688 factory card page for quick buyer-side review.",
      zh: "以下核心信息同步自 1688 工厂名片公开页面，便于采购侧快速核验。",
    },
    cards: [
      {
        title: { en: "Identity & Main Categories", zh: "主体信息与主营方向" },
        items: [
          {
            label: { en: "Company Name", zh: "公司名称" },
            value: {
              en: "Dongguan Yaoshun Technology Co., Ltd.",
              zh: "东莞市尧顺科技有限公司",
            },
          },
          {
            label: { en: "Main Categories", zh: "主营类目" },
            value: {
              en: "Educational toys, interlocking toys, precision molded components, tubing and plastic profiles",
              zh: "益智玩具、拼插玩具、精密注塑件、塑胶管材与型材",
            },
          },
          {
            label: { en: "Address", zh: "地址" },
            value: {
              en: "No. 3 Weixing Road, Chashan Town, Dongguan, Guangdong, China",
              zh: "中国广东省东莞市茶山镇伟兴路3号",
            },
          },
          {
            label: { en: "Platform Labels", zh: "平台标签" },
            value: {
              en: "RoHS / REACH support, EN71 / ASTM F963 support, sample-based processing, drawing-based processing",
              zh: "支持 RoHS / REACH、EN71 / ASTM F963，支持来样加工、来图加工",
            },
          },
        ],
      },
      {
        title: { en: "Factory Archive Summary", zh: "工厂档案摘要" },
        items: [
          {
            label: { en: "1688 Operation Age", zh: "1688 经营年限" },
            value: { en: "9 years", zh: "9年" },
          },
          {
            label: { en: "Archive Establishment Date", zh: "档案成立时间" },
            value: { en: "2016-08-26", zh: "2016.08.26" },
          },
          {
            label: { en: "Annual Transaction Range", zh: "年交易额区间" },
            value: { en: "CNY 1.01M to 5.00M", zh: "101~500万" },
          },
          {
            label: { en: "Employee Size", zh: "员工总数" },
            value: { en: "11 to 50", zh: "11~50人" },
          },
        ],
      },
      {
        title: { en: "Cooperation Terms", zh: "合作方式" },
        items: [
          {
            label: { en: "Custom MOQ", zh: "定制起订量" },
            value: { en: "5,000 meters", zh: "5000米" },
          },
          {
            label: { en: "Private Label MOQ", zh: "贴牌起订量" },
            value: { en: "1,000 sets", zh: "1000套" },
          },
          {
            label: { en: "Processing Modes", zh: "加工方式" },
            value: {
              en: "Toll processing, turnkey processing, sample-based processing, drawing-based processing",
              zh: "清加工、包工包料、来样加工、来图加工",
            },
          },
          {
            label: { en: "Invoice Capability", zh: "开票能力" },
            value: {
              en: "VAT invoice available (13%)",
              zh: "支持增值税发票（13%）",
            },
          },
        ],
      },
    ],
    sourceNote: {
      en: "Source: 1688 factory card page snapshot captured on April 12, 2026.",
      zh: "数据来源：1688 工厂名片页面，抓取时间为 2026 年 4 月 12 日。",
    },
  },
  platformMetricsSection: {
    title: { en: "1688 Platform Operation Metrics", zh: "1688 平台经营指标" },
    description: {
      en: "These are platform card metrics shown on the same factory page and may change over time.",
      zh: "以下为同页展示的平台卡片指标，会随平台数据更新而变化。",
    },
    metrics: [
      {
        label: { en: "Factory Badge Level", zh: "工厂牌级" },
        value: { en: "No badge yet", zh: "暂无牌级" },
      },
      {
        label: { en: "Custom Contract Transactions", zh: "定制合约交易" },
        value: { en: "2+ ten-thousand CNY", zh: "2+ 万元" },
      },
      {
        label: { en: "On-Time Fulfillment Rate", zh: "准时履约率" },
        value: { en: "100%", zh: "100%" },
      },
      {
        label: { en: "Service Response Rate", zh: "服务响应率" },
        value: { en: "18%", zh: "18%" },
      },
      {
        label: { en: "Interested Buyers", zh: "意向客户" },
        value: { en: "2", zh: "2" },
      },
      {
        label: { en: "Repeat Purchase Rate", zh: "回头率" },
        value: { en: "61%", zh: "61%" },
      },
    ],
    sourceNote: {
      en: "Snapshot date: April 12, 2026",
      zh: "数据快照时间：2026 年 4 月 12 日",
    },
  },
  valuesSection: {
    title: { en: "Core Advantages", zh: "核心优势" },
  },
  values: [
    {
      title: { en: "Project-Driven Execution", zh: "项目驱动执行" },
      text: {
        en: "Work is organized by milestones, owners, and handoff responsibilities rather than generic department silos.",
        zh: "按里程碑、责任人与交接节点组织执行，而非松散部门协作。",
      },
      icon: "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about-icons/project-driven.svg",
    },
    {
      title: { en: "One Workflow For OEM/ODM", zh: "一条链路承接OEM/ODM" },
      text: {
        en: "From requirement intake to shipment release, key project steps are managed in one consistent workflow.",
        zh: "从需求接收到出货放行，关键项目步骤在同一流程中闭环管理。",
      },
      icon: "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about-icons/oem-odm-workflow.svg",
    },
    {
      title: { en: "Global Buyer Communication", zh: "全球客户沟通能力" },
      text: {
        en: "Trade team supports quotation, delivery alignment, and post-delivery follow-up across markets.",
        zh: "外贸团队支持报价沟通、交付对齐与交付后跟进。",
      },
      icon: "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about-icons/global-communication.svg",
    },
    {
      title: { en: "Production Site", zh: "生产现场" },
      text: {
        en: "All processes are organized around stable delivery and long-term collaboration, minimizing information loss across different stages.",
        zh: "所有流程围绕稳定交付与长期协作来组织，减少跨环节信息损耗。",
      },
      icon: "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about-icons/production-site.svg",
    },
  ],
  rndSection: {
    title: { en: "Seven Collaborative Teams", zh: "七大协同团队" },
    description: {
      en: "Each team has clear ownership in the toy project chain, reducing communication gaps and schedule drift.",
      zh: "七大团队在玩具项目链路中职责清晰，可减少沟通断层与排期偏移。",
    },
  },
  rndSteps: [
    {
      title: { en: "Extrusion Equipment Team", zh: "挤出设备团队" },
      text: {
        en: "Supports equipment integration and process assistance for specific project requirements.",
        zh: "针对特定项目需求提供设备集成与工艺辅助。",
      },
    },
    {
      title: { en: "Extrusion Products Team", zh: "挤出产品团队" },
      text: {
        en: "Delivers profile and tubing solutions when toy projects need custom supporting parts.",
        zh: "在项目需要时提供型材与管材类配套件。",
      },
    },
    {
      title: { en: "Injection Molding Team", zh: "注塑团队" },
      text: {
        en: "Handles core plastic structures and functional parts for toy assemblies.",
        zh: "负责玩具项目核心塑胶结构件与功能件生产。",
      },
    },
    {
      title: { en: "Tooling & R&D Team", zh: "模具与研发团队" },
      text: {
        en: "Coordinates DFM review, tooling development, and trial iterations.",
        zh: "负责 DFM 评审、模具开发与试模迭代。",
      },
    },
    {
      title: { en: "Assembly Team", zh: "组装团队" },
      text: {
        en: "Ensures fit, function, and consistency during product assembly execution.",
        zh: "在组装阶段保障匹配性、功能性与一致性。",
      },
    },
    {
      title: { en: "Packaging Team", zh: "包装团队" },
      text: {
        en: "Supports retail packaging and export packaging planning for channel and logistics fit.",
        zh: "兼顾渠道展示与物流要求，完成零售与出口包装配置。",
      },
    },
    {
      title: { en: "Trade Team", zh: "外贸团队" },
      text: {
        en: "Supports buyer communication, shipment document flow, and after-sales coordination.",
        zh: "负责客户沟通、出货单证流程与售后协同。",
      },
    },
  ],
  technologyQualitySection: {
    title: { en: "Technology & Quality", zh: "技术与质量" },
    items: [
      {
        title: { en: "Engineering Review Mechanism", zh: "工程评审机制" },
        text: {
          en: "Engineering checkpoints are set before tooling release to reduce later-stage changes.",
          zh: "开模前设置工程评审节点，降低后段改动风险。",
        },
      },
      {
        title: { en: "Pilot Validation Discipline", zh: "试产验证纪律" },
        text: {
          en: "Pilot runs validate assembly, function, and packaging before mass production approval.",
          zh: "试产阶段验证装配、功能与包装，再进入量产审批。",
        },
      },
      {
        title: { en: "Traceable Quality Records", zh: "质量追溯记录" },
        text: {
          en: "Incoming, in-process, and shipment records support issue tracing and corrective action closure.",
          zh: "来料、过程与出货记录可用于问题追溯与纠正措施闭环。",
        },
      },
    ],
  },
  journey: {
    title: { en: "What To Open Next", zh: "下一步建议查看" },
    description: {
      en: "Continue into solution workflow, product catalog, and direct quotation page.",
      zh: "继续查看解决方案、产品目录与报价入口。",
    },
  },
};
