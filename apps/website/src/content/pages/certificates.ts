const certificateImage1 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/image.webp";
const certificateImage2 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/image-copy-2.webp";
const certificateImage3 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/image-copy-3.webp";
const certificateImage4 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/image-copy-4.webp";
const certificateImage5 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/cert5.webp";
const certificateImage6 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/image-copy-5.webp";
const ukDesignRegistration =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/uk-design-registration-6487034-wgQLVBu551dy5Xc0qxCFBbjRvHKytQ.png";
const eurofinsTestReport =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/eu-eurofins-test-report-efw726054129-page-01-CJ7REQHvwYfz9iZQ3r8Z6IXIo7QkS5.png";
const childrensProductCertificate =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/us-childrens-product-certificate-FlfJ5k7ycMP1Xc0zjCxAwg2r91uHcI.png";
const euipoDesignRegistration =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/eu-euipo-design-registration-nySjEhL0rSEpZQMTPmf3qZqoAFBpeQ.png";
const qmsCertificateChinese =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/cn-iso-9001-certificate-page-01-PWR5ZvRCyiyDJVOl1An6GG7HYx0cIA.png";
const qmsCertificateEnglish =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/cn-iso-9001-certificate-page-02-2HAWuXRsWwzdwGbdqG2gBFPzzyhN8w.png";
const leyidiTrademarkRegistration =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/cn-trademark-registration-leyidi-tZw2FiGIeBOCKGn4m6ZVxJPy9zOQFE.png";
const londyTrademarkRegistration =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/cn-trademark-registration-londy-sn31tMawFt0tXv9yuXVxhjZMCViNGM.png";
const cccProductCertificate =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/cn-ccc-product-certificate-o3LwpZiJqQxKn2CxNW7SklNtDQb4MI.png";
const cccTestReportCover =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/cn-ccc-test-report-cover-9pderfjF2qY5fIJ3dVVwZ35BcPfDU6.png";
const ceCertificateOfCompliance =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/eu-ce-certificate-of-compliance-RsNPj4XnPIkSvSUbGCeDTOisqvSt7m.png";
const utilityModelPatent =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/cn-utility-model-patent-toy-ball-YaiDpTPijyZGifu2KEzpbiJhd8Lkn2.png";
const highlightedChildrensProductCertificate =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/certificates/us-childrens-product-certificate-highlighted-tyv8XT7yoxYYRaZCrWj9QuTZXR1Pb4.png";

export const certificateSectionCopy = {
  eyebrow: {en: "Compliance", zh: "合规资料"},
  title: {en: "Certificates & Compliance", zh: "资质证书"},
  description: {
    en: "Our toy and plastic products support EN71, ASTM F963, RoHS, and REACH requirements, with third-party reports available for customer review.",
    zh: "玩具及塑胶产品可按 EN71、ASTM F963、RoHS、REACH 等要求执行，并提供第三方检测资料。",
  },
  dialogLabel: {en: "View certificate", zh: "查看证书"},
  expandLabel: {en: "Show more", zh: "显示更多"},
  collapseLabel: {en: "Show less", zh: "收起"},
} as const;

export const certificateItems = [
  {code: "ISO 9001", title: "QMS Certificate (English)", image: qmsCertificateEnglish},
  {code: "ISO 9001", title: "QMS Certificate (Chinese)", image: qmsCertificateChinese},
  {code: "CE", title: "Certificate of Compliance", image: ceCertificateOfCompliance},
  {code: "CCC", title: "Product Certificate", image: cccProductCertificate},
  {code: "CPSC", title: "Children's Product Certificate", image: childrensProductCertificate},
  {code: "Eurofins", title: "Test Report", image: eurofinsTestReport},
  {code: "NTEK", title: "Test Report", image: certificateImage1},
  {code: "NTEK", title: "Test Report", image: certificateImage2},
  {code: "SPG", title: "Certificate", image: certificateImage3},
  {code: "SEI", title: "Safety Standard", image: certificateImage4},
  {code: "EUIPO", title: "Design Registration", image: euipoDesignRegistration},
  {code: "UKIPO", title: "Design Registration", image: ukDesignRegistration},
  {code: "CNIPA", title: "Utility Model Patent", image: utilityModelPatent},
  {code: "CNIPA", title: "Leyidi Trademark Registration", image: leyidiTrademarkRegistration},
  {code: "CNIPA", title: "Londy Trademark Registration", image: londyTrademarkRegistration},
  {code: "CCC", title: "Test Report", image: cccTestReportCover},
  {
    code: "CPSC",
    title: "Children's Product Certificate Record",
    image: highlightedChildrensProductCertificate,
  },
  {code: "SPG", title: "Audit Record", image: certificateImage5},
  {code: "NTEK", title: "Sample Photos", image: certificateImage6},
] as const;
