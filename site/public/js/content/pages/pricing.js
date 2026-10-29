import { faq } from '../faq.js'
import { finderSection, contactSection } from '../sections.js'

export const pricing = {
  file: 'pricing.html',
  meta: {
    title: {
      en: 'Interactive pricing — SMM, SEO and websites',
      hy: 'Ինտերակտիվ գներ — SMM, SEO և կայքեր',
      ru: 'Интерактивные цены — SMM, SEO и сайты',
    },
    description: {
      en: 'Choose a package and contract length to see the monthly price, the total and your savings. Add extras, compare packages and request a proposal.',
      hy: 'Ընտրեք փաթեթ և ժամկետ՝ տեսնելու ամսական գինը, ընդհանուր գումարը և խնայողությունը։ Ավելացրեք լրացուցիչ ծառայություններ, համեմատեք և ստացեք առաջարկ։',
      ru: 'Выберите пакет и срок, чтобы увидеть цену в месяц, итог и экономию. Добавьте опции, сравните пакеты и запросите предложение.',
    },
  },
  sections: [
    {
      type: 'hero',
      heading: {
        en: 'Work longer, *pay less per month.*',
        hy: 'Աշխատեք ավելի երկար, *վճարեք ավելի քիչ ամսական։*',
        ru: 'Дольше работаем — *меньше платите в месяц.*',
      },
      subheading: {
        en: 'Pick a service and a term. Prices, totals and savings update instantly — then send the estimate with your inquiry or share it.',
        hy: 'Ընտրեք ծառայություն և ժամկետ։ Գները, ընդհանուր գումարը և խնայողությունը թարմացվում են անմիջապես․ հետո ուղարկեք նախահաշիվը հարցման հետ կամ կիսվեք դրանով։',
        ru: 'Выберите услугу и срок. Цены, итог и экономия обновляются сразу — затем отправьте расчёт с заявкой или поделитесь им.',
      },
      buttons: [
        {
          label: {
            en: 'Find my package',
            hy: 'Գտնել իմ փաթեթը',
            ru: 'Подобрать пакет',
          },
          href: '#guide',
          style: 'secondary',
        },
      ],
      variant: 'title',
    },
    {
      type: 'pricing',
      id: 'pricing',
      defaultCategory: 'smm',
      defaultDuration: 6,
      lockCategory: false,
      showAddons: true,
    },
    finderSection,
    {
      type: 'faq',
      width: 'narrow',
      heading: {
        en: 'Pricing *questions*',
        hy: 'Գների մասին *հարցեր*',
        ru: 'Вопросы о *ценах*',
      },
      items: [
        faq.contractLength,
        faq.combiningServices,
        faq.estimateIsNotContract,
        faq.noGuarantees,
      ],
    },
    contactSection(),
  ],
}
