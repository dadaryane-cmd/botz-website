import { faq } from '../faq.js'
import { serviceItems, processSection, finderSection, contactSection } from '../sections.js'

export const home = {
  file: 'index.html',
  meta: {
    title: {
      en: 'BOTZ — Social media, SEO and websites',
      hy: 'BOTZ — Սոցցանցեր, SEO և կայքեր',
      ru: 'BOTZ — Соцсети, SEO и сайты',
    },
    description: {
      en: 'BOTZ Marketing Agency runs social media, search optimisation and websites with clear packages and transparent prices. Explore packages or discuss your project.',
      hy: 'BOTZ մարքեթինգային գործակալությունը վարում է սոցցանցեր, որոնողական օպտիմալացում և կայքեր՝ հստակ փաթեթներով և թափանցիկ գներով։',
      ru: 'Маркетинговое агентство BOTZ: соцсети, поисковая оптимизация и сайты — с понятными пакетами и прозрачными ценами.',
    },
  },
  sections: [
    {
      type: 'hero',
      width: 'wide',
      heading: {
        en: 'Make your brand *impossible to scroll past.*',
        hy: 'Դարձրեք ձեր բրենդը *անհնար անտեսել։*',
        ru: 'Бренд, который *невозможно пролистать.*',
      },
      subheading: {
        en: 'BOTZ runs social media, search optimisation and websites for growing businesses — with clear packages, prices in the open and two people you can actually talk to.',
        hy: 'BOTZ-ը վարում է սոցցանցեր, որոնողական օպտիմալացում և կայքեր աճող բիզնեսների համար՝ հստակ փաթեթներով, բաց գներով և երկու մարդով, որոնց հետ կարող եք իսկապես խոսել։',
        ru: 'BOTZ ведёт соцсети, поисковую оптимизацию и сайты растущих компаний — с понятными пакетами, открытыми ценами и двумя людьми, с которыми действительно можно поговорить.',
      },
      buttons: [
        {
          label: {
            en: 'Get a free audit',
            hy: 'Ստանալ անվճար աուդիտ',
            ru: 'Получить бесплатный аудит',
          },
          href: '#contact',
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
      ticker: [
        {
          en: 'Social media',
          hy: 'Սոցցանցեր',
          ru: 'Соцсети',
        },
        {
          en: 'Search optimisation',
          hy: 'Որոնողական օպտիմալացում',
          ru: 'Поисковая оптимизация',
        },
        {
          en: 'Websites',
          hy: 'Կայքեր',
          ru: 'Сайты',
        },
        {
          en: 'Content',
          hy: 'Բովանդակություն',
          ru: 'Контент',
        },
        {
          en: 'Meta ads',
          hy: 'Meta գովազդ',
          ru: 'Реклама в Meta',
        },
        {
          en: 'Reels',
          hy: 'Reels',
          ru: 'Reels',
        },
      ],
      variant: 'home',
      offerCard: true,
    },
    {
      type: 'split',
      statement: {
        en: 'One team for the work that brings people to you: *social, search and site.*',
        hy: 'Մեկ թիմ այն աշխատանքի համար, որը մարդկանց բերում է ձեզ մոտ՝ *սոցցանցեր, որոնում և կայք։*',
        ru: 'Одна команда для всего, что приводит к вам людей: *соцсети, поиск и сайт.*',
      },
      body: {
        en: 'BOTZ is a marketing agency built around a simple idea: you should know exactly what you are paying for. Every package has a defined scope, every price is public, and results are reported regularly in plain language.',
        hy: 'BOTZ-ը մարքեթինգային գործակալություն է՝ կառուցված պարզ գաղափարի շուրջ․ դուք պետք է հստակ իմանաք, թե ինչի համար եք վճարում։ Յուրաքանչյուր փաթեթ ունի որոշված ծավալ, յուրաքանչյուր գին հրապարակային է, իսկ արդյունքները կանոնավոր ներկայացվում են պարզ լեզվով։',
        ru: 'BOTZ — маркетинговое агентство, построенное на простой идее: вы должны точно знать, за что платите. У каждого пакета есть определённый объём, все цены открыты, а результаты регулярно описываются простым языком.',
      },
      points: [
        {
          title: {
            en: 'Defined scope',
            hy: 'Որոշված ծավալ',
            ru: 'Чёткий объём',
          },
          text: {
            en: 'Quantities and boundaries are written down — no vague promises.',
            hy: 'Քանակներն ու սահմանները գրավոր են՝ առանց անորոշ խոստումների։',
            ru: 'Объёмы и границы зафиксированы — без размытых обещаний.',
          },
        },
        {
          title: {
            en: 'Prices in the open',
            hy: 'Բաց գներ',
            ru: 'Открытые цены',
          },
          text: {
            en: 'See the monthly fee, the full-term total and your savings before you call.',
            hy: 'Տեսեք ամսական վճարը, ամբողջ ժամկետի գումարը և խնայողությունը՝ նախքան զանգելը։',
            ru: 'Цена в месяц, сумма за срок и экономия видны ещё до звонка.',
          },
        },
        {
          title: {
            en: 'Direct contacts',
            hy: 'Ուղիղ կապ',
            ru: 'Прямой контакт',
          },
          text: {
            en: 'Mariam for social media, Edgar for SEO and websites.',
            hy: 'Մարիամը՝ սոցցանցերի, Էդգարը՝ SEO-ի և կայքերի համար։',
            ru: 'Мариам — по соцсетям, Эдгар — по SEO и сайтам.',
          },
        },
      ],
    },
    {
      type: 'services',
      background: 'surface',
      heading: {
        en: 'What we *do*',
        hy: 'Ինչ ենք *անում*',
        ru: 'Что мы *делаем*',
      },
      items: serviceItems,
    },
    {
      type: 'team',
      heading: {
        en: 'Who’s behind *BOTZ*',
        hy: 'Ովքեր են *BOTZ*-ի հետևում',
        ru: 'Кто стоит за *BOTZ*',
      },
      intro: {
        en: 'Two founders, one for each discipline. You work with us directly — no account managers in between.',
        hy: 'Երկու հիմնադիր՝ յուրաքանչյուրն իր ոլորտում։ Դուք աշխատում եք անմիջապես մեզ հետ՝ առանց միջնորդ մենեջերների։',
        ru: 'Два основателя — по одному на каждое направление. Вы работаете напрямую с нами, без менеджеров-посредников.',
      },
      founders: [
        {
          name: {
            en: 'Mariam',
            hy: 'Մարիամ',
            ru: 'Мариам',
          },
          role: {
            en: 'Social media marketing',
            hy: 'Սոցիալական մեդիա մարքեթինգ',
            ru: 'Маркетинг в соцсетях',
          },
        },
        {
          name: {
            en: 'Edgar',
            hy: 'Էդգար',
            ru: 'Эдгар',
          },
          role: {
            en: 'SEO & website creation',
            hy: 'SEO և կայքերի ստեղծում',
            ru: 'SEO и создание сайтов',
          },
        },
      ],
    },
    {
      type: 'split',
      background: 'surface',
      statement: {
        en: 'Why work with a *new agency?*',
        hy: 'Ինչու՞ աշխատել *նոր գործակալության* հետ',
        ru: 'Почему стоит работать с *новым агентством?*',
      },
      body: {
        en: 'Being new means every client gets our full attention — and the people who sell the work are the people who do it.',
        hy: 'Նոր լինելը նշանակում է, որ յուրաքանչյուր հաճախորդ ստանում է մեր ամբողջ ուշադրությունը, իսկ աշխատանքը վաճառողները հենց այն կատարողներն են։',
        ru: 'Мы новые, поэтому каждый клиент получает всё наше внимание, а те, кто обсуждает с вами работу, её и выполняют.',
      },
      points: [
        {
          title: {
            en: 'Senior people on every project',
            hy: 'Փորձառու մասնագետներ յուրաքանչյուր նախագծում',
            ru: 'Опытные специалисты в каждом проекте',
          },
          text: {
            en: 'The founders do the work themselves — no hand-offs to juniors.',
            hy: 'Աշխատանքը կատարում են հիմնադիրներն իրենք՝ առանց սկսնակներին փոխանցելու։',
            ru: 'Работу делают сами основатели — без передачи новичкам.',
          },
        },
        {
          title: {
            en: 'You talk directly to the founders',
            hy: 'Դուք խոսում եք անմիջապես հիմնադիրների հետ',
            ru: 'Вы общаетесь напрямую с основателями',
          },
          text: {
            en: 'Mariam for social media, Edgar for SEO and websites.',
            hy: 'Մարիամը՝ սոցցանցերի, Էդգարը՝ SEO-ի և կայքերի համար։',
            ru: 'Мариам — по соцсетям, Эдгар — по SEO и сайтам.',
          },
        },
        {
          title: {
            en: 'Founding-client pricing',
            hy: 'Առաջին հաճախորդների գներ',
            ru: 'Цены для первых клиентов',
          },
          text: {
            en: 'Our first clients get a founding discount in exchange for a case study and an honest review.',
            hy: 'Մեր առաջին հաճախորդները ստանում են զեղչ՝ նախագծի նկարագրության և անկեղծ կարծիքի դիմաց։',
            ru: 'Первые клиенты получают скидку в обмен на кейс и честный отзыв.',
          },
        },
      ],
    },
    {
      type: 'samples',
      id: 'samples',
      heading: {
        en: 'See exactly *what you’ll get*',
        hy: 'Տեսեք, թե *ինչ կստանաք*',
        ru: 'Посмотрите, *что вы получите*',
      },
      intro: {
        en: 'The real formats of our deliverables, filled with illustrative data.',
        hy: 'Մեր աշխատանքների իրական ձևաչափերը՝ պայմանական տվյալներով։',
        ru: 'Реальные форматы наших материалов с условными данными.',
      },
      items: [
        {
          title: {
            en: 'SEO audit',
            hy: 'SEO աուդիտ',
            ru: 'SEO-аудит',
          },
          text: {
            en: 'Technical issues, priorities and a clear action list.',
            hy: 'Տեխնիկական խնդիրներ, առաջնահերթություններ և հստակ անելիքների ցանկ։',
            ru: 'Технические проблемы, приоритеты и понятный список действий.',
          },
          file: 'downloads/sample-seo-audit.pdf',
        },
        {
          title: {
            en: 'Monthly report',
            hy: 'Ամսական հաշվետվություն',
            ru: 'Ежемесячный отчёт',
          },
          text: {
            en: 'What we did, what changed and what comes next — in plain language.',
            hy: 'Ինչ արեցինք, ինչ փոխվեց և ինչ է հաջորդը՝ պարզ լեզվով։',
            ru: 'Что сделано, что изменилось и что дальше — простым языком.',
          },
          file: 'downloads/sample-monthly-report.pdf',
        },
        {
          title: {
            en: 'One-month SMM content plan',
            hy: 'Մեկ ամսվա SMM բովանդակային պլան',
            ru: 'Контент-план SMM на месяц',
          },
          text: {
            en: 'Topics, formats and a posting calendar for one month.',
            hy: 'Թեմաներ, ձևաչափեր և մեկ ամսվա հրապարակումների օրացույց։',
            ru: 'Темы, форматы и календарь публикаций на месяц.',
          },
          file: 'downloads/sample-smm-content-plan.pdf',
        },
      ],
    },
    finderSection,
    {
      type: 'packagePreview',
      heading: {
        en: 'Packages, *priced in the open*',
        hy: 'Փաթեթներ՝ *բաց գներով*',
        ru: 'Пакеты *с открытыми ценами*',
      },
      intro: {
        en: 'Monthly prices for a 12-month agreement. Shorter terms are available — compare them in the pricing tool.',
        hy: 'Ամսական գներ 12 ամսվա պայմանագրի դեպքում։ Հասանելի են նաև ավելի կարճ ժամկետներ՝ համեմատեք դրանք գնային գործիքում։',
        ru: 'Цены в месяц при договоре на 12 месяцев. Есть и более короткие сроки — сравните их в калькуляторе.',
      },
      categories: ['smm', 'seo', 'bundle', 'website'],
      duration: 12,
      link: {
        label: {
          en: 'Explore packages',
          hy: 'Դիտել փաթեթները',
          ru: 'Смотреть пакеты',
        },
        href: 'pricing.html',
        style: 'primary',
      },
      showGuideLink: true,
    },
    processSection,
    {
      type: 'faq',
      width: 'narrow',
      heading: {
        en: 'Good *questions*',
        hy: 'Լավ *հարցեր*',
        ru: 'Хорошие *вопросы*',
      },
      items: [
        faq.contractLength,
        faq.combiningServices,
        faq.estimateIsNotContract,
        faq.noGuarantees,
        faq.whoYouWorkWith,
      ],
      structuredData: true,
    },
    contactSection(),
  ],
}
