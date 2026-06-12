import newsArticle01 from "../../../data/news/londy-colorful-dreamer-168-piece-glow-fort-kit-added/news.json";
import newsArticle02 from "../../../data/news/londy-luminous-explorer-168-piece-glow-fort-kit-released/news.json";
import newsArticle03 from "../../../data/news/custom-diy-forts-color-box-building-kit-ready-for-oem-odm/news.json";
import newsArticle04 from "../../../data/news/custom-130-piece-glow-fort-kit-open-for-private-label-projects/news.json";
import newsArticle05 from "../../../data/news/overseas-custom-toy-shipment-ready-for-buyer-delivery/news.json";
import newsArticle06 from "../../../data/news/creative-fort-building-toys-help-kids-reduce-screen-time/news.json";
import newsArticle07 from "../../../data/news/in-house-tooling-team-helps-oem-odm-buyers-shorten-sample-cycles/news.json";
import newsArticle08 from "../../../data/news/from-raw-material-review-to-final-qc-how-yaoshun-controls-production/news.json";
import newsArticle09 from "../../../data/news/ntek-test-report-updated-for-building-toy-series/news.json";
import newsArticle10 from "../../../data/news/cleaner-production-workflow-supports-medical-and-food-contact-tubing-projects/news.json";
import newsArticle11 from "../../../data/news/green-material-planning-and-recycling-practice-strengthen-long-term-compliance/news.json";
import newsArticle12 from "../../../data/news/second-ntek-report-added-for-expanded-piece-configurations/news.json";
import newsArticle13 from "../../../data/news/spg-certificate-file-prepared-for-export-documentation/news.json";
import newsArticle14 from "../../../data/news/sei-safety-standard-record-updated-for-international-review/news.json";
import newsArticle15 from "../../../data/news/factory-audit-records-refreshed-for-buyer-due-diligence/news.json";
import newsArticle16 from "../../../data/news/ntek-sample-photo-set-released-for-faster-approval/news.json";
import newsArticle17 from "../../../data/news/yaoshun-spring-festival-new-year-kickoff/news.json";
import newsArticle18 from "../../../data/news/screen-free-fort-building-play-routine-for-modern-families/news.json";
import newsArticle19 from "../../../data/news/spatial-thinking-and-stem-learning-through-fort-building-toys/news.json";
import newsArticle20 from "../../../data/news/what-block-play-research-means-for-fort-building-toy-buyers/news.json";
import newsArticle21 from "../../../data/news/modular-building-toys-are-becoming-a-2026-stem-play-opportunity/news.json";
import newsArticle22 from "../../../data/news/eco-lasting-play-why-durable-fort-building-toys-fit-sustainable-buying/news.json";
import newsArticle23 from "../../../data/news/toy-safety-and-astm-f963-what-fort-building-kit-buyers-should-check/news.json";
import newsArticle24 from "../../../data/news/premium-building-sets-and-retail-value-why-larger-fort-kits-matter/news.json";
import newsArticle25 from "../../../data/news/glow-fort-building-kits-turn-night-play-into-a-retail-story/news.json";
import newsArticle26 from "../../../data/news/guided-parent-child-play-makes-fort-building-toys-more-valuable/news.json";
import newsArticle27 from "../../../data/news/private-label-fort-building-kits-sourcing-guide-for-oem-odm-buyers/news.json";
import newsArticle28 from "../../../data/news/room-sized-construction-play-how-fort-kits-extend-block-play/news.json";
import newsArticle29 from "../../../data/news/spatial-language-instructions-help-families-build-better-forts/news.json";
import newsArticle30 from "../../../data/news/parent-child-fort-building-night-routine-for-repeat-play/news.json";
import newsArticle31 from "../../../data/news/open-ended-construction-toys-and-2026-retail-assortments/news.json";
import newsArticle32 from "../../../data/news/piece-count-ladder-for-fort-building-kit-series-planning/news.json";
import newsArticle33 from "../../../data/news/pre-quotation-safety-brief-for-private-label-fort-building-kits/news.json";
import newsArticle34 from "../../../data/news/eu-toy-safety-preparation-for-fort-building-kit-exporters/news.json";
import newsArticle35 from "../../../data/news/durable-fort-building-kits-support-sustainable-family-play/news.json";
import newsArticle36 from "../../../data/news/school-and-activity-channel-fort-building-kit-buying-notes/news.json";

import type { NewsArticleSeed } from "@/content/types";

function withSource(data: NewsArticleSeed, sourcePath: string) {
  return {data, sourcePath};
}

