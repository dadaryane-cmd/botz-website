/**
 * Seed copy for pages, navigation, settings and the package guide.
 * Fresh agency copy — no client work, results, testimonials, credentials,
 * biographies, awards or addresses are invented.
 */
import type { L10n } from '@/i18n/config'

const L = (en: string, hy: string, ru: string): L10n => ({ en, hy, ru })
type Block = Record<string, unknown> & { blockType: string }

const btn = (label: L10n, path: string, appearance: 'primary' | 'secondary' | 'link' = 'primary') => ({ label, type: 'path', path, appearance })
const settings = (s: Record<string, unknown> = {}) => ({ background: 'default', align: 'start', width: 'normal', paddingTop: 'lg', paddingBottom: 'lg', ...s })

const T = {
  freeAudit: L('Get a free audit', 'Ստանալ անվճար աուդիտ', 'Получить бесплатный аудит'),
  explore: L('Explore packages', 'Դիտել փաթեթները', 'Смотреть пакеты'),
  discuss: L('Discuss my project', 'Քննարկել իմ նախագիծը', 'Обсудить мой проект'),
  pricing: L('See prices', 'Տեսնել գները', 'Посмотреть цены'),
}

const contactBlock = (service?: string, heading?: L10n): Block => ({
  blockType: 'contact',
  heading: heading ?? L("Let's talk about your *next step*", 'Խոսենք ձեր *հաջորդ քայլի* մասին', 'Обсудим ваш *следующий шаг*'),
  intro: L(
    'Social media questions go to Mariam; SEO and websites to Edgar. Write, call or send the form — whichever is easiest.',
    'Սոցցանցերի հարցերով դիմեք Մարիամին, SEO-ի և կայքերի հարցերով՝ Էդգարին։ Գրեք, զանգահարեք կամ ուղարկեք ձևը՝ ինչպես ձեզ հարմար է։',
    'Вопросы по соцсетям — к Мариам, по SEO и сайтам — к Эдгару. Пишите, звоните или отправьте форму — как удобнее.',
  ),
  showPeople: true,
  showForm: true,
  showDirect: true,
  defaultService: service,
  settings: settings({ anchor: 'contact', background: 'surface' }),
})

const ticker = [
  L('Social media', 'Սոցցանցեր', 'Соцсети'),
  L('Search optimisation', 'Որոնողական օպտիմալացում', 'Поисковая оптимизация'),
  L('Websites', 'Կայքեր', 'Сайты'),
  L('Content', 'Բովանդակություն', 'Контент'),
  L('Meta ads', 'Meta գովազդ', 'Реклама в Meta'),
  L('Reels', 'Reels', 'Reels'),
].map((text) => ({ text }))

/** Phrases written on the papers that tumble down through the home hero. */
export const burnWords = [
  L('Bad marketing', 'Վատ մարքեթինգ', 'Плохой маркетинг'),
  L('Zero results', 'Զրո արդյունք', 'Ноль результатов'),
  L('Random posts', 'Պատահական գրառումներ', 'Случайные посты'),
  L('Amateur work', 'Սիրողական աշխատանք', 'Любительская работа'),
  L('Wasted budget', 'Վատնված բյուջե', 'Слитый бюджет'),
  L('Missed deadlines', 'Խախտված ժամկետներ', 'Сорванные сроки'),
  L('Invisible on Google', 'Անտեսանելի Google-ում', 'Невидимы в Google'),
  L('Empty promises', 'Դատարկ խոստումներ', 'Пустые обещания'),
  L('Guesswork', 'Աչքաչափով որոշումներ', 'Работа наугад'),
  L('Ignored messages', 'Անպատասխան նամակներ', 'Сообщения без ответа'),
].map((text) => ({ text }))

/*
 * Trust sections for a new agency (no clients yet). Everything that needs a real fact from the
 * founders is a visible “[placeholder]” / “[X]” — nothing here is invented. Armenian and Russian: review wording.
 */
const P = L('[placeholder]', '[placeholder]', '[placeholder]')

const teamBlock: Block = {
  blockType: 'team',
  heading: L('Who’s behind *BOTZ*', 'Ովքեր են *BOTZ*-ի հետևում', 'Кто стоит за *BOTZ*'),
  intro: L(
    'Two founders, one for each discipline. You work with us directly — no account managers in between.',
    'Երկու հիմնադիր՝ յուրաքանչյուրն իր ոլորտում։ Դուք աշխատում եք անմիջապես մեզ հետ՝ առանց միջնորդ մենեջերների։',
    'Два основателя — по одному на каждое направление. Вы работаете напрямую с нами, без менеджеров-посредников.',
  ),
  founders: [
    {
      name: L('Mariam', 'Մարիամ', 'Мариам'),
      role: L('Social media marketing', 'Սոցիալական մեդիա մարքեթինգ', 'Маркетинг в соцсетях'),
      years: '[X]',
      bio: L(
        '[placeholder] Short bio: Mariam’s background, the kinds of brands she has worked on and how she approaches content.',
        '[placeholder] Կարճ կենսագրություն՝ Մարիամի փորձը, բրենդների տեսակները, որոնց հետ աշխատել է, և նրա մոտեցումը բովանդակությանը։',
        '[placeholder] Короткая биография: опыт Мариам, с какими брендами она работала и как подходит к контенту.',
      ),
      certifications: [{ text: P }],
    },
    {
      name: L('Edgar', 'Էդգար', 'Эдгар'),
      role: L('SEO & website creation', 'SEO և կայքերի ստեղծում', 'SEO и создание сайтов'),
      years: '[X]',
      bio: L(
        '[placeholder] Short bio: Edgar’s background in SEO and web development, and the kinds of sites he has built and optimised.',
        '[placeholder] Կարճ կենսագրություն՝ Էդգարի փորձը SEO-ում և վեբ մշակման մեջ, կայքերի տեսակները, որոնք ստեղծել և օպտիմալացրել է։',
        '[placeholder] Короткая биография: опыт Эдгара в SEO и веб-разработке, какие сайты он создавал и оптимизировал.',
      ),
      certifications: [{ text: P }],
    },
  ],
  pastWorkHeading: L('Earlier work (shown with permission)', 'Նախկին աշխատանքներ (ցուցադրվում են թույլտվությամբ)', 'Прежние работы (с разрешения)'),
  pastWork: [],
  settings: settings(),
}

const whyNewBlock: Block = {
  blockType: 'split',
  statement: L('Why work with a *new agency?*', 'Ինչու՞ աշխատել *նոր գործակալության* հետ', 'Почему стоит работать с *новым агентством?*'),
  body: L(
    'Being new means every client gets our full attention — and the people who sell the work are the people who do it.',
    'Նոր լինելը նշանակում է, որ յուրաքանչյուր հաճախորդ ստանում է մեր ամբողջ ուշադրությունը, իսկ աշխատանքը վաճառողները հենց այն կատարողներն են։',
    'Мы новые, поэтому каждый клиент получает всё наше внимание, а те, кто обсуждает с вами работу, её и выполняют.',
  ),
  points: [
    {
      title: L('Senior people on every project', 'Փորձառու մասնագետներ յուրաքանչյուր նախագծում', 'Опытные специалисты в каждом проекте'),
      text: L('The founders do the work themselves — no hand-offs to juniors.', 'Աշխատանքը կատարում են հիմնադիրներն իրենք՝ առանց սկսնակներին փոխանցելու։', 'Работу делают сами основатели — без передачи новичкам.'),
    },
    {
      title: L('You talk directly to the founders', 'Դուք խոսում եք անմիջապես հիմնադիրների հետ', 'Вы общаетесь напрямую с основателями'),
      text: L('Mariam for social media, Edgar for SEO and websites.', 'Մարիամը՝ սոցցանցերի, Էդգարը՝ SEO-ի և կայքերի համար։', 'Мариам — по соцсетям, Эдгар — по SEO и сайтам.'),
    },
    {
      title: L('Founding-client pricing', 'Առաջին հաճախորդների գներ', 'Цены для первых клиентов'),
      text: L(
        'Our first clients get a founding discount in exchange for a case study and an honest review.',
        'Մեր առաջին հաճախորդները ստանում են զեղչ՝ նախագծի նկարագրության և անկեղծ կարծիքի դիմաց։',
        'Первые клиенты получают скидку в обмен на кейс и честный отзыв.',
      ),
    },
  ],
  settings: settings({ background: 'surface' }),
}

