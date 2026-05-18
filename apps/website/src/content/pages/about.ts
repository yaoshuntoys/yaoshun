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
const factoryImage1 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/image-copy-7.webp";
const factoryImage2 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/image-copy-8.webp";
const factoryImage3 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/production.webp";
const factoryImage4 = "/site/home/about-factory.webp";
const factoryImage5 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/about/warehouse.jpg";
const factoryImage6 =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/solutions/equipment/injection-molding-workshop-overview.webp";

export const aboutCertificateCopy = {
  description: {
    en: "Our toy and plastic products support EN71, ASTM F963, RoHS, and REACH requirements, with third-party reports available for customer review.",
    zh: "我们的玩具及塑胶产品可支持 EN71、ASTM F963、RoHS、REACH 等要求，并可配合客户提供第三方检测资料。",
  },
} as const;

export const certificateItems = [
  { code: "NTEK", title: "Test Report", image: certificateImage1 },
  { code: "NTEK", title: "Test Report", image: certificateImage2 },
  { code: "SPG", title: "Certificate", image: certificateImage3 },
  { code: "SEI", title: "Safety Standard", image: certificateImage4 },
  { code: "SPG", title: "Audit Record", image: certificateImage5 },
  { code: "NTEK", title: "Sample Photos", image: certificateImage6 },
] as const;

export const factoryItems = [
  { title: { en: "Factory Exterior", zh: "工厂外景" }, image: factoryImage4 },
  {
    title: { en: "Extrusion Production Line", zh: "挤出生产线" },
    image: factoryImage2,
  },
  {
    title: { en: "Automatic Cutting Line", zh: "自动切管生产线" },
    image: factoryImage1,
  },
  {
    title: { en: "Injection Molding Machine", zh: "注塑设备" },
    image: factoryImage6,
  },
  {
    title: { en: "Production Workshop", zh: "生产车间" },
    image: factoryImage3,
  },
  {
    title: { en: "Packing Warehouse", zh: "包装仓储区" },
    image: factoryImage5,
  },
] as const;
