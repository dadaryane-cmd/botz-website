/**
 * Published price list (AMD). Recurring packages have a monthly price per contract length
 * (m1 … m12, null = not offered); website creation has a one-time price.
 */
export const packages = [
  {
    key: 'smm-start',
    category: 'smm',
    name: {
      en: 'Start',
      hy: 'Start',
      ru: 'Start',
    },
    tagline: {
      en: 'For small businesses building a consistent social presence',
      hy: 'Փոքր բիզնեսների համար, որոնք կառուցում են կայուն ներկայություն սոցցանցերում',
      ru: 'Для малого бизнеса, который выстраивает стабильное присутствие в соцсетях',
    },
    prices: {
      m1: 79000,
      m3: 75000,
      m6: 73000,
      m9: 70000,
      m12: 66500,
    },
    recommended: false,
    contact: 'mariam',
  },
  {
    key: 'smm-dominance',
    category: 'smm',
    name: {
      en: 'Dominance',
      hy: 'Dominance',
      ru: 'Dominance',
    },
    tagline: {
      en: 'For brands focused on steady monthly growth',
      hy: 'Բրենդների համար, որոնք ձգտում են կայուն ամսական աճի',
      ru: 'Для брендов, нацеленных на стабильный ежемесячный рост',
    },
    prices: {
      m1: 119000,
      m3: 115000,
      m6: 110000,
      m9: 105000,
      m12: 103000,
    },
    recommended: true,
    contact: 'mariam',
  },
  {
    key: 'smm-gold',
    category: 'smm',
    name: {
      en: 'Gold',
      hy: 'Gold',
      ru: 'Gold',
    },
    tagline: {
      en: 'For businesses that want full-service social media support',
      hy: 'Բիզնեսների համար, որոնք ցանկանում են սոցցանցերի ամբողջական սպասարկում',
      ru: 'Для бизнеса, которому нужен полный сервис в соцсетях',
    },
    prices: {
      m1: 149000,
      m3: 145000,
      m6: 140000,
      m9: 135000,
      m12: 129000,
    },
    recommended: false,
    contact: 'mariam',
  },
  {
    key: 'seo-fundamental',
    category: 'seo',
    name: {
      en: 'Fundamental',
      hy: 'Fundamental',
      ru: 'Fundamental',
    },
    tagline: {
      en: 'For websites that need a strong SEO foundation',
      hy: 'Կայքերի համար, որոնց անհրաժեշտ է ամուր SEO հիմք',
      ru: 'Для сайтов, которым нужен прочный SEO-фундамент',
    },
    prices: {
      m1: 179000,
      m3: 175000,
      m6: 165000,
      m9: null,
      m12: null,
    },
    recommended: false,
    contact: 'edgar',
  },
  {
    key: 'seo-vision',
    category: 'seo',
    name: {
      en: 'Vision',
      hy: 'Vision',
      ru: 'Vision',
    },
    tagline: {
      en: 'For businesses targeting organic growth',
      hy: 'Բիզնեսների համար, որոնք ձգտում են օրգանիկ աճի',
      ru: 'Для бизнеса, нацеленного на органический рост',
    },
    prices: {
      m1: 349000,
      m3: 340000,
      m6: 330000,
      m9: 320000,
      m12: 299000,
    },
    recommended: true,
    contact: 'edgar',
  },
  {
    key: 'seo-authority',
    category: 'seo',
    name: {
      en: 'Authority',
      hy: 'Authority',
      ru: 'Authority',
    },
    tagline: {
      en: 'For competitive brands aiming for market leadership',
      hy: 'Մրցունակ բրենդների համար, որոնք ձգտում են շուկայում առաջատար լինել',
      ru: 'Для конкурентных брендов, стремящихся к лидерству',
    },
    prices: {
      m1: 499000,
      m3: 480000,
      m6: 475000,
      m9: 445000,
      m12: 420000,
    },
    recommended: false,
    contact: 'edgar',
  },
  {
    key: 'business-boost',
    category: 'bundle',
    name: {
      en: 'Business Boost',
      hy: 'Business Boost',
      ru: 'Business Boost',
    },
    tagline: {
      en: 'One team for social media and SEO growth',
      hy: 'Մեկ թիմ՝ սոցցանցերի և SEO աճի համար',
      ru: 'Одна команда для роста в соцсетях и поиске',
    },
    prices: {
      m1: 449000,
      m3: 430000,
      m6: 420000,
      m9: 410000,
      m12: 389000,
    },
    recommended: false,
    components: ['smm-dominance', 'seo-vision'],
    contact: 'either',
  },
  {
    key: 'ultra',
    category: 'bundle',
    name: {
      en: 'Ultra',
      hy: 'Ultra',
      ru: 'Ultra',
    },
    tagline: {
      en: 'Full-scale performance with premium support',
      hy: 'Ամբողջական արդյունավետություն՝ պրեմիում աջակցությամբ',
      ru: 'Максимальный масштаб и премиальная поддержка',
    },
    prices: {
      m1: 630000,
      m3: 615000,
      m6: 610000,
      m9: 559000,
      m12: 529000,
    },
    recommended: false,
    components: ['smm-gold', 'seo-authority'],
    contact: 'either',
  },
  {
    key: 'website-creation',
    category: 'website',
    name: {
      en: 'Website Creation',
      hy: 'Կայքի ստեղծում',
      ru: 'Создание сайта',
    },
    tagline: {
      en: 'With basic SEO setup',
      hy: 'Հիմնական SEO կարգավորումով',
      ru: 'С базовой SEO-настройкой',
    },
    oneTimePrice: 299000,
    recommended: false,
    contact: 'edgar',
  },
]

export const addons = [
  {
    key: 'reel',
    name: {
      en: 'Reel with full equipment',
      hy: 'Reel՝ ամբողջական սարքավորումով',
      ru: 'Reels с полным оборудованием',
    },
    price: 25000,
    priceIsFrom: false,
    contact: 'mariam',
  },
  {
    key: 'reel-4',
    name: {
      en: '4 reels with full equipment',
      hy: '4 Reel՝ ամբողջական սարքավորումով',
      ru: '4 Reels с полным оборудованием',
    },
    price: 89000,
    priceIsFrom: false,
    units: 4,
    contact: 'mariam',
  },
  {
    key: 'article',
    name: {
      en: 'Optimised blog article',
      hy: 'Օպտիմալացված բլոգային հոդված',
      ru: 'Оптимизированная статья для блога',
    },
    price: 39000,
    priceIsFrom: true,
    contact: 'edgar',
  },
  {
    key: 'article-4',
    name: {
      en: '4 blog articles',
      hy: '4 բլոգային հոդված',
      ru: '4 статьи для блога',
    },
    price: 119000,
    priceIsFrom: false,
    units: 4,
    contact: 'edgar',
  },
  {
    key: 'landing-page',
    name: {
      en: 'Additional landing page',
      hy: 'Լրացուցիչ landing էջ',
      ru: 'Дополнительная посадочная страница',
    },
    price: 79000,
    priceIsFrom: false,
    contact: 'edgar',
  },
]

export const catalog = { packages, addons }
