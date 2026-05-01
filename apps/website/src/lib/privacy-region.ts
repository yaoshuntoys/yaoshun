const consentRequiredCountries = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LV",
  "LI",
  "LT",
  "LU",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "CH",
  "GB",
]);

export const consentRequiredCookieName = "yaoshun-consent-required";

export function normalizeCountryCode(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  return normalized.length === 2 ? normalized : null;
}

export function isConsentRequiredCountry(value: string | null | undefined): boolean {
  const countryCode = normalizeCountryCode(value);

  if (!countryCode) {
    return process.env.NODE_ENV === "production";
  }

  return consentRequiredCountries.has(countryCode);
}
