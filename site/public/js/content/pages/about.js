import { processSection } from '../sections.js'

export const about = {
  file: 'about.html',
  meta: {
    title: {
      en: 'About BOTZ Marketing Agency',
      hy: 'BOTZ մարքեթինգային գործակալության մասին',
      ru: 'О маркетинговом агентстве BOTZ',
    },
    description: {
      en: 'BOTZ is a marketing agency for social media, SEO and websites, built on defined scopes, public prices and direct contact.',
      hy: 'BOTZ-ը մարքեթինգային գործակալություն է սոցցանցերի, SEO-ի և կայքերի համար՝ հիմնված հստակ ծավալի, բաց գների և ուղիղ կապի վրա։',
      ru: 'BOTZ — маркетинговое агентство по соцсетям, SEO и сайтам: чёткий объём, открытые цены и прямой контакт.',
    },
  },
  sections: [
    {
      type: 'hero',
      heading: {
        en: 'Small team. *Clear promises.* Real work.',
        hy: 'Փոքր թիմ։ *Հստակ խոստումներ։* Իրական աշխատանք։',
        ru: 'Небольшая команда. *Чёткие обещания.* Настоящая работа.',
      },
      subheading: {
        en: 'We started BOTZ to make marketing services easier to understand and easier to trust.',
        hy: 'Մենք ստեղծեցինք BOTZ-ը, որպեսզի մարքեթինգային ծառայություններն ավելի հասկանալի և վստահելի դարձնենք։',
        ru: 'Мы создали BOTZ, чтобы маркетинговые услуги стали понятнее и вызывали больше доверия.',
      },
      buttons: [
        {
          label: {
            en: 'Discuss my project',
            hy: 'Քննարկել իմ նախագիծը',
            ru: 'Обсудить мой проект',
          },
          href: '#contact',
          style: 'primary',
        },
      ],
      variant: 'title',
    },
    {
      type: 'split',
      statement: {
        en: 'Good marketing should be *easy to buy* and *easy to measure.*',
        hy: 'Լավ մարքեթինգը պետք է լինի *հեշտ ձեռք բերվող* և *հեշտ չափելի։*',
        ru: 'Хороший маркетинг должно быть *легко купить* и *легко измерить.*',
      },
      body: {
        en: 'Too often, agencies sell vague packages and hide the details. We do the opposite: every package lists what is included and what is not, prices are public, and results are reported in plain language.',
        hy: 'Հաճախ գործակալությունները վաճառում են անորոշ փաթեթներ և թաքցնում մանրամասները։ Մենք անում ենք հակառակը․ յուրաքանչյուր փաթեթում նշված է, թե ինչն է ներառված և ինչը՝ ոչ, գները հրապարակային են, իսկ արդյունքները ներկայացվում են պարզ լեզվով։',
        ru: 'Слишком часто агентства продают размытые пакеты и скрывают детали. Мы делаем наоборот: в каждом пакете указано, что входит и что нет, цены открыты, а результаты описаны простым языком.',
      },
      points: [
        {
          title: {
            en: 'Mariam',
            hy: 'Մարիամ',
            ru: 'Мариам',
          },
          text: {
            en: 'Leads social media marketing.',
            hy: 'Ղեկավարում է սոցիալական մեդիա մարքեթինգը։',
            ru: 'Руководит направлением SMM.',
          },
        },
        {
          title: {
            en: 'Edgar',
            hy: 'Էդգար',
            ru: 'Эдгар',
          },
          text: {
            en: 'Leads SEO and website creation.',
            hy: 'Ղեկավարում է SEO-ն և կայքերի ստեղծումը։',
            ru: 'Руководит SEO и созданием сайтов.',
          },
        },
      ],
    },
    processSection,
    {
      type: 'cta',
      background: 'accent',
      heading: {
        en: 'Have a project in mind? *Let’s hear it.*',
        hy: 'Նախագիծ ունե՞ք։ *Պատմեք մեզ։*',
        ru: 'Есть идея проекта? *Расскажите.*',
      },
      text: {
        en: 'Tell us where you are now and where you want to be.',
        hy: 'Պատմեք, թե որտեղ եք հիմա և ուր եք ուզում հասնել։',
        ru: 'Расскажите, где вы сейчас и куда хотите прийти.',
      },
      buttons: [
        {
          label: {
            en: 'Discuss my project',
            hy: 'Քննարկել իմ նախագիծը',
            ru: 'Обсудить мой проект',
          },
          href: 'contact.html',
          style: 'primary',
        },
        {
          label: {
            en: 'Explore packages',
            hy: 'Դիտել փաթեթները',
            ru: 'Смотреть пакеты',
          },
          href: 'pricing.html',
          style: 'secondary',
        },
      ],
    },
  ],
}