const samplesBlock: Block = {
  blockType: 'samples',
  heading: L('See exactly *what you’ll get*', 'Տեսեք, թե *ինչ կստանաք*', 'Посмотрите, *что вы получите*'),
  intro: L(
    'The real formats of our deliverables, filled with illustrative data.',
    'Մեր աշխատանքների իրական ձևաչափերը՝ պայմանական տվյալներով։',
    'Реальные форматы наших материалов с условными данными.',
  ),
  items: [
    {
      title: L('SEO audit', 'SEO աուդիտ', 'SEO-аудит'),
      text: L('Technical issues, priorities and a clear action list.', 'Տեխնիկական խնդիրներ, առաջնահերթություններ և հստակ անելիքների ցանկ։', 'Технические проблемы, приоритеты и понятный список действий.'),
      filePath: '/samples/sample-seo-audit.pdf',
    },
    {
      title: L('Monthly report', 'Ամսական հաշվետվություն', 'Ежемесячный отчёт'),
      text: L('What we did, what changed and what comes next — in plain language.', 'Ինչ արեցինք, ինչ փոխվեց և ինչ է հաջորդը՝ պարզ լեզվով։', 'Что сделано, что изменилось и что дальше — простым языком.'),
      filePath: '/samples/sample-monthly-report.pdf',
    },
    {
      title: L('One-month SMM content plan', 'Մեկ ամսվա SMM բովանդակային պլան', 'Контент-план SMM на месяц'),
      text: L('Topics, formats and a posting calendar for one month.', 'Թեմաներ, ձևաչափեր և մեկ ամսվա հրապարակումների օրացույց։', 'Темы, форматы и календарь публикаций на месяц.'),
      filePath: '/samples/sample-smm-content-plan.pdf',
    },
  ],
  settings: settings({ anchor: 'samples' }),
}

/** Numbers that change (Website → Growth & offer). Placeholders until the founders fill them in. */
export const growthOffer = {
  offer: { enabled: true, spots: 5, months: 3, spotsLeft: 5, showSpotsLeft: false, showAudit: true, showTrial: true },
  growth: {
    metrics: [
      { channel: 'instagram', label: L('Followers', 'Հետևորդներ', 'Подписчики'), value: '[placeholder]' },
      { channel: 'instagram', label: L('Posts this month', 'Հրապարակումներ այս ամիս', 'Публикаций за месяц'), value: '[placeholder]' },
      { channel: 'website', label: L('Organic visitors / month', 'Օրգանիկ այցելուներ / ամիս', 'Органические посетители / мес.'), value: '[placeholder]' },
      { channel: 'website', label: L('Pages ranking on Google', 'Google-ում դիրքավորված էջեր', 'Страниц в выдаче Google'), value: '[placeholder]' },
    ],
  },
}

const faqGeneral = [
  {
    question: L('How do contract lengths affect the price?', 'Ինչպե՞ս է պայմանագրի ժամկետն ազդում գնի վրա', 'Как срок договора влияет на цену?'),
    answer: L(
      'Longer agreements lower the monthly fee. The pricing tool shows the monthly price, the total for the whole term and exactly how much you save compared with month-to-month.',
      'Ավելի երկար պայմանագրերի դեպքում ամսական վճարը նվազում է։ Գնային գործիքը ցույց է տալիս ամսական գինը, ամբողջ ժամկետի ընդհանուր գումարը և թե որքան եք խնայում ամսական վճարման համեմատ։',
      'Чем дольше договор, тем ниже ежемесячная оплата. Калькулятор показывает цену в месяц, сумму за весь срок и точную экономию по сравнению с помесячной оплатой.',
    ),
  },
  {
    question: L('Can I combine social media and SEO?', 'Կարո՞ղ եմ համատեղել սոցցանցերը և SEO-ն', 'Можно ли совместить SMM и SEO?'),
    answer: L(
      'Yes. Business Boost and Ultra combine both in one coordinated plan with their own bundle price — not the sum of the separate packages.',
      'Այո։ Business Boost-ը և Ultra-ն միավորում են երկուսը մեկ համակարգված փաթեթում՝ իրենց առանձին գնով, ոչ թե առանձին փաթեթների գումարով։',
      'Да. Business Boost и Ultra объединяют оба направления в одном плане по собственной цене — это не сумма отдельных пакетов.',
    ),
  },
  {
    question: L('Is the online estimate a contract?', 'Առցանց նախահաշիվը պայմանագի՞ր է', 'Онлайн-расчёт — это договор?'),
    answer: L(
      'No. It helps you request a proposal. We confirm the scope with you first, and nothing is charged through the website.',
      'Ոչ։ Այն օգնում է ստանալ առաջարկ։ Նախ ծավալը համաձայնեցնում ենք ձեզ հետ, և կայքի միջոցով ոչինչ չի գանձվում։',
      'Нет. Он помогает запросить предложение. Сначала мы согласуем с вами объём, а через сайт ничего не оплачивается.',
    ),
    openByDefault: true,
  },
  {
    question: L('Do you guarantee results?', 'Երաշխավորո՞ւմ եք արդյունքները', 'Вы гарантируете результат?'),
    answer: L(
      'We commit to the work, its quality and clear reporting. Results depend on your market, competition, budget and implementation, so we never promise rankings, sales or follower numbers.',
      'Մենք պատասխանատու ենք աշխատանքի, դրա որակի և հստակ հաշվետվության համար։ Արդյունքները կախված են ձեր շուկայից, մրցակցությունից, բյուջեից և իրականացումից, ուստի մենք չենք խոստանում դիրքեր, վաճառք կամ հետևորդների թիվ։',
      'Мы отвечаем за работу, её качество и прозрачную отчётность. Результат зависит от рынка, конкуренции, бюджета и внедрения, поэтому мы не обещаем позиции, продажи или число подписчиков.',
    ),
    openByDefault: true,
  },
  {
    question: L('Who will I be working with?', 'Ու՞մ հետ եմ աշխատելու', 'С кем я буду работать?'),
    answer: L(
      'Mariam leads social media, Edgar leads SEO and website projects. On combined plans they coordinate together, and you agree one main contact.',
      'Մարիամը ղեկավարում է սոցցանցերի ուղղությունը, Էդգարը՝ SEO-ն և կայքերը։ Համակցված փաթեթներում նրանք աշխատում են համատեղ, և դուք համաձայնեցնում եք մեկ հիմնական կոնտակտ։',
      'Мариам ведёт соцсети, Эдгар — SEO и сайты. В комплексных планах они работают вместе, а вы выбираете один основной контакт.',
    ),
    openByDefault: true,
  },
]

const processBlock: Block = {
  blockType: 'process',
  heading: L('Four steps, *no guesswork*', 'Չորս քայլ՝ *առանց ենթադրությունների*', 'Четыре шага *без догадок*'),
  steps: [
    {
      title: L('Brief', 'Բրիֆ', 'Бриф'),
      text: L('We learn your business, audience and goals, and look at what you already have.', 'Ծանոթանում ենք ձեր բիզնեսին, լսարանին և նպատակներին, ուսումնասիրում ենք այն, ինչ արդեն ունեք։', 'Изучаем ваш бизнес, аудиторию и цели, смотрим, что у вас уже есть.'),
    },
    {
      title: L('Proposal', 'Առաջարկ', 'Предложение'),
      text: L('You get a clear scope and price — what is included, what is not, and for how long.', 'Ստանում եք հստակ ծավալ և գին՝ ինչն է ներառված, ինչը՝ ոչ, և որքան ժամանակով։', 'Вы получаете понятный объём и цену — что входит, что нет и на какой срок.'),
    },
    {
      title: L('Launch', 'Մեկնարկ', 'Запуск'),
      text: L('We set up, create and publish, with your approval at every important point.', 'Կարգավորում ենք, ստեղծում և հրապարակում՝ ձեր հաստատմամբ բոլոր կարևոր փուլերում։', 'Настраиваем, создаём и публикуем — с вашим согласованием на каждом важном этапе.'),
    },
    {
      title: L('Report & refine', 'Հաշվետվություն և բարելավում', 'Отчёт и улучшения'),
      text: L('Regular reports show what happened and what we will do next.', 'Կանոնավոր հաշվետվությունները ցույց են տալիս, թե ինչ արվեց և ինչ ենք անելու հետո։', 'Регулярные отчёты показывают, что сделано и что мы будем делать дальше.'),
    },
  ],
  settings: settings(),
}

