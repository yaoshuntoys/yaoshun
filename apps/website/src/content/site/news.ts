import {seoKeywordPools} from '@/content/site/shared';

export const newsContent = {
  seo: {
    title: {
      en: 'News Center | Dongguan Yaoshun Technology Co., Ltd. | Toy OEM/ODM Updates',
      zh: '新闻中心 | 东莞市尧顺科技有限公司 | 玩具 OEM/ODM 动态'
    },
    description: {
      en: 'Browse factory updates and explainers around fort building toys, STEM building kits, toy OEM/ODM, PU/PVC tubing, injection molding, quality control and delivery execution.',
      zh: '查看围绕堡垒拼搭玩具、STEM搭建套装、玩具 OEM/ODM、PU/PVC 管材、注塑、质量管理与交付执行的工厂动态与科普文章。'
    },
    keywords: {
      en: [
        ...seoKeywordPools.products.en.slice(0, 8),
        ...seoKeywordPools.factoryCapabilities.en.slice(0, 6),
        'toy manufacturing news',
        'oem odm updates',
        'toy quality explainers',
        'pu pvc tubing knowledge',
        'factory delivery practices'
      ],
      zh: [
        ...seoKeywordPools.products.zh.slice(0, 8),
        ...seoKeywordPools.factoryCapabilities.zh.slice(0, 6),
        '玩具制造新闻',
        'OEM ODM 动态',
        '玩具质量科普',
        'PU PVC 管材知识',
        '工厂交付实践'
      ]
    }
  },
  hero: {
    eyebrow: {en: 'News Center', zh: '新闻中心'},
    title: {en: 'Factory Updates And Science Articles For Toy Projects', zh: '面向玩具项目的工厂动态与科普文章'},
    description: {
      en: 'This page publishes practical updates from toy project execution, plus explainers that help buyer teams make clearer decisions.',
      zh: '本页持续发布玩具项目执行动态，并配套基础科普，帮助采购团队做出更清晰的判断。'
    }
  },
  articleLibrarySection: {
    title: {en: 'Latest 15 Articles', zh: '最新 15 篇文章'},
    description: {
      en: 'A mixed library of factory news and industry explainers connected to our current OEM/ODM focus.',
      zh: '围绕当前 OEM/ODM 主营方向整理的混合内容库，包含工厂新闻与行业科普。'
    }
  },
  journey: {
    title: {en: 'Continue Browsing', zh: '继续浏览'},
    description: {
      en: 'Move from updates to product catalog, FAQ, and direct quotation workflow.',
      zh: '从动态页继续进入产品目录、FAQ 与报价流程。'
    }
  }
}
