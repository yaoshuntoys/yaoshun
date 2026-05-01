import {companyProfile, pageLabels} from '@/content/site';
import {products} from '@/content/site/products-catalog';
import {localeRegistry, t, type Locale} from '@/lib/i18n';
import {localizedPath} from '@/lib/routes';
import {siteUrl, toAbsoluteUrl} from '@/lib/site-config';

type StructuredDataProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function StructuredData({data}: StructuredDataProps) {
  return <script dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} type="application/ld+json" />;
}

function localizeProductTitle(locale: Locale, value: Partial<Record<Locale, string>> | undefined, fallback: string): string {
  if (!value) return fallback;
  return value[locale] || value.en || value.zh || fallback;
}

export function SiteStructuredData({locale}: {locale: Locale}) {
  const localeMeta = localeRegistry[locale];
  const localizedHome = `${siteUrl}${localizedPath(locale, 'home')}`;
  const localizedProducts = `${siteUrl}${localizedPath(locale, 'products')}`;
  const contactLanguages = companyProfile.contactLanguages.map((item) => t(locale, item));
  const serviceRegions = companyProfile.serviceRegions.map((item) => t(locale, item));
  const expertise = companyProfile.expertise.map((item) => t(locale, item));

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: t(locale, companyProfile.companyName),
    alternateName: t(locale, companyProfile.brandShort),
    url: localizedHome,
    logo: toAbsoluteUrl('/logo.svg'),
    description: t(locale, companyProfile.seoDescription),
    slogan: t(locale, companyProfile.tagline),
    foundingDate: companyProfile.foundedYear,
    email: companyProfile.email,
    telephone: companyProfile.phone,
    sameAs: [companyProfile.website],
    knowsAbout: expertise,
    areaServed: serviceRegions,
    address: {
      '@type': 'PostalAddress',
      streetAddress: t(locale, companyProfile.address),
      addressLocality: 'Dongguan',
      addressRegion: 'Guangdong',
      addressCountry: 'CN'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t(locale, pageLabels.products),
      url: localizedProducts,
      itemListElement: products
        .filter((product) => Boolean(product.productId))
        .map((product) => ({
          '@type': 'ListItem',
          name: localizeProductTitle(locale, product.title, product.productId),
          url: `${siteUrl}${localizedPath(locale, 'products')}/${product.productId}`
        }))
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: companyProfile.email,
        telephone: companyProfile.phone,
        areaServed: serviceRegions,
        availableLanguage: contactLanguages
      }
    ]
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${localizedHome}#website`,
    name: t(locale, companyProfile.companyName),
    url: localizedHome,
    inLanguage: localeMeta.htmlLang,
    description: t(locale, companyProfile.seoDescription),
    about: {
      '@id': `${siteUrl}#organization`
    },
    publisher: {
      '@id': `${siteUrl}#organization`
    }
  };

  return <StructuredData data={[organization, website]} />;
}