const guideBlock: Block = {
  blockType: 'guide',
  heading: L('Not sure where to start? *Answer six questions.*', 'Չգիտե՞ք որտեղից սկսել։ *Պատասխանեք վեց հարցի։*', 'Не знаете, с чего начать? *Ответьте на шесть вопросов.*'),
  intro: L(
    'We will suggest a package, explain why, and show the real cost for the term you choose.',
    'Կառաջարկենք փաթեթ, կբացատրենք ինչու և ցույց կտանք իրական արժեքը ձեր ընտրած ժամկետի համար։',
    'Мы предложим пакет, объясним почему и покажем реальную стоимость на выбранный срок.',
  ),
  settings: settings({ anchor: 'guide', background: 'inverse' }),
}

const servicesItems = [
  {
    title: L('Social media marketing', 'Սոցիալական մեդիա մարքեթինգ', 'Маркетинг в соцсетях'),
    service: 'smm',
    index: '01',
    text: L(
      'Instagram, Facebook and TikTok content planned around your goals — designed, written, scheduled and measured.',
      'Instagram-ի, Facebook-ի և TikTok-ի բովանդակություն՝ պլանավորված ձեր նպատակների շուրջ․ ձևավորված, գրված, պլանավորված և չափված։',
      'Контент для Instagram, Facebook и TikTok вокруг ваших целей — с дизайном, текстами, расписанием и аналитикой.',
    ),
    highlights: [L('Content & stories', 'Հրապարակումներ և սթորիներ', 'Посты и сторис'), L('Shoots & video', 'Նկարահանումներ և տեսանյութեր', 'Съёмки и видео'), L('Meta ads', 'Meta գովազդ', 'Реклама в Meta')].map((text) => ({ text })),
    link: { label: L('Explore SMM', 'Դիտել SMM-ը', 'Подробнее об SMM'), type: 'path', path: '/smm', appearance: 'link' },
  },
  {
    title: L('Search engine optimisation', 'Որոնողական օպտիմալացում', 'Поисковая оптимизация'),
    service: 'seo',
    index: '02',
    text: L(
      'Technical fixes, content and authority work that help the right people find you on Google.',
      'Տեխնիկական շտկումներ, բովանդակություն և հեղինակության ամրապնդում, որոնք օգնում են ճիշտ մարդկանց գտնել ձեզ Google-ում։',
      'Технические улучшения, контент и работа над авторитетом, чтобы нужные люди находили вас в Google.',
    ),
    highlights: [L('Technical SEO', 'Տեխնիկական SEO', 'Техническое SEO'), L('Articles', 'Հոդվածներ', 'Статьи'), L('Clear reporting', 'Հստակ հաշվետվություն', 'Понятные отчёты')].map((text) => ({ text })),
    link: { label: L('Explore SEO', 'Դիտել SEO-ն', 'Подробнее об SEO'), type: 'path', path: '/seo', appearance: 'link' },
  },
  {
    title: L('Website creation', 'Կայքի ստեղծում', 'Создание сайтов'),
    service: 'website',
    index: '03',
    text: L(
      'A clear, fast, responsive website for your business, launched with a basic SEO setup.',
      'Հստակ, արագ և ադապտիվ կայք ձեր բիզնեսի համար՝ գործարկված հիմնական SEO կարգավորումով։',
      'Понятный, быстрый, адаптивный сайт для вашего бизнеса с базовой SEO-настройкой.',
    ),
    highlights: [L('Responsive design', 'Ադապտիվ դիզայն', 'Адаптивный дизайн'), L('Basic SEO setup', 'Հիմնական SEO կարգավորում', 'Базовая SEO-настройка')].map((text) => ({ text })),
    link: { label: L('Explore websites', 'Դիտել կայքերը', 'Подробнее о сайтах'), type: 'path', path: '/website-creation', appearance: 'link' },
  },
  {
    title: L('SMM + SEO plans', 'SMM + SEO փաթեթներ', 'Планы SMM + SEO'),
    service: 'bundle',
    index: '04',
    text: L(
      'One coordinated plan for social and search, with one team behind both.',
      'Մեկ համակարգված փաթեթ սոցցանցերի և որոնման համար՝ մեկ թիմով։',
      'Один согласованный план для соцсетей и поиска — одна команда на оба направления.',
    ),
    highlights: [L('Business Boost', 'Business Boost', 'Business Boost'), L('Ultra', 'Ultra', 'Ultra')].map((text) => ({ text })),
    link: { label: L('Compare plans', 'Համեմատել փաթեթները', 'Сравнить планы'), type: 'path', path: '/pricing', appearance: 'link' },
  },
]

const serviceHero = (_label: L10n, heading: L10n, sub: L10n, contactLabel: L10n) => ({
  blockType: 'hero',
  variant: 'title',
  heading,
  subheading: sub,
  buttons: [btn(T.pricing, '#pricing'), btn(contactLabel, '#contact', 'secondary')],
  settings: settings({ paddingTop: 'xl' }),
})

