import {companyProfile, pageLabels} from '@/content/site';
import {products} from '@/content/site/products-catalog';
import {localeRegistry, t, type Locale} from '@/lib/i18n';
import {localizedPath} from '@/lib/routes';
import {siteUrl, toAbsoluteUrl} from '@/lib/site-config';

type StructuredDataProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function StructuredData({data}: StructuredDataProps) {
  const serializedData = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script dangerouslySetInnerHTML={{__html: serializedData}} type="application/ld+json" />;
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
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}#organization`,
    name: t(locale, companyProfile.companyName),
    legalName: t(locale, companyProfile.companyName),
    alternateName: [
      t(locale, companyProfile.brandShort),
      'yaoshun toys',
      'Yaoshun',
      'Dongguan Yaoshun Technology'
    ],
    url: siteUrl,
    logo: toAbsoluteUrl('/favicon-rounded-192.png'),
    description: t(locale, companyProfile.seoDescription),
    slogan: t(locale, companyProfile.tagline),
    foundingDate: companyProfile.foundedYear,
    foundingLocation: {
      '@type': 'Place',
      name: 'Dongguan, Guangdong, China'
    },
    email: companyProfile.email,
    telephone: companyProfile.phone,
    sameAs: [companyProfile.website, 'https://www.1688.com/factory/b2b-33834399288d4ed.html'],
    keywords: expertise,
    knowsAbout: expertise,
    areaServed: serviceRegions,
    address: {
      '@type': 'PostalAddress',
      streetAddress: t(locale, companyProfile.address),
      addressLocality: 'Dongguan',
      addressRegion: 'Guangdong',
      addressCountry: 'CN'
    },
    location: {
      '@type': 'Place',
      name: t(locale, companyProfile.companyName),
      address: {
        '@type': 'PostalAddress',
        streetAddress: t(locale, companyProfile.address),
        addressLocality: 'Dongguan',
        addressRegion: 'Guangdong',
        addressCountry: 'CN'
      }
    },
    makesOffer: [
      {
        '@type': 'Offer',
        name: locale === 'zh' ? '搭建玩具与定制玩具 OEM/ODM' : 'Building toy and custom toy OEM/ODM',
        itemOffered: {
          '@type': 'Service',
          name: locale === 'zh' ? '玩具 OEM/ODM 与定制化开发服务' : 'Toy OEM/ODM and custom development service',
          serviceType: locale === 'zh' ? '东莞源头工厂定制开发' : 'Dongguan source factory custom development'
        }
      },
      {
        '@type': 'Offer',
        name: locale === 'zh' ? '模具开发、注塑、组装包装与出口交付' : 'Mold development, injection molding, assembly, packaging, and export delivery',
        itemOffered: {
          '@type': 'Service',
          name: locale === 'zh' ? '全链路玩具制造服务' : 'Full-chain toy manufacturing service',
          serviceType: locale === 'zh' ? '工厂生产与交付' : 'Factory manufacturing and delivery'
        }
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t(locale, pageLabels.products),
      url: localizedProducts,
      itemListElement: products
        .filter((product) => Boolean(product.productId))
        .map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
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
    '@id': `${siteUrl}#website`,
    name: t(locale, companyProfile.companyName),
    url: siteUrl,
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
