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

export type CertificateItem = {
  code: string;
  title: string;
  image: string;
  documentUrl?: string;
};

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
  documentLabel: {en: "View original PDF", zh: "查看 PDF 原件"},
  previewOnlyLabel: {en: "Preview only", zh: "仅提供预览"},
} as const;

export const certificateItems: CertificateItem[] = [
  {
    code: "Eurofins",
    title: "Test Report",
    image: eurofinsTestReport,
    documentUrl: "https://www.yaoshuntoys.com/media/site/about/certificates/eurofins-test-report-efw726054129.pdf?v=52cfa2de43465c91de830c80b75366fe",
  },
  {code: "NTEK", title: "Test Report", image: certificateImage1},
  {code: "NTEK", title: "Test Report", image: certificateImage2},
  {code: "CCC", title: "Test Report", image: cccTestReportCover},
  {
    code: "CE",
    title: "Certificate of Compliance",
    image: ceCertificateOfCompliance,
    documentUrl: "https://www.yaoshuntoys.com/media/site/about/certificates/ce-certificate-of-conformity.pdf?v=30a41069b886e123459b7c23e1548e11",
  },
  {code: "CCC", title: "Product Certificate", image: cccProductCertificate},
  {
    code: "CPSC",
    title: "Children's Product Certificate",
    image: childrensProductCertificate,
    documentUrl: "https://www.yaoshuntoys.com/media/site/about/certificates/us-childrens-product-certificate.pdf?v=b113197cb1c8793ff0885c01bd1509cf",
  },
  {code: "SPG", title: "Certificate", image: certificateImage3},
  {code: "SEI", title: "Safety Standard", image: certificateImage4},
  {
    code: "CPSC",
    title: "Children's Product Certificate Record",
    image: highlightedChildrensProductCertificate,
  },
  {
    code: "ISO 9001",
    title: "QMS Certificate (English)",
    image: qmsCertificateEnglish,
    documentUrl: "https://www.yaoshuntoys.com/media/site/about/certificates/cn-iso-9001-qms-certificate.pdf?v=dded357a39b23ff25674f8dfb4831555",
  },
  {
    code: "ISO 9001",
    title: "QMS Certificate (Chinese)",
    image: qmsCertificateChinese,
    documentUrl: "https://www.yaoshuntoys.com/media/site/about/certificates/cn-iso-9001-qms-certificate.pdf?v=dded357a39b23ff25674f8dfb4831555",
  },
  {code: "SPG", title: "Audit Record", image: certificateImage5},
  {code: "NTEK", title: "Sample Photos", image: certificateImage6},
  {code: "EUIPO", title: "Design Registration", image: euipoDesignRegistration},
  {
    code: "UKIPO",
    title: "Design Registration",
    image: ukDesignRegistration,
    documentUrl: "https://www.yaoshuntoys.com/media/site/about/certificates/uk-design-registration-6487034.pdf?v=148298fd53aefd6c7b496ecf4c530836",
  },
  {
    code: "CNIPA",
    title: "Utility Model Patent",
    image: utilityModelPatent,
    documentUrl: "https://www.yaoshuntoys.com/media/site/about/certificates/cn-utility-model-patent-toy-ball.pdf?v=16de4d73530ce311157f887014151ff1",
  },
  {code: "CNIPA", title: "Leyidi Trademark Registration", image: leyidiTrademarkRegistration},
  {code: "CNIPA", title: "Londy Trademark Registration", image: londyTrademarkRegistration},
] as const;

export function getCertificateDocumentsStructuredData() {
  return certificateItems
    .filter((item): item is CertificateItem & {documentUrl: string} => Boolean(item.documentUrl))
    .map((item) => ({
      "@context": "https://schema.org",
      "@type": "DigitalDocument",
      name: `${item.code} - ${item.title}`,
      url: toAbsoluteUrl(item.documentUrl),
      image: item.image,
      encodingFormat: "application/pdf",
      about: "Yaoshun compliance and qualification evidence",
    }));
}
import { toAbsoluteUrl } from "@/lib/site-config";
