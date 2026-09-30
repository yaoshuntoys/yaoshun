const customImage = "/site/solutions/custom.webp";
const coreFocusBase =
  "https://7j7davvujdsmddan.public.blob.vercel-storage.com/yaoshun-assets/site/solutions/core-focus-v2";
const baseUrl =
  "https://www.yaoshuntoys.com/media/site/solutions";
const equipmentBase =
  "https://www.yaoshuntoys.com/media/site/solutions/equipment";
const workshopBase =
  "https://www.yaoshuntoys.com/media/site/solutions/workshop";
export const solutionsPageImages = {
  custom: customImage,
  education: `${coreFocusBase}/stem-toy-rd-factory-review.webp`,
  retail: `${coreFocusBase}/interlocking-diy-toy-pilot-assembly.webp`,
  events: `${coreFocusBase}/plastic-rod-extrusion-production.webp`,
  oem: `${coreFocusBase}/toy-parts-quality-inspection.webp`,
} as const;

export const solutionsWorkshopImages = {
  overview: `${workshopBase}/plastic-electronics-workshop-main.webp`,
  line1: `${workshopBase}/plastic-electronics-workshop-line-1.webp`,
  line2: `${workshopBase}/plastic-electronics-workshop-line-2.webp`,
  line3: `${workshopBase}/plastic-electronics-workshop-line-3.webp`,
  line4: `${workshopBase}/plastic-electronics-workshop-line-4.webp`,
  line5: `${workshopBase}/plastic-electronics-workshop-line-5.webp`,
} as const;

export const solutionsEquipmentImages = {
  pcbaServiceBoard: "/site/solutions/pcba-service-board.png",
  pcbaServiceAngle: "/site/solutions/pcba-service-angle.png",
  pcbaServiceInterface: "/site/solutions/pcba-service-interface.png",
  pcbaServiceSmtDetail: "/site/solutions/pcba-service-smt-detail.png",
  pcbaServiceCircuitDetail: "/site/solutions/pcba-service-circuit-detail.png",
  pcbaDesignRd: "/site/solutions/pcba-design-rd.png",
  pcbaBoardMaking: "/site/solutions/pcba-board-making.png",
  pcbaSmtPlacement: "/site/solutions/pcba-smt-placement.png",
  pcbaTailorMadeSolution: "/site/solutions/pcba-tailor-made-solution.png",
  extrusionEquipmentDisplay: "/site/solutions/extrusion-equipment-display.png",
  moldWorkshop: `${equipmentBase}/mold-machining-workshop-overview.webp`,
  c6140aLathe: `${equipmentBase}/mold-machining-c6140a-engine-lathe-main.webp`,
  c6140aLatheDetail1: `${equipmentBase}/mold-machining-c6140a-engine-lathe-main.webp`,
  c6140aLatheDetail2: `${equipmentBase}/mold-machining-c6140a-engine-lathe-detail-2.webp`,
  c6140aLatheDetail3: `${equipmentBase}/mold-machining-c6140a-engine-lathe-detail-3.webp`,
  cn6150bLathe: `${equipmentBase}/mold-machining-cn6150b-engine-lathe-main.webp`,
  cn6150bLatheDetail1: `${equipmentBase}/mold-machining-cn6150b-engine-lathe-main.webp`,
  cn6150bLatheDetail2: `${equipmentBase}/mold-machining-cn6150b-engine-lathe-main.webp`,
  cn6150bLatheDetail3: `${equipmentBase}/mold-machining-cn6150b-engine-lathe-main.webp`,
  turretMill: `${equipmentBase}/mold-machining-turret-milling-machine-detail-1.webp`,
  turretMillDetail1: `${equipmentBase}/mold-machining-turret-milling-machine-detail-1.webp`,
  turretMillDetail2: `${equipmentBase}/mold-machining-turret-milling-machine-detail-1.webp`,
  radialDrill: `${equipmentBase}/mold-machining-z3035x10-radial-drilling-machine-main.webp`,
  radialDrillDetail1: `${equipmentBase}/mold-machining-z3035x10-radial-drilling-machine-main.webp`,
  extrusionWorkshopOverview: `${baseUrl}/extrusion-workshop-overview.webp`,
  extrusionWorkshopPackagingTurnover: `${baseUrl}/extrusion-workshop-packaging-turnover.webp`,
  extrusionWorkshopRodOutputInspection: `${baseUrl}/extrusion-workshop-rod-output-inspection.webp`,
  mediumWireCutEdm: `${equipmentBase}/mold-machining-medium-speed-wire-cut-edm-main.webp`,
  mediumWireCutEdmDetail1: `${equipmentBase}/mold-machining-medium-speed-wire-cut-edm-main.webp`,
  fastWireCutEdm: `${equipmentBase}/mold-machining-fast-wire-cut-edm-main.webp`,
  edmHoleDrill: `${equipmentBase}/mold-machining-edm-hole-drilling-machine-detail-1.webp`,
  edmHoleDrillDetail1: `${equipmentBase}/mold-machining-edm-hole-drilling-machine-detail-1.webp`,
  injectionWorkshop: `${equipmentBase}/injection-molding-workshop-overview.webp`,
  hwaChin125se: `${equipmentBase}/injection-molding-hwa-chin-125se-machine-main.webp`,
  hwaChin125seDetail1: `${equipmentBase}/injection-molding-hwa-chin-125se-machine-main.webp`,
  hwaChin160se: `${equipmentBase}/injection-molding-hwa-chin-160se-machine-main.webp`,
  hwaChin210se: `${equipmentBase}/injection-molding-hwa-chin-210se-machine-main.webp`,
  haitian220t: `${equipmentBase}/injection-molding-haitian-220t-machine-main.webp`,
  victorTaichungHorizontal: `${equipmentBase}/injection-molding-victor-taichung-horizontal-machine-main.webp`,
} as const;