export const pages: { seedKey: string; slug: string; pageType: string; title: L10n; meta: { title: L10n; description: L10n }; layout: Block[] }[] = [
  {
    seedKey: 'home',
    slug: '',
    pageType: 'home',
    title: L('Home', 'Գլխավոր', 'Главная'),
    meta: {
      title: L('BOTZ — Social media, SEO and websites', 'BOTZ — Սոցցանցեր, SEO և կայքեր', 'BOTZ — Соцсети, SEO и сайты'),
      description: L(
        'BOTZ Marketing Agency runs social media, search optimisation and websites with clear packages and transparent prices. Explore packages or discuss your project.',
        'BOTZ մարքեթինգային գործակալությունը վարում է սոցցանցեր, որոնողական օպտիմալացում և կայքեր՝ հստակ փաթեթներով և թափանցիկ գներով։',
        'Маркетинговое агентство BOTZ: соцсети, поисковая оптимизация и сайты — с понятными пакетами и прозрачными ценами.',
      ),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'flame',
        heading: L('Make your brand *impossible to scroll past.*', 'Դարձրեք ձեր բրենդը *անհնար անտեսել։*', 'Бренд, который *невозможно пролистать.*'),
        subheading: L(
          'BOTZ runs social media, search optimisation and websites for growing businesses — with clear packages, prices in the open and two people you can actually talk to.',
          'BOTZ-ը վարում է սոցցանցեր, որոնողական օպտիմալացում և կայքեր աճող բիզնեսների համար՝ հստակ փաթեթներով, բաց գներով և երկու մարդով, որոնց հետ կարող եք իսկապես խոսել։',
          'BOTZ ведёт соцсети, поисковую оптимизацию и сайты растущих компаний — с понятными пакетами, открытыми ценами и двумя людьми, с которыми действительно можно поговорить.',
        ),
        buttons: [btn(T.freeAudit, '#contact'), btn(T.explore, '/pricing', 'secondary')],
        proofLine: L(
          'Founders with [X]+ years in SEO and social media',
          'Հիմնադիրներ՝ SEO-ի և սոցցանցերի [X]+ տարվա փորձով',
          'Основатели с опытом [X]+ лет в SEO и соцсетях',
        ),
        sideCard: 'offer',
        tickerItems: ticker,
        burnWords,
        settings: settings({ paddingTop: 'md', paddingBottom: 'md', width: 'wide' }),
      },
      {
        blockType: 'split',
        statement: L(
          'One team for the work that brings people to you: *social, search and site.*',
          'Մեկ թիմ այն աշխատանքի համար, որը մարդկանց բերում է ձեզ մոտ՝ *սոցցանցեր, որոնում և կայք։*',
          'Одна команда для всего, что приводит к вам людей: *соцсети, поиск и сайт.*',
        ),
        body: L(
          'BOTZ is a marketing agency built around a simple idea: you should know exactly what you are paying for. Every package has a defined scope, every price is public, and results are reported regularly in plain language.',
          'BOTZ-ը մարքեթինգային գործակալություն է՝ կառուցված պարզ գաղափարի շուրջ․ դուք պետք է հստակ իմանաք, թե ինչի համար եք վճարում։ Յուրաքանչյուր փաթեթ ունի որոշված ծավալ, յուրաքանչյուր գին հրապարակային է, իսկ արդյունքները կանոնավոր ներկայացվում են պարզ լեզվով։',
          'BOTZ — маркетинговое агентство, построенное на простой идее: вы должны точно знать, за что платите. У каждого пакета есть определённый объём, все цены открыты, а результаты регулярно описываются простым языком.',
        ),
        points: [
          {
            title: L('Defined scope', 'Որոշված ծավալ', 'Чёткий объём'),
            text: L('Quantities and boundaries are written down — no vague promises.', 'Քանակներն ու սահմանները գրավոր են՝ առանց անորոշ խոստումների։', 'Объёмы и границы зафиксированы — без размытых обещаний.'),
          },
          {
            title: L('Prices in the open', 'Բաց գներ', 'Открытые цены'),
            text: L('See the monthly fee, the full-term total and your savings before you call.', 'Տեսեք ամսական վճարը, ամբողջ ժամկետի գումարը և խնայողությունը՝ նախքան զանգելը։', 'Цена в месяц, сумма за срок и экономия видны ещё до звонка.'),
          },
          {
            title: L('Direct contacts', 'Ուղիղ կապ', 'Прямой контакт'),
            text: L('Mariam for social media, Edgar for SEO and websites.', 'Մարիամը՝ սոցցանցերի, Էդգարը՝ SEO-ի և կայքերի համար։', 'Мариам — по соцсетям, Эдгар — по SEO и сайтам.'),
          },
        ],
        settings: settings(),
      },
      {
        blockType: 'services',
        heading: L('What we *do*', 'Ինչ ենք *անում*', 'Что мы *делаем*'),
        items: servicesItems,
        settings: settings({ background: 'surface' }),
      },
      teamBlock,
      whyNewBlock,
      samplesBlock,
      guideBlock,
      {
        blockType: 'packagePreview',
        heading: L('Packages, *priced in the open*', 'Փաթեթներ՝ *բաց գներով*', 'Пакеты *с открытыми ценами*'),
        intro: L(
          'Monthly prices for a 12-month agreement. Shorter terms are available — compare them in the pricing tool.',
          'Ամսական գներ 12 ամսվա պայմանագրի դեպքում։ Հասանելի են նաև ավելի կարճ ժամկետներ՝ համեմատեք դրանք գնային գործիքում։',
          'Цены в месяц при договоре на 12 месяцев. Есть и более короткие сроки — сравните их в калькуляторе.',
        ),
        categories: ['smm', 'seo', 'bundle', 'website'],
        duration: '12',
        link: { label: T.explore, type: 'path', path: '/pricing', appearance: 'primary' },
        showGuideLink: true,
        settings: settings(),
      },
      processBlock,
      {
        blockType: 'faq',
        heading: L('Good *questions*', 'Լավ *հարցեր*', 'Хорошие *вопросы*'),
        items: faqGeneral,
        structuredData: true,
        settings: settings({ width: 'narrow' }),
      },
      {
        blockType: 'collectionList',
        heading: L('Selected *work*', 'Ընտրված *աշխատանքներ*', 'Избранные *работы*'),
        source: 'caseStudies',
        limit: 6,
        settings: settings(),
      },
      {
        blockType: 'collectionList',
        heading: L('What clients *say*', 'Ինչ են ասում *հաճախորդները*', 'Что говорят *клиенты*'),
        source: 'testimonials',
        limit: 6,
        settings: settings(),
      },
      contactBlock(),
    ],
  },
  {
    seedKey: 'services',
    slug: 'services',
    pageType: 'services',
    title: L('Services', 'Ծառայություններ', 'Услуги'),
    meta: {
      title: L('Services — SMM, SEO and website creation', 'Ծառայություններ — SMM, SEO և կայքերի ստեղծում', 'Услуги — SMM, SEO и создание сайтов'),
      description: L(
        'Social media marketing, search engine optimisation, website creation and combined SMM + SEO plans from BOTZ Marketing Agency.',
        'Սոցիալական մեդիա մարքեթինգ, որոնողական օպտիմալացում, կայքերի ստեղծում և համակցված SMM + SEO փաթեթներ BOTZ-ից։',
        'Маркетинг в соцсетях, поисковая оптимизация, создание сайтов и комплексные планы SMM + SEO от BOTZ.',
      ),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'title',
        heading: L('Everything people see *before they choose you.*', 'Այն ամենը, ինչ մարդիկ տեսնում են *նախքան ձեզ ընտրելը։*', 'Всё, что люди видят, *прежде чем выбрать вас.*'),
        subheading: L(
          'Pick one service or combine them. Each has a clear scope, a public price and a person responsible for it.',
          'Ընտրեք մեկ ծառայություն կամ համատեղեք դրանք։ Յուրաքանչյուրն ունի հստակ ծավալ, հրապարակային գին և պատասխանատու մարդ։',
          'Выберите одну услугу или объедините несколько. У каждой — чёткий объём, открытая цена и ответственный человек.',
        ),
        buttons: [btn(T.explore, '/pricing'), btn(T.discuss, '#contact', 'secondary')],
        settings: settings({ paddingTop: 'xl' }),
      },
      { blockType: 'services', items: servicesItems, settings: settings({ paddingTop: 'sm' }) },
      processBlock,
      guideBlock,
      contactBlock(),
    ],
  },
  {
    seedKey: 'smm',
    slug: 'smm',
    pageType: 'smm',
    title: L('Social media marketing', 'Սոցիալական մեդիա մարքեթինգ', 'Маркетинг в соцсетях'),
    meta: {
      title: L('Social media marketing packages', 'Սոցիալական մեդիա մարքեթինգի փաթեթներ', 'Пакеты SMM'),
      description: L(
        'SMM packages Start, Dominance and Gold: content, stories, production and Meta ads, with monthly reports. Compare prices for 1–12 months.',
        'SMM փաթեթներ Start, Dominance և Gold՝ բովանդակություն, սթորիներ, նկարահանումներ և Meta գովազդ՝ ամսական հաշվետվություններով։',
        'Пакеты SMM Start, Dominance и Gold: контент, сторис, продакшн и реклама в Meta с ежемесячными отчётами.',
      ),
    },
    layout: [
      serviceHero(
        L('Social media marketing', 'Սոցիալական մեդիա մարքեթինգ', 'Маркетинг в соцсетях'),
        L('Social media people *stop scrolling for.*', 'Սոցցանցեր, որոնց համար մարդիկ *դադարում են թերթել։*', 'Соцсети, ради которых *перестают листать.*'),
        L(
          'Planned content, strong visuals and steady publishing on Instagram, Facebook and TikTok — with reports that show what worked.',
          'Պլանավորված բովանդակություն, ուժեղ վիզուալներ և կայուն հրապարակումներ Instagram-ում, Facebook-ում և TikTok-ում՝ հաշվետվություններով, որոնք ցույց են տալիս, թե ինչն աշխատեց։',
          'Продуманный контент, сильные визуалы и стабильные публикации в Instagram, Facebook и TikTok — с отчётами о том, что сработало.',
        ),
        L('Contact Mariam', 'Կապվել Մարիամի հետ', 'Написать Мариам'),
      ),
      {
        blockType: 'split',
        statement: L('Consistency beats *bursts.*', 'Կայունությունը հաղթում է *պոռթկումներին։*', 'Постоянство сильнее *всплесков.*'),
        body: L(
          'Audiences trust brands that show up regularly with something worth seeing. Our SMM packages give you a dependable rhythm of content, a plan behind it, and regular numbers to steer by.',
          'Լսարանը վստահում է այն բրենդներին, որոնք կանոնավոր հանդես են գալիս արժեքավոր բովանդակությամբ։ Մեր SMM փաթեթները տալիս են բովանդակության կայուն ռիթմ, դրա հետևում կանգնած պլան և կանոնավոր թվեր՝ ուղղություն պահելու համար։',
          'Аудитория доверяет брендам, которые регулярно показывают что-то стоящее. Наши SMM-пакеты дают стабильный ритм контента, план за ним и регулярные цифры для управления.',
        ),
        settings: settings({ paddingTop: 'md' }),
      },
      {
        blockType: 'pricing',
        heading: L('Choose your *rhythm*', 'Ընտրեք ձեր *ռիթմը*', 'Выберите свой *ритм*'),
        defaultCategory: 'smm',
        defaultDuration: '6',
        lockCategory: true,
        showAddons: true,
        showComparison: true,
        showTerms: true,
        settings: settings({ anchor: 'pricing', background: 'surface' }),
      },
      {
        blockType: 'faq',
        heading: L('SMM *questions*', 'SMM *հարցեր*', 'Вопросы о *SMM*'),
        items: [
          {
            question: L('Which platforms do you manage?', 'Ո՞ր հարթակներն եք վարում', 'Какие платформы вы ведёте?'),
            answer: L('We work with Instagram, Facebook and TikTok. The platforms included in each package are listed in its scope; ask us if you need another one.', 'Աշխատում ենք Instagram-ի, Facebook-ի և TikTok-ի հետ։ Յուրաքանչյուր փաթեթում ներառված հարթակները նշված են դրա ծավալում․ եթե այլ հարթակ է պետք, գրեք մեզ։', 'Мы работаем с Instagram, Facebook и TikTok. Платформы каждого пакета указаны в его объёме; если нужна другая — напишите нам.'),
          },
          {
            question: L('Can I add extra videos?', 'Կարո՞ղ եմ ավելացնել լրացուցիչ տեսանյութեր', 'Можно добавить видео?'),
            answer: L('Yes — Reels with full equipment are available as add-ons, individually or as a bundle of four.', 'Այո, ամբողջական սարքավորումով Reels-ը հասանելի է որպես լրացուցիչ ծառայություն՝ առանձին կամ չորսի փաթեթով։', 'Да — Reels с полным оборудованием доступны как дополнение, по одному или набором из четырёх.'),
          },
          faqGeneral[0],
        ],
        settings: settings({ width: 'narrow' }),
      },
      contactBlock('smm', L('Talk to *Mariam*', 'Խոսեք *Մարիամի* հետ', 'Поговорите с *Мариам*')),
    ],
  },
  {
    seedKey: 'seo',
    slug: 'seo',
    pageType: 'seo',
    title: L('Search engine optimisation', 'Որոնողական օպտիմալացում', 'Поисковая оптимизация'),
    meta: {
      title: L('SEO packages — Fundamental, Vision, Authority', 'SEO փաթեթներ — Fundamental, Vision, Authority', 'SEO-пакеты — Fundamental, Vision, Authority'),
      description: L(
        'SEO packages with technical audits, page optimisation, articles and outreach. Compare monthly prices, totals and savings for 1–12 months.',
        'SEO փաթեթներ՝ տեխնիկական աուդիտով, էջերի օպտիմալացմամբ, հոդվածներով և PR-ով։ Համեմատեք ամսական գները, ընդհանուր գումարները և խնայողությունը։',
        'SEO-пакеты: технический аудит, оптимизация страниц, статьи и аутрич. Сравните цены, итоги и экономию на 1–12 месяцев.',
      ),
    },
    layout: [
      serviceHero(
        L('Search engine optimisation', 'Որոնողական օպտիմալացում', 'Поисковая оптимизация'),
        L('Be found by people *already looking for you.*', 'Թող ձեզ գտնեն նրանք, *ովքեր արդեն փնտրում են։*', 'Пусть вас найдут те, *кто уже ищет.*'),
        L(
          'Technical foundations, useful content and steady authority building — measured every month, explained in plain language.',
          'Տեխնիկական հիմք, օգտակար բովանդակություն և հեղինակության կայուն աճ՝ չափվող ամեն ամիս և բացատրվող պարզ լեզվով։',
          'Технический фундамент, полезный контент и стабильный рост авторитета — с ежемесячными замерами и объяснениями простым языком.',
        ),
        L('Contact Edgar', 'Կապվել Էդգարի հետ', 'Написать Эдгару'),
      ),
      {
        blockType: 'split',
        statement: L('Search is *compound interest* for your brand.', 'Որոնումը ձեր բրենդի *բարդ տոկոսն* է։', 'Поиск — это *сложный процент* для бренда.'),
        body: L(
          'SEO builds slowly and keeps working. We start with what stops search engines from understanding your site, then grow the pages and content that answer what your customers ask.',
          'SEO-ն կառուցվում է դանդաղ, բայց շարունակում է աշխատել։ Սկսում ենք նրանից, ինչը խանգարում է որոնողական համակարգերին հասկանալ ձեր կայքը, ապա զարգացնում ենք էջերն ու բովանդակությունը, որոնք պատասխանում են ձեր հաճախորդների հարցերին։',
          'SEO растёт медленно, но продолжает работать. Мы начинаем с того, что мешает поисковикам понять ваш сайт, а затем развиваем страницы и контент, отвечающие на вопросы клиентов.',
        ),
        settings: settings({ paddingTop: 'md' }),
      },
      {
        blockType: 'pricing',
        heading: L('Pick your *depth*', 'Ընտրեք *խորությունը*', 'Выберите *глубину*'),
        defaultCategory: 'seo',
        defaultDuration: '6',
        lockCategory: true,
        showAddons: true,
        showComparison: true,
        showTerms: true,
        settings: settings({ anchor: 'pricing', background: 'surface' }),
      },
      {
        blockType: 'faq',
        heading: L('SEO *questions*', 'SEO *հարցեր*', 'Вопросы о *SEO*'),
        items: [
          {
            question: L('Do I need a website first?', 'Նախ կա՞յք է պետք', 'Сначала нужен сайт?'),
            answer: L('SEO works on a website you control. If you do not have one yet, we can build it and start SEO alongside — just tell us.', 'SEO-ն աշխատում է ձեր վերահսկած կայքի վրա։ Եթե դեռ կայք չունեք, կարող ենք այն ստեղծել և SEO-ն սկսել զուգահեռ՝ պարզապես տեղեկացրեք մեզ։', 'SEO работает на сайте, которым вы управляете. Если сайта ещё нет, мы можем сделать его и начать SEO параллельно — просто скажите.'),
          },
          {
            question: L('Why is Fundamental not available for 9 or 12 months?', 'Ինչո՞ւ Fundamental-ը հասանելի չէ 9 կամ 12 ամսով', 'Почему Fundamental нельзя взять на 9 или 12 месяцев?'),
            answer: L('Fundamental is a foundation package. After six months, growing further usually needs the content work in Vision or Authority.', 'Fundamental-ը հիմքային փաթեթ է։ Վեց ամսից հետո հետագա աճի համար սովորաբար անհրաժեշտ է Vision-ի կամ Authority-ի բովանդակային աշխատանքը։', 'Fundamental — базовый пакет. После шести месяцев для дальнейшего роста обычно нужна контентная работа Vision или Authority.'),
          },
          faqGeneral[3],
          faqGeneral[0],
        ],
        settings: settings({ width: 'narrow' }),
      },
      contactBlock('seo', L('Talk to *Edgar*', 'Խոսեք *Էդգարի* հետ', 'Поговорите с *Эдгаром*')),
    ],
  },
  {
    seedKey: 'website',
    slug: 'website-creation',
    pageType: 'website',
    title: L('Website creation', 'Կայքի ստեղծում', 'Создание сайта'),
    meta: {
      title: L('Website creation with basic SEO setup', 'Կայքի ստեղծում հիմնական SEO կարգավորումով', 'Создание сайта с базовой SEO-настройкой'),
      description: L(
        'A responsive small-business website launched with a basic SEO setup. One-time price, with optional extra landing pages.',
        'Ադապտիվ կայք փոքր բիզնեսի համար՝ հիմնական SEO կարգավորումով։ Միանվագ գին։',
        'Адаптивный сайт для малого бизнеса с базовым SEO. Единоразовая цена.',
      ),
    },
    layout: [
      serviceHero(
        L('Website creation', 'Կայքի ստեղծում', 'Создание сайта'),
        L('A website that *works as hard as you do.*', 'Կայք, որն աշխատում է *ձեզ պես եռանդուն։*', 'Сайт, который работает *так же усердно, как вы.*'),
        L(
          'Clear structure and fast pages, launched with the basics search engines need.',
          'Հստակ կառուցվածք և արագ էջեր՝ գործարկված այն հիմքով, որն անհրաժեշտ է որոնողական համակարգերին։',
          'Понятная структура и быстрые страницы — с базой, нужной поисковикам.',
        ),
        L('Contact Edgar', 'Կապվել Էդգարի հետ', 'Написать Эдгару'),
      ),
      {
        blockType: 'pricing',
        heading: L('One price, *clear scope*', 'Մեկ գին՝ *հստակ ծավալով*', 'Одна цена — *понятный объём*'),
        defaultCategory: 'website',
        defaultDuration: '1',
        lockCategory: true,
        showAddons: true,
        showComparison: false,
        showTerms: true,
        settings: settings({ anchor: 'pricing', background: 'surface' }),
      },
      processBlock,
      contactBlock('website', L('Plan your *website*', 'Պլանավորեք ձեր *կայքը*', 'Спланируйте *сайт*')),
    ],
  },
  {
    seedKey: 'pricing',
    slug: 'pricing',
    pageType: 'pricing',
    title: L('Pricing', 'Գներ', 'Цены'),
    meta: {
      title: L('Interactive pricing — SMM, SEO and websites', 'Ինտերակտիվ գներ — SMM, SEO և կայքեր', 'Интерактивные цены — SMM, SEO и сайты'),
      description: L(
        'Choose a package and contract length to see the monthly price, the total and your savings. Add extras, compare packages and request a proposal.',
        'Ընտրեք փաթեթ և ժամկետ՝ տեսնելու ամսական գինը, ընդհանուր գումարը և խնայողությունը։ Ավելացրեք լրացուցիչ ծառայություններ, համեմատեք և ստացեք առաջարկ։',
        'Выберите пакет и срок, чтобы увидеть цену в месяц, итог и экономию. Добавьте опции, сравните пакеты и запросите предложение.',
      ),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'title',
        heading: L('Work longer, *pay less per month.*', 'Աշխատեք ավելի երկար, *վճարեք ավելի քիչ ամսական։*', 'Дольше работаем — *меньше платите в месяц.*'),
        subheading: L(
          'Pick a service and a term. Prices, totals and savings update instantly — then send the estimate with your inquiry or share it.',
          'Ընտրեք ծառայություն և ժամկետ։ Գները, ընդհանուր գումարը և խնայողությունը թարմացվում են անմիջապես․ հետո ուղարկեք նախահաշիվը հարցման հետ կամ կիսվեք դրանով։',
          'Выберите услугу и срок. Цены, итог и экономия обновляются сразу — затем отправьте расчёт с заявкой или поделитесь им.',
        ),
        buttons: [btn(L('Find my package', 'Գտնել իմ փաթեթը', 'Подобрать пакет'), '#guide', 'secondary')],
        settings: settings({ paddingTop: 'xl', paddingBottom: 'sm' }),
      },
      {
        blockType: 'pricing',
        defaultCategory: 'smm',
        defaultDuration: '6',
        lockCategory: false,
        showAddons: true,
        showComparison: true,
        showTerms: true,
        settings: settings({ anchor: 'pricing', paddingTop: 'sm' }),
      },
      guideBlock,
      { blockType: 'faq', heading: L('Pricing *questions*', 'Գների մասին *հարցեր*', 'Вопросы о *ценах*'), items: [faqGeneral[0], faqGeneral[1], faqGeneral[2], faqGeneral[3]], settings: settings({ width: 'narrow' }) },
      contactBlock(),
    ],
  },
  {
    seedKey: 'about',
    slug: 'about',
    pageType: 'about',
    title: L('About', 'Մեր մասին', 'О нас'),
    meta: {
      title: L('About BOTZ Marketing Agency', 'BOTZ մարքեթինգային գործակալության մասին', 'О маркетинговом агентстве BOTZ'),
      description: L(
        'BOTZ is a marketing agency for social media, SEO and websites, built on defined scopes, public prices and direct contact.',
        'BOTZ-ը մարքեթինգային գործակալություն է սոցցանցերի, SEO-ի և կայքերի համար՝ հիմնված հստակ ծավալի, բաց գների և ուղիղ կապի վրա։',
        'BOTZ — маркетинговое агентство по соцсетям, SEO и сайтам: чёткий объём, открытые цены и прямой контакт.',
      ),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'title',
        heading: L('Small team. *Clear promises.* Real work.', 'Փոքր թիմ։ *Հստակ խոստումներ։* Իրական աշխատանք։', 'Небольшая команда. *Чёткие обещания.* Настоящая работа.'),
        subheading: L(
          'We started BOTZ to make marketing services easier to understand and easier to trust.',
          'Մենք ստեղծեցինք BOTZ-ը, որպեսզի մարքեթինգային ծառայություններն ավելի հասկանալի և վստահելի դարձնենք։',
          'Мы создали BOTZ, чтобы маркетинговые услуги стали понятнее и вызывали больше доверия.',
        ),
        buttons: [btn(T.discuss, '#contact')],
        settings: settings({ paddingTop: 'xl' }),
      },
      {
        blockType: 'split',
        statement: L('Good marketing should be *easy to buy* and *easy to measure.*', 'Լավ մարքեթինգը պետք է լինի *հեշտ ձեռք բերվող* և *հեշտ չափելի։*', 'Хороший маркетинг должно быть *легко купить* и *легко измерить.*'),
        body: L(
          'Too often, agencies sell vague packages and hide the details. We do the opposite: every package lists what is included and what is not, prices are public, and results are reported in plain language.',
          'Հաճախ գործակալությունները վաճառում են անորոշ փաթեթներ և թաքցնում մանրամասները։ Մենք անում ենք հակառակը․ յուրաքանչյուր փաթեթում նշված է, թե ինչն է ներառված և ինչը՝ ոչ, գները հրապարակային են, իսկ արդյունքները ներկայացվում են պարզ լեզվով։',
          'Слишком часто агентства продают размытые пакеты и скрывают детали. Мы делаем наоборот: в каждом пакете указано, что входит и что нет, цены открыты, а результаты описаны простым языком.',
        ),
        points: [
          { title: L('Mariam', 'Մարիամ', 'Мариам'), text: L('Leads social media marketing.', 'Ղեկավարում է սոցիալական մեդիա մարքեթինգը։', 'Руководит направлением SMM.') },
          { title: L('Edgar', 'Էդգար', 'Эдгар'), text: L('Leads SEO and website creation.', 'Ղեկավարում է SEO-ն և կայքերի ստեղծումը։', 'Руководит SEO и созданием сайтов.') },
        ],
        settings: settings(),
      },
      processBlock,
      {
        blockType: 'cta',
        heading: L('Have a project in mind? *Let’s hear it.*', 'Նախագիծ ունե՞ք։ *Պատմեք մեզ։*', 'Есть идея проекта? *Расскажите.*'),
        text: L('Tell us where you are now and where you want to be.', 'Պատմեք, թե որտեղ եք հիմա և ուր եք ուզում հասնել։', 'Расскажите, где вы сейчас и куда хотите прийти.'),
        buttons: [btn(T.discuss, '/contact'), btn(T.explore, '/pricing', 'secondary')],
        settings: settings({ background: 'accent' }),
      },
    ],
  },
  {
    seedKey: 'contact',
    slug: 'contact',
    pageType: 'contact',
    title: L('Contact', 'Կապ', 'Контакты'),
    meta: {
      title: L('Contact BOTZ — Mariam and Edgar', 'Կապ BOTZ-ի հետ — Մարիամ և Էդգար', 'Контакты BOTZ — Мариам и Эдгар'),
      description: L(
        'Call, WhatsApp or email BOTZ Marketing Agency, or send an inquiry. Mariam handles social media, Edgar handles SEO and websites.',
        'Զանգահարեք, գրեք WhatsApp-ով կամ էլ. փոստով, կամ ուղարկեք հարցում։ Մարիամը՝ սոցցանցեր, Էդգարը՝ SEO և կայքեր։',
        'Позвоните, напишите в WhatsApp или на почту, или отправьте заявку. Мариам — соцсети, Эдгар — SEO и сайты.',
      ),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'title',
        heading: L('Say *hello.*', 'Ասեք *բարև։*', 'Скажите *привет.*'),
        subheading: L(
          'Call, message or write — or use the form and the right person will get back to you.',
          'Զանգահարեք, գրեք կամ օգտագործեք ձևը, և ճիշտ մարդը կկապվի ձեզ հետ։',
          'Позвоните, напишите или заполните форму — вам ответит нужный человек.',
        ),
        settings: settings({ paddingTop: 'xl', paddingBottom: 'sm' }),
      },
      { ...contactBlock(), heading: undefined, intro: undefined, settings: settings({ anchor: 'contact', paddingTop: 'sm' }) },
    ],
  },
]

