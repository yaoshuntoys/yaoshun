export const seoKeywordLimit = 6;

const excludedSeoKeywordPattern = /东\s*莞|dong\s*guan/i;
const weakSeoKeywordTokens = new Set([
  "and",
  "for",
  "with",
  "the",
  "to",
  "of",
  "a",
  "an",
]);

function normalizeSeoKeyword(value: string) {
  return value
    .replace(/[|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isAllowedSeoKeyword(keyword: string) {
  return Boolean(keyword.trim()) && !excludedSeoKeywordPattern.test(keyword);
}

function normalizeKeywordForSimilarity(value: string) {
  return normalizeSeoKeyword(value)
    .toLowerCase()
    .replace(/[&,+/]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSimilarityTokens(value: string) {
  return normalizeKeywordForSimilarity(value)
    .split(" ")
    .filter((token) => token.length > 1 && !weakSeoKeywordTokens.has(token));
}

export function areSeoKeywordsSimilar(first: string, second: string) {
  const a = normalizeKeywordForSimilarity(first);
  const b = normalizeKeywordForSimilarity(second);

  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 8 && b.includes(a)) return true;
  if (b.length >= 8 && a.includes(b)) return true;

  const aTokens = new Set(getSimilarityTokens(a));
  const bTokens = new Set(getSimilarityTokens(b));

  if (aTokens.size < 2 || bTokens.size < 2) {
    return false;
  }

  const shared = Array.from(aTokens).filter((token) => bTokens.has(token)).length;
  const smallerOverlap = shared / Math.min(aTokens.size, bTokens.size);
  const largerOverlap = shared / Math.max(aTokens.size, bTokens.size);

  return smallerOverlap >= 0.8 && largerOverlap >= 0.6;
}

export function cleanSeoKeywords(
  keywords: readonly string[],
  limit = seoKeywordLimit,
) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of keywords) {
    const keyword = normalizeSeoKeyword(item);
    const lookupKey = keyword.toLowerCase();

    if (!isAllowedSeoKeyword(keyword) || seen.has(lookupKey)) {
      continue;
    }

    if (result.some((existing) => areSeoKeywordsSimilar(keyword, existing))) {
      continue;
    }

    seen.add(lookupKey);
    result.push(keyword);

    if (result.length >= limit) {
      break;
    }
  }

  return result;
}
