import {seoKeywordPools, visualAssets} from '@/content/site/shared';

export const complianceContent = {
  seo: {
    title: {
      en: 'Compliance & Supplier Documents | Yaoshun Toys',
      zh: '资质合规与供应商文件 | 尧顺玩具'
    },
    description: {
      en: 'Review Yaoshun supplier documents and toy project compliance support, including business credentials, ISO 9000 files, RoHS, REACH, EN71, ASTM F963 and CE materials.',
      zh: '查看尧顺供应商资料与玩具项目合规支持，包括工商资质、ISO 9000、RoHS、REACH、EN71、ASTM F963 与 CE 资料。'
    },
    keywords: {
      en: [
        ...seoKeywordPools.company.en.slice(0, 6),
        ...seoKeywordPools.compliance.en,
        ...seoKeywordPools.factoryCapabilities.en.slice(6, 12),
        'toy compliance supplier',
        'factory certification files',
        'buyer due diligence documents'
      ],
      zh: [
        ...seoKeywordPools.company.zh.slice(0, 6),
        ...seoKeywordPools.compliance.zh,
        ...seoKeywordPools.factoryCapabilities.zh.slice(6, 12),
        '尧顺资质',
        '尧顺供应商文件',
        '玩具资质',
        '供应商尽调资料',
        '工厂资质文件'
      ]
    }
  },
  hero: {
    eyebrow: {en: 'Precision Play Engineered', zh: '围绕出口项目的合规组织'},
    title: {en: 'Global Standard Integrity', zh: '把资质、信用与测试资料组织成可信交付'},
    description: {
      en: 'Yaoshun can prepare business credentials, tax and credit files, annual reports, IP records, ISO 9000 quality files, and CE-related materials for buyer review.',
      zh: '尧顺可为客户审核准备工商资质、税务与信用资料、企业年报、知识产权记录、ISO 9000 质量文件以及 CE 相关材料。'
    },
    badge: {en: 'Compliance Readiness', zh: '合规资料准备'},
    image: visualAssets.complianceLab
  },
  certificatesSection: {
    title: {en: 'Active Documents & Certificates', zh: '可提供资料与证书'},
    description: {
      en: 'Verified materials for buyer onboarding, due diligence, and market review.',
      zh: '适用于客户准入、尽调与市场审核的资料集合。'
    },
    note: {en: 'Document availability depends on project scope and NDA terms.', zh: '资料提供范围以项目需求和保密约定为准。'}
  },
  certificates: [
    {
      title: {en: 'Business Credentials', zh: '工商资质'},
      text: {en: 'Registered entity materials for customer due diligence.', zh: '支持客户尽调的主体注册资料。'}
    },
    {
      title: {en: 'Corporate Credit Files', zh: '企业信用资料'},
      text: {en: 'Useful for distributor onboarding and enterprise review.', zh: '适合经销商准入和企业采购审核。'}
    },
    {
      title: {en: 'Annual Reports', zh: '企业年报'},
      text: {en: 'Historical filing support for long-term partnerships.', zh: '为长期合作提供持续留档支持。'}
    },
    {
      title: {en: 'Tax Rating A', zh: '税务评级 A'},
      text: {en: 'Adds confidence for structured business cooperation.', zh: '增强规范商业合作的可信度。'}
    },
    {
      title: {en: 'ISO 9000 Files', zh: 'ISO 9000 文件'},
      text: {en: 'Quality management materials available for review.', zh: '可提供质量管理体系资料供审核。'}
    },
    {
      title: {en: 'CE and IP Records', zh: 'CE 与知识产权资料'},
      text: {en: 'Supports market entry and brand collaboration documentation.', zh: '支持市场准入与品牌合作资料准备。'}
    }
  ],
  tradeSection: {
    title: {en: 'Global Shipping & Trade Expertise', zh: '全球发货与贸易沟通支持'},
    description: {
      en: 'Trade and compliance communication is coordinated in the same workflow, so buyer review and shipment preparation can move in parallel.',
      zh: '外贸沟通与合规资料在同一流程中协同推进，便于客户审核与出货准备并行开展。'
    },
    cards: [
      {
        title: {en: 'Document Readiness', zh: '资料准备'},
        text: {en: 'Business credentials, credit files, annual reports, and tax rating support.', zh: '工商资质、信用资料、年报与税务评级支持。'}
      },
      {
        title: {en: 'Testing Pathways', zh: '测试路径'},
        text: {en: 'EN71, ASTM, ISO 9000, and CE-related file organization.', zh: '围绕 EN71、ASTM、ISO 9000 与 CE 的资料组织。'}
      },
      {
        title: {en: 'Buyer Review Support', zh: '客户审核支持'},
        text: {en: 'Useful for procurement onboarding and repeated compliance submissions.', zh: '适合采购准入与持续合规留档。'}
      }
    ]
  },
  journey: {
    title: {en: 'Next Compliance-Adjacent Pages', zh: '接下来建议查看'},
    description: {
      en: 'Continue into FAQ, direct inquiry, or privacy handling for form data.',
      zh: '继续查看 FAQ、提交询盘，或了解表单数据的隐私处理方式。'
    }
  }
};