export const navigation = {
  header: [
    { label: L('Services', 'Ծառայություններ', 'Услуги'), type: 'path', path: '/services', appearance: 'link' },
    { label: L('SMM', 'SMM', 'SMM'), type: 'path', path: '/smm', appearance: 'link' },
    { label: L('SEO', 'SEO', 'SEO'), type: 'path', path: '/seo', appearance: 'link' },
    { label: L('Websites', 'Կայքեր', 'Сайты'), type: 'path', path: '/website-creation', appearance: 'link' },
    { label: L('Pricing', 'Գներ', 'Цены'), type: 'path', path: '/pricing', appearance: 'link' },
    { label: L('About', 'Մեր մասին', 'О нас'), type: 'path', path: '/about', appearance: 'link' },
    { label: L('Work', 'Աշխատանքներ', 'Работы'), type: 'path', path: '/work', appearance: 'link' },
    { label: L('Blog', 'Բլոգ', 'Блог'), type: 'path', path: '/blog', appearance: 'link' },
  ],
  headerCta: { label: T.discuss, type: 'path', path: '/contact', appearance: 'primary' },
  footerStatement: L('Ready when *you* are.', 'Պատրաստ ենք, երբ *դուք* պատրաստ եք։', 'Готовы, когда готовы *вы*.'),
  footerColumns: [
    {
      title: L('Services', 'Ծառայություններ', 'Услуги'),
      links: [
        { label: L('Social media marketing', 'Սոցիալական մեդիա մարքեթինգ', 'Маркетинг в соцсетях'), type: 'path', path: '/smm', appearance: 'link' },
        { label: L('SEO', 'SEO', 'SEO'), type: 'path', path: '/seo', appearance: 'link' },
        { label: L('Website creation', 'Կայքի ստեղծում', 'Создание сайтов'), type: 'path', path: '/website-creation', appearance: 'link' },
        { label: L('Pricing', 'Գներ', 'Цены'), type: 'path', path: '/pricing', appearance: 'link' },
      ],
    },
    {
      title: L('Agency', 'Գործակալություն', 'Агентство'),
      links: [
        { label: L('About', 'Մեր մասին', 'О нас'), type: 'path', path: '/about', appearance: 'link' },
        { label: L('Contact', 'Կապ', 'Контакты'), type: 'path', path: '/contact', appearance: 'link' },
        { label: L('Work', 'Աշխատանքներ', 'Работы'), type: 'path', path: '/work', appearance: 'link' },
        { label: L('Blog', 'Բլոգ', 'Блог'), type: 'path', path: '/blog', appearance: 'link' },
      ],
    },
  ],
  footerNote: L('Prices in AMD. Estimates on this website are not contracts.', 'Գները ՀՀ դրամով։ Կայքի նախահաշիվները պայմանագրեր չեն։', 'Цены в драмах. Расчёты на сайте не являются договором.'),
}