const importedNewsArticles = [
  withSource(newsArticle01 as NewsArticleSeed, "apps/website/data/news/londy-colorful-dreamer-168-piece-glow-fort-kit-added/news.json"),
  withSource(newsArticle02 as NewsArticleSeed, "apps/website/data/news/londy-luminous-explorer-168-piece-glow-fort-kit-released/news.json"),
  withSource(newsArticle03 as NewsArticleSeed, "apps/website/data/news/custom-diy-forts-color-box-building-kit-ready-for-oem-odm/news.json"),
  withSource(newsArticle04 as NewsArticleSeed, "apps/website/data/news/custom-130-piece-glow-fort-kit-open-for-private-label-projects/news.json"),
  withSource(newsArticle05 as NewsArticleSeed, "apps/website/data/news/overseas-custom-toy-shipment-ready-for-buyer-delivery/news.json"),
  withSource(newsArticle06 as NewsArticleSeed, "apps/website/data/news/creative-fort-building-toys-help-kids-reduce-screen-time/news.json"),
  withSource(newsArticle07 as NewsArticleSeed, "apps/website/data/news/in-house-tooling-team-helps-oem-odm-buyers-shorten-sample-cycles/news.json"),
  withSource(newsArticle08 as NewsArticleSeed, "apps/website/data/news/from-raw-material-review-to-final-qc-how-yaoshun-controls-production/news.json"),
  withSource(newsArticle09 as NewsArticleSeed, "apps/website/data/news/ntek-test-report-updated-for-building-toy-series/news.json"),
  withSource(newsArticle10 as NewsArticleSeed, "apps/website/data/news/cleaner-production-workflow-supports-medical-and-food-contact-tubing-projects/news.json"),
  withSource(newsArticle11 as NewsArticleSeed, "apps/website/data/news/green-material-planning-and-recycling-practice-strengthen-long-term-compliance/news.json"),
  withSource(newsArticle12 as NewsArticleSeed, "apps/website/data/news/second-ntek-report-added-for-expanded-piece-configurations/news.json"),
  withSource(newsArticle13 as NewsArticleSeed, "apps/website/data/news/spg-certificate-file-prepared-for-export-documentation/news.json"),
  withSource(newsArticle14 as NewsArticleSeed, "apps/website/data/news/sei-safety-standard-record-updated-for-international-review/news.json"),
  withSource(newsArticle15 as NewsArticleSeed, "apps/website/data/news/factory-audit-records-refreshed-for-buyer-due-diligence/news.json"),
  withSource(newsArticle16 as NewsArticleSeed, "apps/website/data/news/ntek-sample-photo-set-released-for-faster-approval/news.json"),
  withSource(newsArticle17 as NewsArticleSeed, "apps/website/data/news/yaoshun-spring-festival-new-year-kickoff/news.json"),
  withSource(newsArticle18 as NewsArticleSeed, "apps/website/data/news/screen-free-fort-building-play-routine-for-modern-families/news.json"),
  withSource(newsArticle19 as NewsArticleSeed, "apps/website/data/news/spatial-thinking-and-stem-learning-through-fort-building-toys/news.json"),
  withSource(newsArticle20 as NewsArticleSeed, "apps/website/data/news/what-block-play-research-means-for-fort-building-toy-buyers/news.json"),
  withSource(newsArticle21 as NewsArticleSeed, "apps/website/data/news/modular-building-toys-are-becoming-a-2026-stem-play-opportunity/news.json"),
  withSource(newsArticle22 as NewsArticleSeed, "apps/website/data/news/eco-lasting-play-why-durable-fort-building-toys-fit-sustainable-buying/news.json"),
  withSource(newsArticle23 as NewsArticleSeed, "apps/website/data/news/toy-safety-and-astm-f963-what-fort-building-kit-buyers-should-check/news.json"),
  withSource(newsArticle24 as NewsArticleSeed, "apps/website/data/news/premium-building-sets-and-retail-value-why-larger-fort-kits-matter/news.json"),
  withSource(newsArticle25 as NewsArticleSeed, "apps/website/data/news/glow-fort-building-kits-turn-night-play-into-a-retail-story/news.json"),
  withSource(newsArticle26 as NewsArticleSeed, "apps/website/data/news/guided-parent-child-play-makes-fort-building-toys-more-valuable/news.json"),
  withSource(newsArticle27 as NewsArticleSeed, "apps/website/data/news/private-label-fort-building-kits-sourcing-guide-for-oem-odm-buyers/news.json"),
  withSource(newsArticle28 as NewsArticleSeed, "apps/website/data/news/room-sized-construction-play-how-fort-kits-extend-block-play/news.json"),
  withSource(newsArticle29 as NewsArticleSeed, "apps/website/data/news/spatial-language-instructions-help-families-build-better-forts/news.json"),
  withSource(newsArticle30 as NewsArticleSeed, "apps/website/data/news/parent-child-fort-building-night-routine-for-repeat-play/news.json"),
  withSource(newsArticle31 as NewsArticleSeed, "apps/website/data/news/open-ended-construction-toys-and-2026-retail-assortments/news.json"),
  withSource(newsArticle32 as NewsArticleSeed, "apps/website/data/news/piece-count-ladder-for-fort-building-kit-series-planning/news.json"),
  withSource(newsArticle33 as NewsArticleSeed, "apps/website/data/news/pre-quotation-safety-brief-for-private-label-fort-building-kits/news.json"),
  withSource(newsArticle34 as NewsArticleSeed, "apps/website/data/news/eu-toy-safety-preparation-for-fort-building-kit-exporters/news.json"),
  withSource(newsArticle35 as NewsArticleSeed, "apps/website/data/news/durable-fort-building-kits-support-sustainable-family-play/news.json"),
  withSource(newsArticle36 as NewsArticleSeed, "apps/website/data/news/school-and-activity-channel-fort-building-kit-buying-notes/news.json"),
] as const;

export const newsSourcePathBySlug = new Map(
  importedNewsArticles.map((item) => [item.data.slug, item.sourcePath]),
);

export const newsArticles: NewsArticleSeed[] = importedNewsArticles.map((item) => item.data);
