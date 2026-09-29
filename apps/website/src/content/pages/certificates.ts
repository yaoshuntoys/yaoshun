const certificateImage1 =
  "https://www.yaoshuntoys.com/media/site/about/image.webp";
const certificateImage2 =
  "https://www.yaoshuntoys.com/media/site/about/image-copy-2.webp";
const certificateImage3 =
  "https://www.yaoshuntoys.com/media/site/about/image-copy-3.webp";
const certificateImage4 =
  "https://www.yaoshuntoys.com/media/site/about/image-copy-4.webp";
const certificateImage5 =
  "https://www.yaoshuntoys.com/media/site/about/cert5.webp";
const certificateImage6 =
  "https://www.yaoshuntoys.com/media/site/about/image-copy-5.webp";
const ukDesignRegistration =
  "https://www.yaoshuntoys.com/media/site/about/certificates/uk-design-registration-6487034.webp";
const eurofinsTestReport =
  "https://www.yaoshuntoys.com/media/site/about/certificates/eu-eurofins-test-report-efw726054129-page-01.webp";
const childrensProductCertificate =
  "https://www.yaoshuntoys.com/media/site/about/certificates/us-childrens-product-certificate.webp";
const euipoDesignRegistration =
  "https://www.yaoshuntoys.com/media/site/about/certificates/eu-euipo-design-registration.webp";
const qmsCertificateChinese =
  "https://www.yaoshuntoys.com/media/site/about/certificates/cn-iso-9001-certificate-page-01.webp";
const qmsCertificateEnglish =
  "https://www.yaoshuntoys.com/media/site/about/certificates/cn-iso-9001-certificate-page-02.webp";
const leyidiTrademarkRegistration =
  "https://www.yaoshuntoys.com/media/site/about/certificates/cn-trademark-registration-leyidi.webp";
const londyTrademarkRegistration =
  "https://www.yaoshuntoys.com/media/site/about/certificates/cn-trademark-registration-londy.webp";
const cccProductCertificate =
  "https://www.yaoshuntoys.com/media/site/about/certificates/cn-ccc-product-certificate.webp";
const cccTestReportCover =
  "https://www.yaoshuntoys.com/media/site/about/certificates/cn-ccc-test-report-cover.webp";
const ceCertificateOfCompliance =
  "https://www.yaoshuntoys.com/media/site/about/certificates/eu-ce-certificate-of-compliance.webp";
const utilityModelPatent =
  "https://www.yaoshuntoys.com/media/site/about/certificates/cn-utility-model-patent-toy-ball.webp";
const highlightedChildrensProductCertificate =
  "https://www.yaoshuntoys.com/media/site/about/certificates/us-childrens-product-certificate-highlighted.webp";

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
