import {seoKeywordPools} from '@/content/site/shared';

export const contactContent = {
  seo: {
    title: {
      en: 'Get A Toy Manufacturing Quote | Dongguan Yaoshun Technology Co., Ltd.',
      zh: '获取玩具制造报价 | 东莞市尧顺科技有限公司'
    },
    description: {
      en: 'Contact Dongguan Yaoshun Technology Co., Ltd. for fort building toy, STEM kit and custom toy OEM/ODM quotation, sampling, mold evaluation, color box packaging and export delivery support.',
      zh: '联系东莞市尧顺科技有限公司，获取堡垒拼搭玩具、STEM搭建套装和定制玩具 OEM/ODM 报价，支持打样、开模评估、彩盒包装与出口交付。'
    },
    keywords: {
      en: [
        ...seoKeywordPools.company.en.slice(0, 6),
        ...seoKeywordPools.products.en.slice(0, 8),
        ...seoKeywordPools.customization.en.slice(0, 10),
        'building toy OEM inquiry',
        'custom building toy quotation',
        'toy sampling and mass production quote'
      ],
      zh: [
        ...seoKeywordPools.company.zh.slice(0, 6),
        ...seoKeywordPools.products.zh.slice(0, 8),
        ...seoKeywordPools.customization.zh.slice(0, 10),
        '拼搭玩具定制报价',
        'B2B玩具供应商询价',
        '打样量产报价'
      ]
    }
  },
  hero: {
    eyebrow: {en: 'Contact & Quote', zh: '联系与报价'},
    title: {en: 'Share Your Toy Project, We Reply With A Practical Plan', zh: '提交玩具项目需求，我们给出可执行的报价方案'},
    description: {
      en: 'Submit product type, quantity range, target market, and packaging direction. We will reply with a practical quotation and execution suggestion.',
      zh: '提交产品类型、数量区间、目标市场和包装方向后，我们会回复可执行的报价与推进建议。'
    }
  },
  responseGoal: {
    title: {en: 'Expected Response Rhythm', zh: '响应节奏说明'},
    text: {
      en: 'Most inquiries receive initial feedback within one business day, including feasibility notes and missing information reminders.',
      zh: '大多数询盘会在 1 个工作日内收到初步反馈，并附可行性说明与补充信息提示。'
    }
  },
  serviceCommitmentSection: {
    title: {en: 'What We Confirm First', zh: '我们优先确认的事项'},
    items: [
      {
        title: {en: 'Product Positioning', zh: '产品定位'},
        text: {
          en: 'Category, age grade, function focus, and target sales channel.',
          zh: '确认品类、适龄段、功能重点与目标销售渠道。'
        }
      },
      {
        title: {en: 'Commercial Baseline', zh: '商务基线'},
        text: {
          en: 'Target quantity, planned launch date, and market-specific compliance expectations.',
          zh: '确认预估数量、上市时间与目标市场合规预期。'
        }
      },
      {
        title: {en: 'Engineering Scope', zh: '工程范围'},
        text: {
          en: 'Mold route, material direction, assembly complexity, and packaging level.',
          zh: '评估开模路径、材质方向、装配复杂度与包装等级。'
        }
      }
    ]
  },
  quoteFlowSection: {
    title: {en: 'Quote Process', zh: '报价流程'},
    description: {
      en: 'A clear process helps both teams reduce repeated communication and keep schedule visible.',
      zh: '流程清晰可以减少反复沟通，让项目排期更可控。'
    },
    steps: [
      {
        title: {en: 'Step 1 · Requirement Intake', zh: '步骤 1 · 需求接收'},
        text: {
          en: 'Collect product references, quantity range, market destination, and packaging direction.',
          zh: '收集产品参考、数量区间、目标市场和包装方向。'
        }
      },
      {
        title: {en: 'Step 2 · Engineering Evaluation', zh: '步骤 2 · 工程评估'},
        text: {
          en: 'Assess tooling complexity, material selection, process route, and trial plan.',
          zh: '评估模具复杂度、选材方案、工艺路径与试产计划。'
        }
      },
      {
        title: {en: 'Step 3 · Commercial Quotation', zh: '步骤 3 · 商务报价'},
        text: {
          en: 'Provide pricing structure with assumptions on quantity, packaging, and lead time.',
          zh: '基于数量、包装与交期假设输出结构化报价。'
        }
      },
      {
        title: {en: 'Step 4 · Kickoff Alignment', zh: '步骤 4 · 项目启动确认'},
        text: {
          en: 'Lock milestone plan for sampling, validation, mass production, and shipment.',
          zh: '对齐打样、验证、量产与出货里程碑，启动项目。'
        }
      }
    ]
  },
  quoteChecklistSection: {
    title: {en: 'Recommended Information Before Submitting', zh: '提交前建议准备的信息'},
    description: {
      en: 'You can still submit without full details. The checklist simply helps speed up first-round evaluation.',
      zh: '即使信息不完整也可提交，以下清单仅用于提升首轮评估效率。'
    },
    items: [
      {
        title: {en: 'Reference Material', zh: '参考资料'},
        text: {
          en: 'Sketch, photos, drawing files, or sample videos.',
          zh: '草图、图片、图纸文件或样品视频。'
        }
      },
      {
        title: {en: 'Quantity Plan', zh: '数量计划'},
        text: {
          en: 'Expected trial quantity and planned first-order volume.',
          zh: '预估打样数量及首批订单规模。'
        }
      },
      {
        title: {en: 'Target Market', zh: '目标市场'},
        text: {
          en: 'Destination country and expected test / compliance baseline.',
          zh: '目标销售国家及预计测试/合规基线。'
        }
      },
      {
        title: {en: 'Packaging Direction', zh: '包装方向'},
        text: {
          en: 'Retail box type, language version, and transport constraints.',
          zh: '彩盒类型、语言版本与运输限制要求。'
        }
      }
    ]
  },
  businessIdentityLabel: {en: 'Business Identity', zh: '企业主体信息'},
  businessIdentityFields: {
    companyName: {en: 'Company Name', zh: '公司名称'},
    phone: {en: 'Phone', zh: '联系电话'},
    email: {en: 'Email', zh: '邮箱'},
    address: {en: 'Address', zh: '联系地址'}
  },
  directChannelsLabel: {en: 'Direct Channels', zh: '直接联系渠道'},
  channels: [
    {
      label: {en: 'WhatsApp Trade Desk', zh: 'WhatsApp 贸易沟通'},
      value: '+86 18780083256',
      href: 'https://wa.me/8618780083256'
    },
    {
      label: {en: 'Direct Email', zh: '邮箱'},
      value: 'yaoshuntoys@gmail.com',
      href: 'mailto:yaoshuntoys@gmail.com'
    }
  ],
  journey: {
    title: {en: 'Continue After Quote', zh: '报价后继续浏览'},
    description: {
      en: 'You can continue to product pages, FAQ, or compliance details while waiting for feedback.',
      zh: '提交后可继续查看产品目录、FAQ 与合规信息。'
    }
  }
};
