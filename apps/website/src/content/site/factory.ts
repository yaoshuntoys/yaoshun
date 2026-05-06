import {seoKeywordPools, visualAssets} from '@/content/site/shared';

export const factoryContent = {
  seo: {
    title: {
      en: 'Factory Tour | Dongguan Yaoshun Technology Co., Ltd. | Toy Manufacturing',
      zh: '工厂展示 | 东莞市尧顺科技有限公司 | 玩具制造能力'
    },
    description: {
      en: 'Explore Dongguan Yaoshun factory capabilities for fort building toys, STEM building kits and toy OEM/ODM projects, including mold development, injection molding, extrusion, assembly, color box packaging and export coordination.',
      zh: '查看东莞市尧顺科技有限公司在堡垒拼搭玩具、STEM搭建套装与玩具 OEM/ODM 项目中的工厂能力，包括模具开发、注塑、挤出、组装、彩盒包装与出口协同。'
    },
    keywords: {
      en: [
        ...seoKeywordPools.company.en.slice(0, 8),
        ...seoKeywordPools.factoryCapabilities.en,
        ...seoKeywordPools.products.en.slice(0, 8),
        ...seoKeywordPools.customization.en.slice(0, 6),
        'toy production line',
        'plastic processing factory'
      ],
      zh: [
        ...seoKeywordPools.company.zh.slice(0, 8),
        ...seoKeywordPools.factoryCapabilities.zh,
        ...seoKeywordPools.products.zh.slice(0, 8),
        ...seoKeywordPools.customization.zh.slice(0, 6),
        '玩具生产车间',
        '制造车间'
      ]
    }
  },
  hero: {
    eyebrow: {en: 'Founded 2016 • Toy Manufacturing Workflow', zh: '成立于 2016 年 · 玩具制造流程能力'},
    title: {en: 'Factory Capacity Built Around Toy Project Delivery', zh: '围绕玩具项目交付构建的工厂能力'},
    description: {
      en: 'The factory workflow links development sampling, mold preparation, production launch, quality checks, assembly, packaging, and export handoff for toy programs.',
      zh: '工厂流程覆盖打样开发、模具准备、量产导入、品质检验、组装包装与出口交接，面向玩具项目稳定执行。'
    },
    primaryAction: {en: 'Schedule Virtual Tour', zh: '预约线上参观'},
    secondaryAction: {en: 'View Certifications', zh: '查看资质'},
    image: visualAssets.factoryFloor
  },
  overview: {
    title: {en: 'Full-Chain Manufacturing Capability', zh: '全链路制造能力'},
    description: {
      en: 'Yaoshun focuses on toy project execution, with engineering, production, assembly, packaging, and export services coordinated in one workflow.',
      zh: '尧顺以玩具项目执行为核心，将工程、生产、组装、包装与出口服务纳入同一协同流程。'
    }
  },
  metrics: [
    {
      value: {en: '2016', zh: '2016'},
      label: {en: 'Company established', zh: '公司成立'}
    },
    {
      value: {en: '5 Lines', zh: '5 大业务'},
      label: {en: 'Core business segments', zh: '核心业务板块'}
    },
    {
      value: {en: '7 Teams', zh: '7 大部门'},
      label: {en: 'Full-process departments', zh: '全流程协同部门'}
    },
    {
      value: {en: 'OEM / ODM', zh: 'OEM / ODM'},
      label: {en: 'Integrated customization service', zh: '一体化定制服务'}
    }
  ],
  accountability: {
    title: {en: 'Quality And Global Delivery', zh: '品质与全球交付'},
    items: [
      {
        title: {en: 'Quality & Environmental Standards', zh: '品质与环保标准'},
        text: {en: 'Production follows strict industry quality standards and environmental safety requirements.', zh: '生产过程严格执行行业质量标准与环保安全要求。'}
      },
      {
        title: {en: 'Foreign Trade Coordination', zh: '外贸协同能力'},
        text: {en: 'The trade team supports order handoff, customs, logistics, and after-sales follow-up for global customers.', zh: '外贸团队可为全球客户提供订单对接、报关物流与售后跟进服务。'}
      }
    ]
  },
  craftsmanship: {
    title: {en: 'Toy Mainline + Process Support', zh: '玩具主线 + 工艺配套'}
  },
  processSection: {
    title: {en: 'Core Process Systems', zh: '核心工艺与生产体系'},
    description: {
      en: 'Process modules are arranged around toy development, production, assembly, and delivery, with plastic and extrusion support available when needed.',
      zh: '工艺模块围绕玩具开发、生产、组装与交付组织，塑胶与挤出能力按需求提供配套。'
    },
    phaseLabel: {en: 'Phase {index}', zh: '阶段 {index}'}
  },
  processes: [
    {
      title: {en: 'Toy Project Engineering', zh: '玩具项目工程协同'},
      text: {
        en: 'Supports requirement clarification, structure review, and development planning before tooling and production.',
        zh: '在开模和量产前提供需求澄清、结构评估与开发计划支持。'
      }
    },
    {
      title: {en: 'Injection Production', zh: '注塑生产'},
      text: {
        en: 'Executes toy parts and housings through structured process controls for stable batch output.',
        zh: '围绕玩具结构件与外壳进行标准化注塑生产，保证批量输出稳定。'
      }
    },
    {
      title: {en: 'Assembly And Packaging', zh: '组装与包装'},
      text: {
        en: 'Supports toy assembly, functional checks, packaging, and shipment preparation according to project requirements.',
        zh: '按项目要求完成玩具组装、功能检测、包装与出货准备。'
      }
    },
    {
      title: {en: 'Plastic And Extrusion Support', zh: '塑胶与挤出配套'},
      text: {
        en: 'Provides supporting plastic and extrusion processes for projects requiring special materials or profile structures.',
        zh: '针对需特殊材质或型材结构的项目，提供塑胶与挤出工艺配套。'
      }
    }
  ],
  journey: {
    title: {en: 'Where To Go After The Tour', zh: '参观之后建议查看'},
    description: {
      en: 'From the factory page you can continue into compliance files, FAQ, or the quote intake page.',
      zh: '从工厂页可以继续进入资质、FAQ 和报价页面。'
    }
  }
};
