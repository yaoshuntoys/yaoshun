import {companyProfile, pageLabels} from '@/content/site';
import {products} from '@/content/site/products-catalog';
import {localeRegistry, t, type Locale} from '@/lib/i18n';
import {localizedPath} from '@/lib/routes';
import {
  defaultOgImage,
  siteAlternateNames,
  siteHomeUrl,
  siteLegalName,
  siteName,
  siteUrl,
  toAbsoluteUrl,
} from '@/lib/site-config';

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
  const localizedContact = `${siteUrl}${localizedPath(locale, 'contact')}`;
  const contactLanguages = companyProfile.contactLanguages.map((item) => t(locale, item));
  const serviceRegions = companyProfile.serviceRegions.map((item) => t(locale, item));
  const expertise = companyProfile.expertise.map((item) => t(locale, item));

  const organization = {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}#organization`,
    name: t(locale, companyProfile.companyName),
    legalName: locale === 'zh' ? t(locale, companyProfile.companyName) : siteLegalName,
    alternateName: Array.from(new Set([
      t(locale, companyProfile.brandShort),
      ...siteAlternateNames,
      'Dongguan Yaoshun Technology',
      '东莞市尧顺科技'
    ])),
    url: siteUrl,
    logo: toAbsoluteUrl('/favicon-rounded-192.png'),
    image: [
      toAbsoluteUrl(defaultOgImage),
      toAbsoluteUrl('/site/misc/product-bg.webp'),
      toAbsoluteUrl('/site/misc/solution-bg.webp')
    ],
    description: t(locale, companyProfile.seoDescription),
    slogan: t(locale, companyProfile.tagline),
    foundingDate: companyProfile.foundedYear,
    foundingLocation: {
      '@type': 'Place',
      name: 'Dongguan, Guangdong, China'
    },
    email: companyProfile.email,
    telephone: companyProfile.phone,
    priceRange: '$$',
    currenciesAccepted: ['USD', 'CNY'],
    paymentAccepted: ['T/T', 'Wire transfer'],
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
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
        url: localizedContact,
        areaServed: serviceRegions,
        availableLanguage: contactLanguages
      }
    ]
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: siteName,
    alternateName: siteAlternateNames,
    url: siteHomeUrl,
    inLanguage: localeMeta.htmlLang,
    description: t(locale, companyProfile.seoDescription),
    about: {
      '@id': `${siteUrl}#organization`
    },
    publisher: {
      '@id': `${siteUrl}#organization`
    }
  };

  const manufacturingService = {
    '@type': 'Service',
    '@id': `${siteUrl}#toy-oem-odm-service`,
    name: locale === 'zh' ? '玩具 OEM/ODM 与定制化开发服务' : 'Toy OEM/ODM and custom development service',
    serviceType: locale === 'zh' ? '玩具 OEM/ODM、开模、注塑、组装包装与出口交付' : 'Toy OEM/ODM, mold development, injection molding, assembly, packaging, and export delivery',
    description: t(locale, companyProfile.tagline),
    url: localizedContact,
    provider: {
      '@id': `${siteUrl}#organization`
    },
    areaServed: serviceRegions,
    audience: {
      '@type': 'BusinessAudience',
      audienceType: locale === 'zh' ? '品牌方、采购团队、跨境卖家与渠道商' : 'brand owners, sourcing teams, importers, distributors, and cross-border sellers'
    },
    offers: {
      '@type': 'Offer',
      url: localizedContact,
      availability: 'https://schema.org/InStock',
      businessFunction: 'https://schema.org/Sell',
      itemOffered: {
        '@type': 'Service',
        name: locale === 'zh' ? '搭建玩具、定制玩具与塑胶玩具制造' : 'Building toy, custom toy, and plastic toy manufacturing'
      }
    }
  };

  return <StructuredData data={{'@context': 'https://schema.org', '@graph': [organization, website, manufacturingService]}} />;
}
