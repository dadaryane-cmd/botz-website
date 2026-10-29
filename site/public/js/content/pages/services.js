import { serviceItems, processSection, finderSection, contactSection } from '../sections.js'

export const services = {
  file: 'services.html',
  meta: {
    title: {
      en: 'Services — SMM, SEO and website creation',
      hy: 'Ծառայություններ — SMM, SEO և կայքերի ստեղծում',
      ru: 'Услуги — SMM, SEO и создание сайтов',
    },
    description: {
      en: 'Social media marketing, search engine optimisation, website creation and combined SMM + SEO plans from BOTZ Marketing Agency.',
      hy: 'Սոցիալական մեդիա մարքեթինգ, որոնողական օպտիմալացում, կայքերի ստեղծում և համակցված SMM + SEO փաթեթներ BOTZ-ից։',
      ru: 'Маркетинг в соцсетях, поисковая оптимизация, создание сайтов и комплексные планы SMM + SEO от BOTZ.',
    },
  },
  sections: [
    {
      type: 'hero',
      heading: {
        en: 'Everything people see *before they choose you.*',
        hy: 'Այն ամենը, ինչ մարդիկ տեսնում են *նախքան ձեզ ընտրելը։*',
        ru: 'Всё, что люди видят, *прежде чем выбрать вас.*',
      },
      subheading: {
        en: 'Pick one service or combine them. Each has a clear scope, a public price and a person responsible for it.',
        hy: 'Ընտրեք մեկ ծառայություն կամ համատեղեք դրանք։ Յուրաքանչյուրն ունի հստակ ծավալ, հրապարակային գին և պատասխանատու մարդ։',
        ru: 'Выберите одну услугу или объедините несколько. У каждой — чёткий объём, открытая цена и ответственный человек.',
      },
      buttons: [
        {
          label: {
            en: 'Explore packages',
            hy: 'Դիտել փաթեթները',
            ru: 'Смотреть пакеты',
          },
          href: 'pricing.html',
          style: 'primary',
        },
        {
          label: {
            en: 'Discuss my project',
            hy: 'Քննարկել իմ նախագիծը',
            ru: 'Обсудить мой проект',
          },
          href: '#contact',
          style: 'secondary',
        },
      ],
      variant: 'title',
    },
    {
      type: 'services',
      items: serviceItems,
    },
    processSection,
    finderSection,
    contactSection(),
  ],
}