export const people = [
  {
    key: 'mariam',
    name: L('Mariam', 'Մարիամ', 'Мариам'),
    role: L('Social media marketing', 'Սոցիալական մեդիա մարքեթինգ', 'Маркетинг в соцсетях'),
    services: ['smm', 'bundle', 'addon'],
  },
  {
    key: 'edgar',
    name: L('Edgar', 'Էդգար', 'Эдгар'),
    role: L('SEO & website creation', 'SEO և կայքերի ստեղծում', 'SEO и создание сайтов'),
    services: ['seo', 'website', 'bundle', 'addon'],
  },
]

export const seoDefaults = {
  titleSuffix: L(' — BOTZ Marketing Agency', ' — BOTZ մարքեթինգային գործակալություն', ' — Маркетинговое агентство BOTZ'),
  defaultDescription: L(
    'Social media marketing, SEO and website creation with clear packages and transparent prices.',
    'Սոցիալական մեդիա մարքեթինգ, SEO և կայքերի ստեղծում՝ հստակ փաթեթներով և թափանցիկ գներով։',
    'Маркетинг в соцсетях, SEO и создание сайтов — с понятными пакетами и прозрачными ценами.',
  ),
  siteName: L('BOTZ Marketing Agency', 'BOTZ մարքեթինգային գործակալություն', 'Маркетинговое агентство BOTZ'),
}

