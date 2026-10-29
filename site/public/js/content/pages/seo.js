import { faq } from '../faq.js'
import { contactSection } from '../sections.js'

export const seo = {
  file: 'seo.html',
  meta: {
    title: {
      en: 'SEO packages — Fundamental, Vision, Authority',
      hy: 'SEO փաթեթներ — Fundamental, Vision, Authority',
      ru: 'SEO-пакеты — Fundamental, Vision, Authority',
    },
    description: {
      en: 'SEO packages with technical audits, page optimisation, articles and outreach. Compare monthly prices, totals and savings for 1–12 months.',
      hy: 'SEO փաթեթներ՝ տեխնիկական աուդիտով, էջերի օպտիմալացմամբ, հոդվածներով և PR-ով։ Համեմատեք ամսական գները, ընդհանուր գումարները և խնայողությունը։',
      ru: 'SEO-пакеты: технический аудит, оптимизация страниц, статьи и аутрич. Сравните цены, итоги и экономию на 1–12 месяцев.',
    },
  },
  sections: [
    {
      type: 'hero',
      heading: {
        en: 'Be found by people *already looking for you.*',
        hy: 'Թող ձեզ գտնեն նրանք, *ովքեր արդեն փնտրում են։*',
        ru: 'Пусть вас найдут те, *кто уже ищет.*',
      },
      subheading: {
        en: 'Technical foundations, useful content and steady authority building — measured every month, explained in plain language.',
        hy: 'Տեխնիկական հիմք, օգտակար բովանդակություն և հեղինակության կայուն աճ՝ չափվող ամեն ամիս և բացատրվող պարզ լեզվով։',
        ru: 'Технический фундамент, полезный контент и стабильный рост авторитета — с ежемесячными замерами и объяснениями простым языком.',
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
      type: 'split',
      statement: {
        en: 'Search is *compound interest* for your brand.',
        hy: 'Որոնումը ձեր բրենդի *բարդ տոկոսն* է։',
        ru: 'Поиск — это *сложный процент* для бренда.',
      },
      body: {
        en: 'SEO builds slowly and keeps working. We start with what stops search engines from understanding your site, then grow the pages and content that answer what your customers ask.',
        hy: 'SEO-ն կառուցվում է դանդաղ, բայց շարունակում է աշխատել։ Սկսում ենք նրանից, ինչը խանգարում է որոնողական համակարգերին հասկանալ ձեր կայքը, ապա զարգացնում ենք էջերն ու բովանդակությունը, որոնք պատասխանում են ձեր հաճախորդների հարցերին։',
        ru: 'SEO растёт медленно, но продолжает работать. Мы начинаем с того, что мешает поисковикам понять ваш сайт, а затем развиваем страницы и контент, отвечающие на вопросы клиентов.',
      },
    },
    {
      type: 'pricing',
      id: 'pricing',
      background: 'surface',
      heading: {
        en: 'Pick your *depth*',
        hy: 'Ընտրեք *խորությունը*',
        ru: 'Выберите *глубину*',
      },
      defaultCategory: 'seo',
      defaultDuration: 6,
      lockCategory: true,
      showAddons: true,
    },
    {
      type: 'faq',
      width: 'narrow',
      heading: {
        en: 'SEO *questions*',
        hy: 'SEO *հարցեր*',
        ru: 'Вопросы о *SEO*',
      },
      items: [
        {
          question: {
            en: 'Do I need a website first?',
            hy: 'Նախ կա՞յք է պետք',
            ru: 'Сначала нужен сайт?',
          },
          answer: {
            en: 'SEO works on a website you control. If you do not have one yet, we can build it and start SEO alongside — just tell us.',
            hy: 'SEO-ն աշխատում է ձեր վերահսկած կայքի վրա։ Եթե դեռ կայք չունեք, կարող ենք այն ստեղծել և SEO-ն սկսել զուգահեռ՝ պարզապես տեղեկացրեք մեզ։',
            ru: 'SEO работает на сайте, которым вы управляете. Если сайта ещё нет, мы можем сделать его и начать SEO параллельно — просто скажите.',
          },
        },
        {
          question: {
            en: 'Why is Fundamental not available for 9 or 12 months?',
            hy: 'Ինչո՞ւ Fundamental-ը հասանելի չէ 9 կամ 12 ամսով',
            ru: 'Почему Fundamental нельзя взять на 9 или 12 месяцев?',
          },
          answer: {
            en: 'Fundamental is a foundation package. After six months, growing further usually needs the content work in Vision or Authority.',
            hy: 'Fundamental-ը հիմքային փաթեթ է։ Վեց ամսից հետո հետագա աճի համար սովորաբար անհրաժեշտ է Vision-ի կամ Authority-ի բովանդակային աշխատանքը։',
            ru: 'Fundamental — базовый пакет. После шести месяцев для дальнейшего роста обычно нужна контентная работа Vision или Authority.',
          },
        },
        faq.noGuarantees,
        faq.contractLength,
      ],
    },
    contactSection({
      heading: { en: 'Talk to *Edgar*', hy: 'Խոսեք *Էդգարի* հետ', ru: 'Поговорите с *Эдгаром*' },
      service: 'seo',
    }),
  ],
}
