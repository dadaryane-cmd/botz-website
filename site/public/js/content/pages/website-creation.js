import { processSection, contactSection } from '../sections.js'

export const websiteCreation = {
  file: 'website-creation.html',
  meta: {
    title: {
      en: 'Website creation with basic SEO setup',
      hy: 'Կայքի ստեղծում հիմնական SEO կարգավորումով',
      ru: 'Создание сайта с базовой SEO-настройкой',
    },
    description: {
      en: 'A responsive small-business website launched with a basic SEO setup. One-time price, with optional extra landing pages.',
      hy: 'Ադապտիվ կայք փոքր բիզնեսի համար՝ հիմնական SEO կարգավորումով։ Միանվագ գին։',
      ru: 'Адаптивный сайт для малого бизнеса с базовым SEO. Единоразовая цена.',
    },
  },
  sections: [
    {
      type: 'hero',
      heading: {
        en: 'A website that *works as hard as you do.*',
        hy: 'Կայք, որն աշխատում է *ձեզ պես եռանդուն։*',
        ru: 'Сайт, который работает *так же усердно, как вы.*',
      },
      subheading: {
        en: 'Clear structure and fast pages, launched with the basics search engines need.',
        hy: 'Հստակ կառուցվածք և արագ էջեր՝ գործարկված այն հիմքով, որն անհրաժեշտ է որոնողական համակարգերին։',
        ru: 'Понятная структура и быстрые страницы — с базой, нужной поисковикам.',
      },
      buttons: [
        {
          label: {
            en: 'See prices',
            hy: 'Տեսնել գները',
            ru: 'Посмотреть цены',
          },
          href: '#pricing',
          style: 'primary',
        },
        {
          label: {
            en: 'Contact Edgar',
            hy: 'Կապվել Էդգարի հետ',
            ru: 'Написать Эдгару',
          },
          href: '#contact',
          style: 'secondary',
        },
      ],
      variant: 'title',
    },
    {
      type: 'pricing',
      id: 'pricing',
      background: 'surface',
      heading: {
        en: 'One price, *clear scope*',
        hy: 'Մեկ գին՝ *հստակ ծավալով*',
        ru: 'Одна цена — *понятный объём*',
      },
      defaultCategory: 'website',
      defaultDuration: 1,
      lockCategory: true,
      showAddons: true,
    },
    processSection,
    contactSection({
      heading: {
        en: 'Plan your *website*',
        hy: 'Պլանավորեք ձեր *կայքը*',
        ru: 'Спланируйте *сайт*',
      },
      service: 'website',
    }),
  ],
}