export const guide = {
  questions: [
    {
      key: 'goal',
      role: 'normal',
      label: L('What matters most right now?', 'Ի՞նչն է հիմա ամենակարևորը', 'Что сейчас важнее всего?'),
      options: [
        { value: 'social', label: L('Being seen on social media', 'Տեսանելի լինել սոցցանցերում', 'Быть заметным в соцсетях') },
        { value: 'search', label: L('Being found on Google', 'Գտնվել Google-ում', 'Находиться в Google') },
        { value: 'both', label: L('Both social and search', 'Եվ սոցցանցեր, և որոնում', 'И соцсети, и поиск') },
        { value: 'site', label: L('A new website', 'Նոր կայք', 'Новый сайт') },
      ],
    },
    {
      key: 'website',
      role: 'normal',
      label: L('Do you have a website today?', 'Այսօր կայք ունե՞ք', 'Есть ли у вас сайт?'),
      options: [
        { value: 'yes', label: L('Yes, and it works well', 'Այո, և այն լավ է աշխատում', 'Да, и он работает хорошо') },
        { value: 'outdated', label: L('Yes, but it is outdated', 'Այո, բայց հնացած է', 'Да, но он устарел') },
        { value: 'no', label: L('Not yet', 'Դեռ ոչ', 'Пока нет') },
      ],
    },
    {
      key: 'social',
      role: 'normal',
      label: L('How active are your social accounts?', 'Որքանո՞վ են ակտիվ ձեր սոցցանցերը', 'Насколько активны ваши соцсети?'),
      options: [
        { value: 'none', label: L('We are just starting', 'Նոր ենք սկսում', 'Только начинаем') },
        { value: 'irregular', label: L('We post now and then', 'Հրապարակում ենք երբեմն', 'Публикуем время от времени') },
        { value: 'active', label: L('Active, ready to grow', 'Ակտիվ ենք, պատրաստ աճի', 'Активны и готовы расти') },
      ],
    },
    {
      key: 'production',
      role: 'normal',
      label: L('Do you need photo or video production?', 'Ֆոտո կամ վիդեո նկարահանում պե՞տք է', 'Нужна ли фото- или видеосъёмка?'),
      options: [
        { value: 'none', label: L('No, we have our own material', 'Ոչ, ունենք մեր նյութերը', 'Нет, есть свои материалы') },
        { value: 'photo', label: L('Regular photos', 'Կանոնավոր լուսանկարներ', 'Регулярные фото') },
        { value: 'video', label: L('Short-form video too', 'Նաև կարճ տեսանյութեր', 'И короткие видео') },
      ],
    },
    {
      key: 'budget',
      role: 'budget',
      label: L('What monthly budget do you have for our fee?', 'Ի՞նչ ամսական բյուջե ունեք մեր վճարի համար', 'Какой месячный бюджет на наши услуги?'),
      help: L('Advertising spend is separate.', 'Գովազդային բյուջեն առանձին է։', 'Рекламный бюджет — отдельно.'),
      options: [
        { value: 'b100', label: L('Up to 100,000 ֏', 'Մինչև 100,000 ֏', 'До 100 000 ֏'), budgetMax: 100000 },
        { value: 'b200', label: L('Up to 200,000 ֏', 'Մինչև 200,000 ֏', 'До 200 000 ֏'), budgetMax: 200000 },
        { value: 'b400', label: L('Up to 400,000 ֏', 'Մինչև 400,000 ֏', 'До 400 000 ֏'), budgetMax: 400000 },
        { value: 'b700', label: L('Up to 700,000 ֏', 'Մինչև 700,000 ֏', 'До 700 000 ֏'), budgetMax: 700000 },
        { value: 'unsure', label: L('Not sure yet', 'Դեռ չգիտեմ', 'Пока не знаю') },
      ],
    },
    {
      key: 'term',
      role: 'duration',
      label: L('How long would you like to work together?', 'Որքա՞ն ժամանակ կցանկանայիք համագործակցել', 'Как долго вы хотели бы работать вместе?'),
      options: [
        { value: 'm1', label: L('1 month', '1 ամիս', '1 месяц'), months: 1 },
        { value: 'm3', label: L('3 months', '3 ամիս', '3 месяца'), months: 3 },
        { value: 'm6', label: L('6 months', '6 ամիս', '6 месяцев'), months: 6 },
        { value: 'm9', label: L('9 months', '9 ամիս', '9 месяцев'), months: 9 },
        { value: 'm12', label: L('12 months', '12 ամիս', '12 месяцев'), months: 12 },
      ],
    },
  ],
  rules: [
    { key: 'social-start', packageKey: 'smm-start', points: 2, when: [{ question: 'goal', values: ['social'] }], reason: L('You want a steady social presence.', 'Ցանկանում եք կայուն ներկայություն սոցցանցերում։', 'Вам нужно стабильное присутствие в соцсетях.') },
    { key: 'social-dominance', packageKey: 'smm-dominance', points: 3, when: [{ question: 'goal', values: ['social'] }], reason: L('Strong creative direction for steady social growth.', 'Ուժեղ կրեատիվ ուղղություն՝ սոցցանցերում կայուն աճի համար։', 'Сильная креативная концепция для стабильного роста в соцсетях.') },
    { key: 'social-gold', packageKey: 'smm-gold', points: 2, when: [{ question: 'goal', values: ['social'] }], reason: L('Full-service social media across several platforms.', 'Սոցցանցերի ամբողջական սպասարկում մի քանի հարթակում։', 'Полный сервис в соцсетях на нескольких платформах.') },
    { key: 'new-start', packageKey: 'smm-start', points: 2, when: [{ question: 'social', values: ['none', 'irregular'] }], reason: L('Start builds a consistent rhythm from the ground up.', 'Start-ը զրոյից ստեղծում է կայուն ռիթմ։', 'Start выстраивает стабильный ритм с нуля.') },
    { key: 'active-grow', packageKey: 'smm-dominance', points: 1, when: [{ question: 'social', values: ['active'] }], reason: L('Your accounts are active and ready for more.', 'Ձեր հաշիվներն ակտիվ են և պատրաստ են ավելիին։', 'Ваши аккаунты активны и готовы к большему.') },
    { key: 'photo', packageKey: 'smm-dominance', points: 2, when: [{ question: 'production', values: ['photo'] }], reason: L('Built for brands that need regular production support.', 'Նախատեսված է կանոնավոր արտադրական աջակցության կարիք ունեցող բրենդների համար։', 'Для брендов, которым нужен регулярный продакшн.') },
    { key: 'video', packageKey: 'smm-gold', points: 3, when: [{ question: 'production', values: ['video'] }], reason: L('Gold is our most complete social media package.', 'Gold-ը մեր ամենաամբողջական SMM փաթեթն է։', 'Gold — наш самый полный SMM-пакет.') },
    { key: 'video-ultra', packageKey: 'ultra', points: 1, when: [{ question: 'production', values: ['video'] }, { question: 'goal', values: ['both'] }], reason: L('Full-scale social and search in one plan.', 'Ամբողջական SMM և որոնում մեկ փաթեթում։', 'Полный SMM и поиск в одном плане.') },
    { key: 'search-fundamental', packageKey: 'seo-fundamental', points: 2, when: [{ question: 'goal', values: ['search'] }], reason: L('A technical foundation is the first step in search.', 'Տեխնիկական հիմքը որոնման մեջ առաջին քայլն է։', 'Технический фундамент — первый шаг в поиске.') },
    { key: 'search-vision', packageKey: 'seo-vision', points: 3, when: [{ question: 'goal', values: ['search'] }], reason: L('Regular content widens the searches you appear for.', 'Կանոնավոր բովանդակությունն ընդլայնում է այն որոնումները, որտեղ հայտնվում եք։', 'Регулярный контент расширяет круг запросов, где вы появляетесь.') },
    { key: 'search-authority', packageKey: 'seo-authority', points: 2, when: [{ question: 'goal', values: ['search'] }, { question: 'website', values: ['yes'] }], reason: L('An established site can compete for tougher searches.', 'Կայացած կայքը կարող է մրցել ավելի բարդ որոնումներում։', 'Сложившийся сайт может бороться за конкурентные запросы.') },
    { key: 'search-no-site', packageKey: 'website-creation', points: 3, when: [{ question: 'goal', values: ['search'] }, { question: 'website', values: ['no'] }], reason: L('SEO needs a site you control — we can build it first or alongside.', 'SEO-ին անհրաժեշտ է ձեր վերահսկած կայք․ կարող ենք այն ստեղծել նախապես կամ զուգահեռ։', 'Для SEO нужен ваш сайт — мы можем сделать его заранее или параллельно.') },
    { key: 'search-no-site-seo', packageKey: 'seo-fundamental', points: 1, when: [{ question: 'goal', values: ['search'] }, { question: 'website', values: ['no'] }], reason: L('SEO can start alongside a new website.', 'SEO-ն կարող է սկսվել նոր կայքի հետ զուգահեռ։', 'SEO можно начать параллельно с созданием сайта.') },
    { key: 'both-boost', packageKey: 'business-boost', points: 4, when: [{ question: 'goal', values: ['both'] }], reason: L('One coordinated plan for social and search.', 'Մեկ համակարգված փաթեթ սոցցանցերի և որոնման համար։', 'Один согласованный план для соцсетей и поиска.') },
    { key: 'both-ultra', packageKey: 'ultra', points: 3, when: [{ question: 'goal', values: ['both'] }], reason: L('Full-scale social and search with priority support.', 'Ամբողջական SMM և SEO՝ առաջնահերթ աջակցությամբ։', 'Максимальный SMM и SEO с приоритетной поддержкой.') },
    { key: 'site', packageKey: 'website-creation', points: 5, when: [{ question: 'goal', values: ['site'] }], reason: L('You want a new website.', 'Ցանկանում եք նոր կայք։', 'Вам нужен новый сайт.') },
    { key: 'site-outdated', packageKey: 'website-creation', points: 2, when: [{ question: 'website', values: ['outdated', 'no'] }], reason: L('A refreshed website gives every channel a better place to send people.', 'Թարմացված կայքը յուրաքանչյուր ալիքի համար ավելի լավ վայր է՝ մարդկանց ուղղորդելու։', 'Обновлённый сайт — лучшее место, куда вести людей из любых каналов.') },
  ],
}
