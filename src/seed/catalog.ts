/**
 * Seed source for the pricing catalog.
 *
 * PRICES: the original BOTZ price list (authoritative, unchanged).
 * SCOPES: the revised service proposal (appendix of the brief). These are
 * PROPOSALS: they are seeded as an unpublished draft (approvalState "proposed")
 * and only go live when the owner approves and publishes them.
 */
import type { L10n } from '@/i18n/config'

const L = (en: string, hy: string, ru: string): L10n => ({ en, hy, ru })

type FeatureSeed = {
  featureKey: string
  status: 'included' | 'not_included' | 'not_specified' | 'replaced'
  quantity?: number
  quantityMax?: number
  cadence?: 'monthly' | 'first_month' | 'quarterly' | 'one_time' | 'ongoing' | 'per_project'
  unit?: L10n
  replacedBy?: string
  detail?: L10n
}

export const featureDefs: { key: string; group: string; order: number; name: L10n; unit?: L10n; compare?: boolean }[] = [
  // scope
  { key: 'smm_accounts', group: 'scope', order: 1, name: L('Managed platforms', 'Կառավարվող հարթակներ', 'Платформы в управлении'), unit: L('platforms', 'հարթակ', 'платформы') },
  { key: 'seo_site', group: 'scope', order: 2, name: L('Website scope', 'Կայքի ծավալ', 'Объём сайта'), unit: L('indexable URLs', 'ինդեքսավորվող URL', 'индексируемых URL') },
  { key: 'seo_keywords', group: 'scope', order: 3, name: L('Target keywords', 'Թիրախային բանալի բառեր', 'Целевые ключевые слова'), unit: L('keywords', 'բանալի բառ', 'ключевых слов') },
  { key: 'web_pages', group: 'scope', order: 4, name: L('Pages', 'Էջեր', 'Страницы'), unit: L('standard pages', 'ստանդարտ էջ', 'стандартных страниц') },
  // setup
  { key: 'smm_setup', group: 'setup', order: 1, name: L('Onboarding & setup', 'Մեկնարկ և կարգավորում', 'Запуск и настройка') },
  { key: 'smm_highlights', group: 'setup', order: 2, name: L('Story Highlights setup', 'Story Highlights-ի ձևավորում', 'Оформление Highlights'), unit: L('covers', 'շապիկ', 'обложек') },
  { key: 'seo_audit', group: 'setup', order: 3, name: L('SEO audit & roadmap', 'SEO աուդիտ և աշխատանքային պլան', 'SEO-аудит и дорожная карта') },
  { key: 'seo_measurement', group: 'setup', order: 4, name: L('Search Console & analytics review', 'Search Console-ի և վերլուծության ստուգում', 'Проверка Search Console и аналитики') },
  { key: 'seo_gbp', group: 'setup', order: 5, name: L('Google Business Profile', 'Google Business Profile', 'Google Business Profile') },
  // content
  { key: 'smm_feed', group: 'content', order: 1, name: L('Feed content', 'Լրահոսի հրապարակումներ', 'Публикации в ленте'), unit: L('unique pieces / month', 'եզակի հրապարակում ամսական', 'уникальных публикаций в месяц') },
  { key: 'smm_stories', group: 'content', order: 2, name: L('Story frames', 'Սթորիների կադրեր', 'Кадры сторис'), unit: L('frames / month', 'կադր ամսական', 'кадров в месяц') },
  { key: 'smm_videos', group: 'content', order: 3, name: L('Edited short-form videos', 'Մոնտաժված կարճ տեսանյութեր', 'Смонтированные короткие видео'), unit: L('videos / month', 'տեսանյութ ամսական', 'видео в месяц') },
  { key: 'smm_creative', group: 'content', order: 4, name: L('Visuals, copywriting & scheduling', 'Վիզուալներ, տեքստեր և պլանավորում', 'Визуалы, тексты и планирование') },
  { key: 'smm_plan', group: 'content', order: 5, name: L('Content calendar & plan', 'Բովանդակային օրացույց և պլան', 'Контент-календарь и план') },
  { key: 'seo_pages', group: 'content', order: 6, name: L('Page optimisation', 'Էջերի օպտիմալացում', 'Оптимизация страниц'), unit: L('pages / month', 'էջ ամսական', 'страниц в месяц') },
  { key: 'seo_articles', group: 'content', order: 7, name: L('New SEO articles', 'Նոր SEO հոդվածներ', 'Новые SEO-статьи'), unit: L('articles / month', 'հոդված ամսական', 'статей в месяц') },
  { key: 'seo_strategy', group: 'content', order: 8, name: L('Content strategy & keyword mapping', 'Բովանդակային ռազմավարություն և բանալի բառերի բաշխում', 'Контент-стратегия и карта ключей') },
  { key: 'seo_linking', group: 'content', order: 9, name: L('Internal linking', 'Ներքին հղումներ', 'Внутренняя перелинковка') },
  { key: 'seo_ai', group: 'content', order: 10, name: L('AI search visibility', 'Տեսանելիություն AI որոնման մեջ', 'Видимость в AI-поиске'), unit: L('monitored queries', 'դիտարկվող հարցում', 'отслеживаемых запросов') },
  { key: 'web_responsive', group: 'content', order: 11, name: L('Responsive design', 'Ադապտիվ դիզայն', 'Адаптивный дизайн') },
  { key: 'web_cms', group: 'content', order: 12, name: L('Content management (CMS)', 'Բովանդակության կառավարում (CMS)', 'Управление контентом (CMS)') },
  { key: 'web_contact', group: 'content', order: 13, name: L('Contact form & links', 'Կապի ձև և հղումներ', 'Форма связи и ссылки') },
  { key: 'web_seo', group: 'content', order: 14, name: L('Basic SEO setup', 'Հիմնական SEO կարգավորում', 'Базовая SEO-настройка') },
  { key: 'web_analytics', group: 'content', order: 15, name: L('Search Console & analytics', 'Search Console և վերլուծություն', 'Search Console и аналитика') },
  // platforms
  { key: 'smm_tiktok', group: 'platforms', order: 1, name: L('TikTok', 'TikTok', 'TikTok') },
  { key: 'smm_profiles', group: 'platforms', order: 2, name: L('Profile & link maintenance', 'Պրոֆիլների և հղումների թարմացում', 'Ведение профилей и ссылок') },
  // production
  { key: 'smm_shoot', group: 'production', order: 1, name: L('Photo/video shoot in Yerevan', 'Ֆոտո/վիդեո նկարահանում Երևանում', 'Фото/видеосъёмка в Ереване'), unit: L('hours / month', 'ժամ ամսական', 'ч. в месяц') },
  { key: 'smm_photos', group: 'production', order: 2, name: L('Edited photographs', 'Մշակված լուսանկարներ', 'Обработанные фотографии'), unit: L('photos / month', 'լուսանկար ամսական', 'фото в месяц') },
  // ads & outreach
  { key: 'smm_ads', group: 'ads', order: 1, name: L('Meta ad campaigns managed', 'Meta գովազդային արշավների կառավարում', 'Ведение рекламы в Meta'), unit: L('active campaigns', 'ակտիվ արշավ', 'активных кампаний') },
  { key: 'seo_citations', group: 'ads', order: 2, name: L('Local citations', 'Տեղական կատալոգներ', 'Локальные каталоги'), unit: L('submissions / month', 'գրանցում ամսական', 'размещений в месяц') },
  { key: 'seo_outreach', group: 'ads', order: 3, name: L('Digital PR & link outreach', 'Թվային PR և հղումների ձեռքբերում', 'Digital PR и получение ссылок'), unit: L('pitches / month', 'առաջարկ ամսական', 'питчей в месяц') },
  // reporting
  { key: 'smm_report', group: 'reporting', order: 1, name: L('Monthly social report', 'Ամսական SMM հաշվետվություն', 'Ежемесячный SMM-отчёт') },
  { key: 'smm_meeting', group: 'reporting', order: 2, name: L('Monthly review meeting', 'Ամսական վերանայման հանդիպում', 'Ежемесячная встреча') },
  { key: 'smm_strategy_review', group: 'reporting', order: 3, name: L('Strategy review', 'Ռազմավարության վերանայում', 'Пересмотр стратегии') },
  { key: 'seo_report', group: 'reporting', order: 4, name: L('Monitoring & monthly SEO report', 'Մոնիթորինգ և ամսական SEO հաշվետվություն', 'Мониторинг и SEO-отчёт') },
  { key: 'seo_consult', group: 'reporting', order: 5, name: L('SEO consultation', 'SEO խորհրդատվություն', 'SEO-консультация'), unit: L('minutes / month', 'րոպե ամսական', 'минут в месяц') },
  { key: 'seo_competitors', group: 'reporting', order: 6, name: L('Competitor tracking', 'Մրցակիցների դիտարկում', 'Анализ конкурентов'), unit: L('competitors', 'մրցակից', 'конкурентов') },
  { key: 'seo_conversion', group: 'reporting', order: 7, name: L('Conversion tracking review', 'Կոնվերսիաների վերլուծություն', 'Анализ конверсий'), unit: L('recommendations / month', 'առաջարկություն ամսական', 'рекомендаций в месяц') },
  { key: 'bundle_calendar', group: 'reporting', order: 8, name: L('Shared campaign calendar', 'Ընդհանուր արշավների օրացույց', 'Общий календарь кампаний') },
  { key: 'bundle_report', group: 'reporting', order: 9, name: L('Consolidated report & joint meeting', 'Միասնական հաշվետվություն և համատեղ հանդիպում', 'Сводный отчёт и совместная встреча'), unit: L('minutes / month', 'րոպե ամսական', 'минут в месяц') },
  { key: 'bundle_quarterly', group: 'reporting', order: 10, name: L('Quarterly joint strategy review', 'Եռամսյակային համատեղ ռազմավարական վերանայում', 'Ежеквартальный совместный пересмотр стратегии') },
  // support
  { key: 'smm_revisions', group: 'support', order: 1, name: L('Revision rounds', 'Խմբագրման փուլեր', 'Раунды правок'), unit: L('per content batch', 'յուրաքանչյուր բովանդակային փաթեթի համար', 'на пакет контента') },
  { key: 'smm_corrections', group: 'support', order: 2, name: L('Priority corrections', 'Առաջնահերթ ուղղումներ', 'Приоритетные исправления'), unit: L('posts / month', 'հրապարակում ամսական', 'публикаций в месяц') },
  { key: 'smm_community', group: 'support', order: 3, name: L('Community management', 'Համայնքի կառավարում', 'Работа с сообществом'), unit: L('comments & messages / month', 'մեկնաբանություն և հաղորդագրություն ամսական', 'комментариев и сообщений в месяц') },
  { key: 'seo_tech', group: 'support', order: 4, name: L('Technical implementation', 'Տեխնիկական իրականացում', 'Техническое внедрение'), unit: L('hours / month', 'ժամ ամսական', 'ч. в месяц') },
  { key: 'seo_schema', group: 'support', order: 5, name: L('Structured data', 'Կառուցվածքային տվյալներ', 'Структурированные данные') },
  { key: 'seo_advanced', group: 'support', order: 6, name: L('Advanced technical analysis', 'Խորացված տեխնիկական վերլուծություն', 'Расширенный технический анализ') },
  { key: 'priority_support', group: 'support', order: 7, name: L('Priority support', 'Առաջնահերթ աջակցություն', 'Приоритетная поддержка') },
  { key: 'coordination', group: 'support', order: 8, name: L('Team coordination', 'Թիմային համակարգում', 'Координация команды') },
  { key: 'web_revisions', group: 'support', order: 9, name: L('Revision rounds', 'Խմբագրման փուլեր', 'Раунды правок'), unit: L('rounds', 'փուլ', 'раунда') },
  { key: 'web_training', group: 'support', order: 10, name: L('Handoff training & guide', 'Հանձնում, ուսուցում և ուղեցույց', 'Передача, обучение и инструкция') },
  // delivery
  { key: 'web_timeline', group: 'delivery', order: 1, name: L('Target delivery', 'Նախատեսված ժամկետ', 'Плановый срок'), unit: L('working days', 'աշխատանքային օր', 'рабочих дней') },
  { key: 'web_payment', group: 'delivery', order: 2, name: L('Payment schedule', 'Վճարման ժամանակացույց', 'График оплаты') },
  { key: 'web_support', group: 'delivery', order: 3, name: L('Post-launch defect support', 'Գործարկումից հետո թերությունների շտկում', 'Исправление дефектов после запуска'), unit: L('calendar days', 'օրացուցային օր', 'календарных дней') },
]

const ns = (featureKey: string): FeatureSeed => ({ featureKey, status: 'not_specified' })

type PackageSeed = {
  key: string
  category: 'smm' | 'seo' | 'bundle' | 'website'
  order: number
  name: L10n
  tagline: L10n
  summary: L10n
  prices?: { m1: number; m3: number; m6: number; m9: number | null; m12: number | null }
  oneTimePrice?: number
  recommended?: boolean
  badge?: L10n
  inherits?: string
  components?: string[]
  inheritBoundaries?: boolean
  contact?: 'mariam' | 'edgar' | 'either'
  features: FeatureSeed[]
  boundaries: L10n[]
}

const recommendedBadge = L('Recommended', 'Առաջարկվող', 'Рекомендуем')

export const packages: PackageSeed[] = [
  {
    key: 'smm-start',
    category: 'smm',
    order: 10,
    name: L('Start', 'Start', 'Start'),
    tagline: L('For small businesses building a consistent social presence', 'Փոքր բիզնեսների համար, որոնք կառուցում են կայուն ներկայություն սոցցանցերում', 'Для малого бизнеса, который выстраивает стабильное присутствие в соцсетях'),
    summary: L(
      'For small businesses that need Instagram and Facebook managed with care every month.',
      'Փոքր բիզնեսների համար, որոնց Instagram-ն ու Facebook-ը պետք է ամեն ամիս խնամքով վարել։',
      'Для малого бизнеса, которому нужно аккуратное ежемесячное ведение Instagram и Facebook.',
    ),
    prices: { m1: 79000, m3: 75000, m6: 73000, m9: 70000, m12: 66500 },
    contact: 'mariam',
    features: [
      { featureKey: 'smm_accounts', status: 'included', quantity: 2, detail: L('Instagram and Facebook for one business.', 'Instagram և Facebook՝ մեկ բիզնեսի համար։', 'Instagram и Facebook для одного бизнеса.') },
      { featureKey: 'smm_setup', status: 'included', cadence: 'first_month', detail: L('Brand and audience briefing, account access review, profile check, first content calendar and baseline metrics.', 'Բրենդի և լսարանի բրիֆինգ, հաշիվների հասանելիության ստուգում, պրոֆիլի վերանայում, առաջին բովանդակային օրացույց և ելակետային ցուցանիշներ։', 'Бриф по бренду и аудитории, проверка доступов, аудит профиля, первый контент-календарь и базовые метрики.') },
      { featureKey: 'smm_feed', status: 'included', quantity: 8, cadence: 'monthly', detail: L('Adapted and published on Instagram and Facebook. Cross-posting the same piece counts once; a carousel counts as one piece.', 'Հարմարեցված և հրապարակված Instagram-ում և Facebook-ում։ Նույն հրապարակումը երկու հարթակում հաշվվում է մեկ անգամ, կարուսելը՝ մեկ հրապարակում։', 'Адаптируются и публикуются в Instagram и Facebook. Одна публикация на двух платформах считается один раз, карусель — как одна публикация.') },
      { featureKey: 'smm_stories', status: 'included', quantity: 8, cadence: 'monthly', detail: L('Individual frames adapted for both platforms. A three-frame sequence uses three frames.', 'Առանձին կադրեր՝ հարմարեցված երկու հարթակների համար։ Երեք կադրից բաղկացած շարքը օգտագործում է երեք կադր։', 'Отдельные кадры, адаптированные для обеих платформ. Серия из трёх кадров расходует три кадра.') },
      { featureKey: 'smm_creative', status: 'included', cadence: 'monthly', detail: L('Brand-aligned visuals made with AI assistance and human review, plus copywriting, captions and scheduling.', 'Բրենդին համահունչ վիզուալներ՝ AI-ի օգնությամբ և մարդկային ստուգմամբ, ինչպես նաև տեքստեր, նկարագրություններ և պլանավորում։', 'Визуалы в стиле бренда, созданные с помощью AI и проверенные человеком, а также тексты, подписи и планирование.') },
      { featureKey: 'smm_plan', status: 'included', cadence: 'monthly', detail: L('A simple monthly content calendar.', 'Պարզ ամսական բովանդակային օրացույց։', 'Простой ежемесячный контент-календарь.') },
      { featureKey: 'smm_profiles', status: 'included', cadence: 'ongoing', detail: L('Profile information and link maintenance for both accounts.', 'Երկու հաշիվների պրոֆիլային տվյալների և հղումների թարմացում։', 'Актуализация информации профиля и ссылок для обоих аккаунтов.') },
      { featureKey: 'smm_ads', status: 'included', quantity: 1, detail: L('Up to one active Meta campaign at a time, with weekly checks and a monthly summary. Campaign creative comes from the content allowance; ad spend is paid separately.', 'Միաժամանակ մինչև մեկ ակտիվ Meta արշավ՝ շաբաթական ստուգումներով և ամսական ամփոփումով։ Գովազդային վիզուալները ներառված են բովանդակության քանակում, գովազդային բյուջեն վճարվում է առանձին։', 'До одной активной кампании в Meta одновременно, с еженедельными проверками и ежемесячной сводкой. Креативы берутся из объёма контента; рекламный бюджет оплачивается отдельно.') },
      { featureKey: 'smm_revisions', status: 'included', quantity: 1, detail: L('One consolidated revision round before publication.', 'Մեկ համախմբված խմբագրման փուլ՝ հրապարակումից առաջ։', 'Один сводный раунд правок перед публикацией.') },
      { featureKey: 'smm_report', status: 'included', cadence: 'monthly', detail: L('Content delivery, reach, engagement and available advertising results, with actions for next month.', 'Կատարված աշխատանք, հասանելիություն, ներգրավվածություն և գովազդի առկա արդյունքներ՝ հաջորդ ամսվա քայլերով։', 'Выполненный контент, охваты, вовлечённость и доступные результаты рекламы с планом на следующий месяц.') },
      { featureKey: 'smm_shoot', status: 'not_included', detail: L('You supply product photos and footage where needed.', 'Անհրաժեշտության դեպքում ապրանքի լուսանկարներն ու տեսանյութերը տրամադրում եք դուք։', 'Фото и видео продукции при необходимости предоставляете вы.') },
      { featureKey: 'smm_photos', status: 'not_included' },
      { featureKey: 'smm_videos', status: 'not_included' },
      { featureKey: 'smm_tiktok', status: 'not_included' },
      { featureKey: 'smm_community', status: 'not_included', detail: L('Routine inbox and comment replies are not included.', 'Ընթացիկ հաղորդագրություններին և մեկնաբանություններին պատասխանելը ներառված չէ։', 'Ответы на сообщения и комментарии не входят.') },
      ns('smm_highlights'),
      ns('smm_corrections'),
      ns('smm_meeting'),
      ns('smm_strategy_review'),
    ],
    boundaries: [
      L('Professional shooting, edited Reels, TikTok management and routine inbox or comment replies are not included.', 'Պրոֆեսիոնալ նկարահանումը, մոնտաժված Reels-ը, TikTok-ի վարումը և հաղորդագրություններին ու մեկնաբանություններին պատասխանելը ներառված չեն։', 'Профессиональная съёмка, смонтированные Reels, ведение TikTok и ответы на сообщения и комментарии не входят.'),
      L('Advertising spend is paid separately. Advanced tracking installation, additional campaigns and additional creatives are quoted separately.', 'Գովազդային բյուջեն վճարվում է առանձին։ Խորացված հետևման կարգավորումը, լրացուցիչ արշավներն ու վիզուալները գնահատվում են առանձին։', 'Рекламный бюджет оплачивается отдельно. Расширенная настройка отслеживания, дополнительные кампании и креативы оцениваются отдельно.'),
      L('Any promotional bonus is stated in your individual proposal, not in the standard package.', 'Ցանկացած ակցիոն բոնուս նշվում է ձեր անհատական առաջարկում, ոչ թե ստանդարտ փաթեթում։', 'Любой акционный бонус указывается в индивидуальном предложении, а не в стандартном пакете.'),
    ],
  },
  {
    key: 'smm-dominance',
    category: 'smm',
    order: 20,
    name: L('Dominance', 'Dominance', 'Dominance'),
    tagline: L('For brands focused on steady monthly growth', 'Բրենդների համար, որոնք ձգտում են կայուն ամսական աճի', 'Для брендов, нацеленных на стабильный ежемесячный рост'),
    summary: L(
      'For brands focused on steady monthly growth, with a monthly shoot and a clear content strategy.',
      'Բրենդների համար, որոնք ձգտում են կայուն ամսական աճի՝ ամսական նկարահանումով և հստակ բովանդակային ռազմավարությամբ։',
      'Для брендов, нацеленных на стабильный рост: ежемесячная съёмка и чёткая контент-стратегия.',
    ),
    prices: { m1: 119000, m3: 115000, m6: 110000, m9: 105000, m12: 103000 },
    recommended: true,
    badge: recommendedBadge,
    inherits: 'smm-start',
    contact: 'mariam',
    features: [
      { featureKey: 'smm_setup', status: 'included', cadence: 'first_month', detail: L('Brand and audience review, visual direction, content strategy, profile updates, Highlights setup and baseline measurement.', 'Բրենդի և լսարանի վերլուծություն, վիզուալ ուղղություն, բովանդակային ռազմավարություն, պրոֆիլների թարմացում, Highlights-ի ձևավորում և ելակետային չափումներ։', 'Анализ бренда и аудитории, визуальная концепция, контент-стратегия, обновление профилей, оформление Highlights и базовые замеры.') },
      { featureKey: 'smm_feed', status: 'included', quantity: 10, cadence: 'monthly', detail: L('Replaces the Start allowance — not added to it. Cross-posted adaptations count once.', 'Փոխարինում է Start-ի քանակը, չի գումարվում դրան։ Տարբեր հարթակների հարմարեցումները հաշվվում են մեկ անգամ։', 'Заменяет объём Start, а не добавляется к нему. Адаптации для разных платформ считаются один раз.') },
      { featureKey: 'smm_stories', status: 'included', quantity: 10, cadence: 'monthly', detail: L('Replaces the Start allowance.', 'Փոխարինում է Start-ի քանակը։', 'Заменяет объём Start.') },
      { featureKey: 'smm_plan', status: 'included', cadence: 'monthly', detail: L('Graphic design and a monthly content plan aligned with an agreed strategy.', 'Գրաֆիկական դիզայն և ամսական բովանդակային պլան՝ համաձայնեցված ռազմավարությանը համապատասխան։', 'Графический дизайн и ежемесячный контент-план в рамках согласованной стратегии.') },
      { featureKey: 'smm_shoot', status: 'included', quantity: 2, cadence: 'monthly', detail: L('One session of up to two hours per month in Yerevan, for one location and one agreed brief.', 'Ամսական մեկ նկարահանում՝ մինչև երկու ժամ, Երևանում, մեկ վայրում և մեկ համաձայնեցված առաջադրանքով։', 'Одна съёмка до двух часов в месяц в Ереване: одна локация, один согласованный бриф.') },
      { featureKey: 'smm_photos', status: 'included', quantity: 8, cadence: 'monthly', detail: L('Up to 8 edited photographs, plus selected usable footage for the agreed content. Footage is not a finished edited video.', 'Մինչև 8 մշակված լուսանկար և ընտրված օգտագործելի կադրեր համաձայնեցված բովանդակության համար։ Կադրերը պատրաստի մոնտաժված տեսանյութ չեն։', 'До 8 обработанных фото и отобранные материалы для согласованного контента. Исходники — не готовый смонтированный ролик.') },
      { featureKey: 'smm_highlights', status: 'included', quantity: 5, cadence: 'first_month', detail: L('Set up in month one with up to 5 covers, then maintained using the monthly story allowance.', 'Ձևավորվում է առաջին ամսում՝ մինչև 5 շապիկով, հետո թարմացվում է ամսական սթորիների հաշվին։', 'Оформляются в первый месяц (до 5 обложек), затем поддерживаются за счёт месячного объёма сторис.') },
      { featureKey: 'smm_ads', status: 'included', quantity: 2, detail: L('Up to two active Meta campaigns at a time. Ad spend is paid separately.', 'Միաժամանակ մինչև երկու ակտիվ Meta արշավ։ Գովազդային բյուջեն վճարվում է առանձին։', 'До двух активных кампаний в Meta одновременно. Рекламный бюджет — отдельно.') },
      { featureKey: 'smm_revisions', status: 'included', quantity: 2, detail: L('Two consolidated revision rounds per monthly content batch.', 'Երկու համախմբված խմբագրման փուլ յուրաքանչյուր ամսական բովանդակային փաթեթի համար։', 'Два сводных раунда правок на ежемесячный пакет контента.') },
      { featureKey: 'smm_corrections', status: 'included', quantity: 2, cadence: 'monthly', detail: L('Corrections to up to two previously approved posts per month, acknowledged within one working day during support hours.', 'Ամսական մինչև երկու արդեն հաստատված հրապարակման ուղղում, որոնց արձագանքում ենք մեկ աշխատանքային օրվա ընթացքում՝ աջակցության ժամերին։', 'Исправления до двух ранее согласованных публикаций в месяц; подтверждаем в течение одного рабочего дня в часы поддержки.') },
      { featureKey: 'smm_report', status: 'included', cadence: 'monthly', detail: L('Monthly performance report.', 'Ամսական արդյունքների հաշվետվություն։', 'Ежемесячный отчёт об эффективности.') },
      { featureKey: 'smm_strategy_review', status: 'included', cadence: 'quarterly', detail: L('Strategy review every three months.', 'Ռազմավարության վերանայում երեք ամիսը մեկ։', 'Пересмотр стратегии раз в три месяца.') },
    ],
    boundaries: [
      L('Cross-posted adaptations count once. Studio hire, props, models and specialist equipment rental need prior agreement and a separate quote.', 'Տարբեր հարթակների հարմարեցումները հաշվվում են մեկ անգամ։ Ստուդիայի վարձույթը, ռեկվիզիտը, մոդելները և հատուկ սարքավորումները պահանջում են նախնական համաձայնություն և առանձին գնահատում։', 'Адаптации для разных платформ считаются один раз. Аренда студии, реквизит, модели и спецоборудование — по предварительному согласованию и отдельной оценке.'),
      L('Edited Reels, ongoing TikTok management and routine inbox or comment replies are not included.', 'Մոնտաժված Reels-ը, TikTok-ի մշտական վարումը և ընթացիկ հաղորդագրություններին ու մեկնաբանություններին պատասխանելը ներառված չեն։', 'Смонтированные Reels, постоянное ведение TikTok и ответы на сообщения и комментарии не входят.'),
      L('Urgent new campaigns and complete creative redesigns are additional work; priority corrections apply only to already approved content.', 'Շտապ նոր արշավները և ամբողջական կրեատիվ վերափոխումը լրացուցիչ աշխատանք են․ առաջնահերթ ուղղումները վերաբերում են միայն արդեն հաստատված բովանդակությանը։', 'Срочные новые кампании и полный редизайн креатива — дополнительная работа; приоритетные исправления касаются только согласованного контента.'),
    ],
  },
  {
    key: 'smm-gold',
    category: 'smm',
    order: 30,
    name: L('Gold', 'Gold', 'Gold'),
    tagline: L('For businesses that want full-service social media support', 'Բիզնեսների համար, որոնք ցանկանում են սոցցանցերի ամբողջական սպասարկում', 'Для бизнеса, которому нужен полный сервис в соцсетях'),
    summary: L(
      'For brands that want full-service social media: short-form video, TikTok, community management and regular performance reviews.',
      'Բրենդների համար, որոնք ցանկանում են սոցցանցերի ամբողջական սպասարկում՝ կարճ տեսանյութեր, TikTok, համայնքի կառավարում և կանոնավոր վերլուծություն։',
      'Для брендов, которым нужен полный сервис: короткие видео, TikTok, работа с сообществом и регулярный разбор результатов.',
    ),
    prices: { m1: 149000, m3: 145000, m6: 140000, m9: 135000, m12: 129000 },
    inherits: 'smm-dominance',
    contact: 'mariam',
    features: [
      { featureKey: 'smm_accounts', status: 'included', quantity: 3, detail: L('Instagram and Facebook management, plus TikTok publishing for the 4 agreed videos.', 'Instagram-ի և Facebook-ի վարում, ինչպես նաև համաձայնեցված 4 տեսանյութի հրապարակում TikTok-ում։', 'Ведение Instagram и Facebook, плюс публикация 4 согласованных видео в TikTok.') },
      { featureKey: 'smm_feed', status: 'included', quantity: 16, cadence: 'monthly', detail: L('16 unique feed pieces in total, including the 4 edited videos. Replaces all lower-tier quantities.', 'Ընդհանուր 16 եզակի հրապարակում, ներառյալ 4 մոնտաժված տեսանյութերը։ Փոխարինում է ցածր փաթեթների քանակները։', 'Всего 16 уникальных публикаций, включая 4 смонтированных видео. Заменяет объёмы младших пакетов.') },
      { featureKey: 'smm_stories', status: 'included', quantity: 16, cadence: 'monthly', detail: L('Cross-platform adaptations do not increase the allowance.', 'Տարբեր հարթակների հարմարեցումները չեն ավելացնում քանակը։', 'Адаптации для разных платформ не увеличивают объём.') },
      { featureKey: 'smm_videos', status: 'included', quantity: 4, cadence: 'monthly', detail: L('Each up to 45 seconds, with basic captions, licensed or platform-permitted audio and two consolidated revision rounds.', 'Յուրաքանչյուրը՝ մինչև 45 վայրկյան, հիմնական ենթագրերով, լիցենզավորված կամ հարթակի կողմից թույլատրված երաժշտությամբ և երկու համախմբված խմբագրման փուլով։', 'Каждое до 45 секунд, с базовыми субтитрами, лицензионной или разрешённой платформой музыкой и двумя сводными раундами правок.') },
      { featureKey: 'smm_tiktok', status: 'included', detail: L('Publishing the 4 agreed videos; TikTok adaptations are part of the same allowance.', 'Համաձայնեցված 4 տեսանյութի հրապարակում․ TikTok-ի հարմարեցումները նույն քանակի մեջ են։', 'Публикация 4 согласованных видео; адаптации для TikTok входят в тот же объём.') },
      { featureKey: 'smm_shoot', status: 'included', quantity: 3, cadence: 'monthly', detail: L('One professional session of up to three hours per month in Yerevan, replacing the Dominance session.', 'Ամսական մեկ պրոֆեսիոնալ նկարահանում՝ մինչև երեք ժամ, Երևանում՝ Dominance-ի նկարահանման փոխարեն։', 'Одна профессиональная съёмка до трёх часов в месяц в Ереване вместо съёмки Dominance.') },
      { featureKey: 'smm_photos', status: 'included', quantity: 15, cadence: 'monthly', detail: L('Up to 15 edited photographs, plus footage for the 4 videos.', 'Մինչև 15 մշակված լուսանկար և կադրեր 4 տեսանյութերի համար։', 'До 15 обработанных фото и материал для 4 видео.') },
      { featureKey: 'smm_community', status: 'included', quantity: 150, cadence: 'monthly', detail: L('On the managed accounts during working hours; we aim to reply to routine inquiries within one working day. Customer-service cases are passed to you.', 'Կառավարվող հաշիվներում՝ աշխատանքային ժամերին․ ընթացիկ հարցերին ձգտում ենք պատասխանել մեկ աշխատանքային օրվա ընթացքում։ Հաճախորդների սպասարկման հարցերը փոխանցվում են ձեզ։', 'В управляемых аккаунтах в рабочее время; на типовые вопросы стараемся отвечать в течение рабочего дня. Обращения в службу поддержки передаём вам.') },
      { featureKey: 'smm_ads', status: 'included', quantity: 3, detail: L('Up to three active Meta campaigns at a time. TikTok advertising and ad spend are separate.', 'Միաժամանակ մինչև երեք ակտիվ Meta արշավ։ TikTok գովազդը և գովազդային բյուջեն առանձին են։', 'До трёх активных кампаний в Meta одновременно. Реклама в TikTok и бюджет — отдельно.') },
      { featureKey: 'smm_meeting', status: 'included', cadence: 'monthly', detail: L('Monthly analytics review meeting with growth recommendations.', 'Ամսական վերլուծական հանդիպում՝ աճի առաջարկություններով։', 'Ежемесячная встреча по аналитике с рекомендациями по росту.') },
      { featureKey: 'smm_strategy_review', status: 'included', cadence: 'quarterly', detail: L('A deeper strategy review every three months.', 'Ավելի խորը ռազմավարական վերանայում երեք ամիսը մեկ։', 'Углублённый пересмотр стратегии раз в три месяца.') },
    ],
    boundaries: [
      L('Evening, weekend and crisis coverage need a separate agreement. No 24-hour moderation or unlimited revisions.', 'Երեկոյան, հանգստյան օրերի և ճգնաժամային սպասարկումը պահանջում է առանձին համաձայնություն։ 24-ժամյա մոդերացիա կամ անսահմանափակ խմբագրումներ ներառված չեն։', 'Работа вечером, в выходные и в кризисных ситуациях — по отдельному соглашению. Круглосуточная модерация и безлимитные правки не входят.'),
      L('Photo and video use the same agreed session. Extra locations or shoots, extensive animation, actors, studio hire and additional edited videos are quoted separately.', 'Լուսանկարներն ու տեսանյութերը արվում են նույն համաձայնեցված նկարահանման ընթացքում։ Լրացուցիչ վայրերը, նկարահանումները, բարդ անիմացիան, դերասանները, ստուդիան և լրացուցիչ տեսանյութերը գնահատվում են առանձին։', 'Фото и видео снимаются в рамках одной согласованной съёмки. Дополнительные локации и съёмки, сложная анимация, актёры, студия и дополнительные видео — отдельно.'),
      L('Dominance revision and priority-correction terms continue to apply.', 'Dominance-ի խմբագրման և առաջնահերթ ուղղումների պայմանները շարունակում են գործել։', 'Условия правок и приоритетных исправлений Dominance сохраняются.'),
    ],
  },
  {
    key: 'seo-fundamental',
    category: 'seo',
    order: 40,
    name: L('Fundamental', 'Fundamental', 'Fundamental'),
    tagline: L('For websites that need a strong SEO foundation', 'Կայքերի համար, որոնց անհրաժեշտ է ամուր SEO հիմք', 'Для сайтов, которым нужен прочный SEO-фундамент'),
    summary: L(
      'For smaller websites that need a technical foundation, clear search targeting and consistent measurement.',
      'Փոքր կայքերի համար, որոնց անհրաժեշտ է տեխնիկական հիմք, հստակ որոնողական թիրախավորում և կայուն չափումներ։',
      'Для небольших сайтов, которым нужен технический фундамент, чёткое поисковое таргетирование и регулярные замеры.',
    ),
    prices: { m1: 179000, m3: 175000, m6: 165000, m9: null, m12: null },
    contact: 'edgar',
    features: [
      { featureKey: 'seo_site', status: 'included', quantity: 25, detail: L('One website in one primary language. Larger sites or extra languages need a custom scope.', 'Մեկ կայք՝ մեկ հիմնական լեզվով։ Ավելի մեծ կայքերը կամ լրացուցիչ լեզուները պահանջում են անհատական ծավալ։', 'Один сайт на одном основном языке. Для крупных сайтов и дополнительных языков — индивидуальный объём.') },
      { featureKey: 'seo_keywords', status: 'included', quantity: 50, detail: L('Researched and grouped by intent, mapped to relevant pages.', 'Հետազոտված և ըստ նպատակի խմբավորված՝ համապատասխան էջերին կապված։', 'Исследуются, группируются по намерению и распределяются по страницам.') },
      { featureKey: 'seo_audit', status: 'included', cadence: 'first_month', detail: L('Crawling, indexing, robots directives, sitemap, canonicals, redirects, internal navigation, mobile usability and performance — with a prioritised implementation roadmap.', 'Ինդեքսավորում, robots-ի կանոններ, sitemap, canonical-ներ, վերահղումներ, ներքին նավիգացիա, բջջային հարմարավետություն և արագություն՝ առաջնահերթություններով աշխատանքային պլանով։', 'Сканирование, индексация, robots, sitemap, canonical, редиректы, навигация, мобильное удобство и скорость — с приоритизированной дорожной картой.') },
      { featureKey: 'seo_measurement', status: 'included', cadence: 'first_month', detail: L('Search Console and analytics access and setup review, a measurement baseline, and checks for up to two existing lead actions.', 'Search Console-ի և վերլուծության հասանելիության և կարգավորման ստուգում, ելակետային չափումներ և մինչև երկու առկա հայտի գործողության ստուգում։', 'Проверка доступа и настройки Search Console и аналитики, базовые замеры и проверка до двух существующих целевых действий.') },
      { featureKey: 'seo_gbp', status: 'included', cadence: 'first_month', detail: L('Audit and optimisation where the business is eligible; otherwise a review of contact information and local relevance on the website.', 'Աուդիտ և օպտիմալացում, եթե բիզնեսը համապատասխանում է պահանջներին, հակառակ դեպքում՝ կայքում կոնտակտային տվյալների և տեղային համապատասխանության վերանայում։', 'Аудит и оптимизация, если бизнес подходит; иначе — проверка контактной информации и локальной релевантности на сайте.') },
      { featureKey: 'seo_pages', status: 'included', quantity: 5, cadence: 'monthly', detail: L('Existing pages: titles, descriptions, headings, copy recommendations and appropriate basic structured data.', 'Առկա էջեր՝ վերնագրեր, նկարագրություններ, ենթավերնագրեր, տեքստային առաջարկություններ և հիմնական կառուցվածքային տվյալներ։', 'Существующие страницы: title, description, заголовки, рекомендации по тексту и базовая разметка.') },
      { featureKey: 'seo_tech', status: 'included', quantity: 3, cadence: 'monthly', detail: L('Agreed CMS-level implementation. Code changes beyond this allowance get an estimate and your approval first.', 'Համաձայնեցված աշխատանք CMS-ի մակարդակում։ Այս սահմանից դուրս փոփոխությունները նախ գնահատվում և հաստատվում են ձեր կողմից։', 'Согласованные работы на уровне CMS. Изменения сверх лимита — после оценки и вашего согласования.') },
      { featureKey: 'seo_report', status: 'included', cadence: 'monthly', detail: L('Indexing and performance monitoring, a log of completed work and a monthly report with prioritised next steps.', 'Ինդեքսավորման և արդյունքների մոնիթորինգ, կատարված աշխատանքի մատյան և ամսական հաշվետվություն՝ առաջնահերթ քայլերով։', 'Мониторинг индексации и позиций, журнал работ и ежемесячный отчёт с приоритетными шагами.') },
      { featureKey: 'seo_schema', status: 'included', detail: L('Review of Organization or business structured data against the information visible on the website.', 'Կազմակերպության կամ բիզնեսի կառուցվածքային տվյալների ստուգում՝ կայքում տեսանելի տեղեկությունների համեմատ։', 'Проверка разметки Organization или бизнеса на соответствие видимой информации сайта.') },
      { featureKey: 'seo_articles', status: 'not_included', detail: L('Article production is not included.', 'Հոդվածների պատրաստումը ներառված չէ։', 'Написание статей не входит.') },
      { featureKey: 'seo_outreach', status: 'not_included', detail: L('Backlink outreach is not included.', 'Արտաքին հղումների ձեռքբերումը ներառված չէ։', 'Получение внешних ссылок не входит.') },
      ns('seo_strategy'),
      ns('seo_linking'),
      ns('seo_citations'),
      ns('seo_competitors'),
      ns('seo_consult'),
      ns('seo_ai'),
      ns('seo_conversion'),
      ns('seo_advanced'),
      ns('priority_support'),
    ],
    boundaries: [
      L('Website rebuilds, migrations, extensive custom development, article production and backlink outreach are not included.', 'Կայքի վերակառուցումը, տեղափոխումը, ծավալուն անհատական ծրագրավորումը, հոդվածների պատրաստումը և արտաքին հղումների ձեռքբերումը ներառված չեն։', 'Пересборка сайта, миграции, крупная разработка, написание статей и получение внешних ссылок не входят.'),
      L('After the initial audit, work follows the agreed roadmap — the full setup audit is not repeated every month.', 'Սկզբնական աուդիտից հետո աշխատանքը շարունակվում է համաձայնեցված պլանով․ ամբողջական աուդիտը ամեն ամիս չի կրկնվում։', 'После первичного аудита работа идёт по согласованной дорожной карте — полный аудит не повторяется ежемесячно.'),
      L('Available for 1, 3 or 6 months.', 'Հասանելի է 1, 3 կամ 6 ամսով։', 'Доступен на 1, 3 или 6 месяцев.'),
    ],
  },
  {
    key: 'seo-vision',
    category: 'seo',
    order: 50,
    name: L('Vision', 'Vision', 'Vision'),
    tagline: L('For businesses targeting organic growth', 'Բիզնեսների համար, որոնք ձգտում են օրգանիկ աճի', 'Для бизнеса, нацеленного на органический рост'),
    summary: L(
      'For businesses targeting organic growth with regular SEO articles and wider keyword coverage.',
      'Բիզնեսների համար, որոնք ձգտում են օրգանիկ աճի՝ կանոնավոր SEO հոդվածներով և բանալի բառերի ավելի լայն ծածկույթով։',
      'Для бизнеса, нацеленного на органический рост: регулярные SEO-статьи и широкий охват запросов.',
    ),
    prices: { m1: 349000, m3: 340000, m6: 330000, m9: 320000, m12: 299000 },
    recommended: true,
    badge: recommendedBadge,
    inherits: 'seo-fundamental',
    contact: 'edgar',
    features: [
      { featureKey: 'seo_site', status: 'included', quantity: 50, detail: L('One website in one primary language. Replaces the Fundamental limits.', 'Մեկ կայք՝ մեկ հիմնական լեզվով։ Փոխարինում է Fundamental-ի սահմանները։', 'Один сайт на одном основном языке. Заменяет лимиты Fundamental.') },
      { featureKey: 'seo_keywords', status: 'included', quantity: 100 },
      { featureKey: 'seo_pages', status: 'included', quantity: 10, cadence: 'monthly', detail: L('Replaces the 5-page allowance.', 'Փոխարինում է 5 էջի սահմանը։', 'Заменяет лимит в 5 страниц.') },
      { featureKey: 'seo_tech', status: 'included', quantity: 5, cadence: 'monthly', detail: L('Replaces the 3-hour allowance.', 'Փոխարինում է 3 ժամի սահմանը։', 'Заменяет лимит в 3 часа.') },
      { featureKey: 'seo_strategy', status: 'included', cadence: 'ongoing', detail: L('Content strategy and keyword-to-page mapping, reviewed as priorities change.', 'Բովանդակային ռազմավարություն և բանալի բառերի բաշխում էջերով՝ վերանայվող առաջնահերթությունների համաձայն։', 'Контент-стратегия и распределение ключей по страницам с пересмотром по мере изменения приоритетов.') },
      { featureKey: 'seo_articles', status: 'included', quantity: 2, cadence: 'monthly', detail: L('Typically 800–1,200 words each: topic research, a content brief, human-reviewed writing, metadata, internal links, CMS upload and two revision rounds.', 'Յուրաքանչյուրը սովորաբար 800–1200 բառ՝ թեմայի հետազոտություն, բրիֆ, մարդու կողմից ստուգված տեքստ, մետատվյալներ, ներքին հղումներ, տեղադրում CMS-ում և երկու խմբագրման փուլ։', 'Обычно 800–1200 слов: исследование темы, бриф, текст с проверкой человеком, метаданные, перелинковка, загрузка в CMS и два раунда правок.') },
      { featureKey: 'seo_linking', status: 'included', cadence: 'monthly', detail: L('Internal linking improvements on the pages worked on during the month.', 'Ներքին հղումների բարելավում ամսվա ընթացքում մշակված էջերում։', 'Улучшение перелинковки на страницах, с которыми работали в течение месяца.') },
      { featureKey: 'seo_citations', status: 'included', quantity: 3, cadence: 'monthly', detail: L('Submissions or corrections for eligible local businesses; otherwise up to 3 existing-page refreshes by agreement. Acceptance by directories is not guaranteed.', 'Գրանցումներ կամ ուղղումներ համապատասխան տեղական բիզնեսների համար, հակառակ դեպքում՝ մինչև 3 առկա էջի թարմացում՝ համաձայնությամբ։ Կատալոգների կողմից ընդունումը երաշխավորված չէ։', 'Размещения или исправления для подходящих локальных бизнесов; иначе — до 3 обновлений страниц по согласованию. Публикация в каталогах не гарантируется.') },
      { featureKey: 'seo_competitors', status: 'included', quantity: 3, detail: L('Initial analysis, quarterly refreshes and monthly monitoring of material changes.', 'Սկզբնական վերլուծություն, եռամսյակային թարմացում և էական փոփոխությունների ամսական դիտարկում։', 'Первичный анализ, ежеквартальное обновление и ежемесячный мониторинг значимых изменений.') },
      { featureKey: 'seo_consult', status: 'included', quantity: 45, cadence: 'monthly', detail: L('A consultation of up to 45 minutes with the monthly SEO report.', 'Մինչև 45 րոպե խորհրդատվություն՝ ամսական SEO հաշվետվության հետ։', 'Консультация до 45 минут вместе с ежемесячным SEO-отчётом.') },
      { featureKey: 'seo_outreach', status: 'not_included', detail: L('Digital PR outreach is not included unless agreed separately.', 'Թվային PR-ը ներառված չէ, եթե առանձին համաձայնեցված չէ։', 'Digital PR не входит, если не согласован отдельно.') },
    ],
    boundaries: [
      L('You review factual and specialist claims. New photography, expert interviews, paid image licences and translation are separate.', 'Փաստացի և մասնագիտական պնդումները ստուգում եք դուք։ Նոր լուսանկարները, փորձագետների հարցազրույցները, վճարովի պատկերները և թարգմանությունը առանձին են։', 'Фактические и экспертные утверждения проверяете вы. Новые фото, интервью с экспертами, платные изображения и перевод — отдельно.'),
      L('Paid directory fees need your approval.', 'Կատալոգների վճարովի տեղադրումները պահանջում են ձեր հաստատումը։', 'Платные размещения в каталогах — только с вашего согласия.'),
      L('Additional content, major development, migrations and digital PR outreach are excluded unless separately agreed.', 'Լրացուցիչ բովանդակությունը, խոշոր մշակումը, տեղափոխումները և թվային PR-ը ներառված չեն, եթե առանձին համաձայնեցված չեն։', 'Дополнительный контент, крупная разработка, миграции и digital PR не входят без отдельного согласования.'),
    ],
  },
  {
    key: 'seo-authority',
    category: 'seo',
    order: 60,
    name: L('Authority', 'Authority', 'Authority'),
    tagline: L('For competitive brands aiming for market leadership', 'Մրցունակ բրենդների համար, որոնք ձգտում են շուկայում առաջատար լինել', 'Для конкурентных брендов, стремящихся к лидерству'),
    summary: L(
      'For competitive brands aiming for market leadership in search.',
      'Մրցունակ բրենդների համար, որոնք ձգտում են առաջատար լինել որոնման մեջ։',
      'Для брендов в конкурентных нишах, стремящихся лидировать в поиске.',
    ),
    prices: { m1: 499000, m3: 480000, m6: 475000, m9: 445000, m12: 420000 },
    inherits: 'seo-vision',
    contact: 'edgar',
    features: [
      { featureKey: 'seo_site', status: 'included', quantity: 100, detail: L('One website in one primary language.', 'Մեկ կայք՝ մեկ հիմնական լեզվով։', 'Один сайт на одном основном языке.') },
      { featureKey: 'seo_keywords', status: 'included', quantity: 200 },
      { featureKey: 'seo_pages', status: 'included', quantity: 20, cadence: 'monthly', detail: L('Replaces lower-tier allowances.', 'Փոխարինում է ցածր փաթեթների սահմանները։', 'Заменяет лимиты младших пакетов.') },
      { featureKey: 'seo_tech', status: 'included', quantity: 8, cadence: 'monthly', detail: L('Replaces lower-tier allowances.', 'Փոխարինում է ցածր փաթեթների սահմանները։', 'Заменяет лимиты младших пакетов.') },
      { featureKey: 'seo_articles', status: 'included', quantity: 6, cadence: 'monthly', detail: L('6 articles in total per month, replacing the Vision allowance, with the same research, review, length and revision terms.', 'Ամսական ընդհանուր 6 հոդված՝ Vision-ի քանակի փոխարեն, նույն հետազոտության, ստուգման, ծավալի և խմբագրման պայմաններով։', 'Всего 6 статей в месяц вместо объёма Vision, на тех же условиях исследования, проверки, объёма и правок.') },
      { featureKey: 'seo_advanced', status: 'included', cadence: 'ongoing', detail: L('Based on site needs: structured-data validation, duplicate-content patterns, internal linking and template-level recommendations.', 'Կայքի կարիքներից ելնելով՝ կառուցվածքային տվյալների ստուգում, կրկնվող բովանդակության օրինաչափություններ, ներքին հղումներ և ձևանմուշների մակարդակի առաջարկություններ։', 'По потребностям сайта: валидация разметки, дубли, перелинковка и рекомендации на уровне шаблонов.') },
      { featureKey: 'seo_schema', status: 'included', detail: L('Implementation for up to 3 page types during setup, then ongoing checks within the technical hours.', 'Իրականացում մինչև 3 էջի տեսակի համար սկզբնական փուլում, հետո՝ շարունակական ստուգումներ տեխնիկական ժամերի շրջանակում։', 'Внедрение для до 3 типов страниц на старте, далее — проверки в рамках технических часов.') },
      { featureKey: 'seo_outreach', status: 'included', quantity: 10, cadence: 'monthly', detail: L('Research relevant opportunities and send up to 10 personalised pitches or follow-ups; report contacts, responses and earned coverage. A work allowance, not a guarantee of links.', 'Համապատասխան հնարավորությունների հետազոտում և մինչև 10 անհատական առաջարկի կամ հետագա նամակի ուղարկում՝ կոնտակտների, պատասխանների և ստացված հրապարակումների հաշվետվությամբ։ Սա աշխատանքի ծավալ է, ոչ թե հղումների երաշխիք։', 'Поиск релевантных площадок и до 10 персональных питчей или напоминаний; отчёт по контактам, ответам и публикациям. Это объём работы, а не гарантия ссылок.') },
      { featureKey: 'seo_ai', status: 'included', quantity: 10, cadence: 'monthly', detail: L('Clearer answers, stronger factual support, crawlability and content structure; an agreed sample of 10 important queries is monitored where observable. Inclusion is not guaranteed.', 'Ավելի հստակ պատասխաններ, ամուր փաստարկներ, հասանելիություն որոնողական ռոբոտների համար և բովանդակության կառուցվածք․ դիտարկվում է 10 կարևոր հարցման համաձայնեցված ընտրանի, որտեղ հնարավոր է։ Ներառումը երաշխավորված չէ։', 'Более чёткие ответы, подкреплённые факты, доступность для сканирования и структура; отслеживается согласованная выборка из 10 важных запросов, где это возможно. Попадание не гарантируется.') },
      { featureKey: 'seo_competitors', status: 'included', quantity: 5, cadence: 'monthly', detail: L('Up to 5 agreed competitors, with important changes reviewed monthly.', 'Մինչև 5 համաձայնեցված մրցակից՝ կարևոր փոփոխությունների ամսական վերանայմամբ։', 'До 5 согласованных конкурентов с ежемесячным разбором важных изменений.') },
      { featureKey: 'seo_conversion', status: 'included', quantity: 3, cadence: 'monthly', detail: L('Monthly conversion tracking review with up to 3 prioritised recommendations, implemented within the page and technical allowances.', 'Կոնվերսիաների հետևման ամսական վերլուծություն և մինչև 3 առաջնահերթ առաջարկություն՝ իրականացվող էջերի և տեխնիկական ժամերի շրջանակում։', 'Ежемесячный анализ конверсий и до 3 приоритетных рекомендаций, внедряемых в рамках лимитов страниц и часов.') },
      { featureKey: 'seo_consult', status: 'included', quantity: 60, cadence: 'monthly', detail: L('A consultation of up to 60 minutes with the monthly report.', 'Մինչև 60 րոպե խորհրդատվություն՝ ամսական հաշվետվության հետ։', 'Консультация до 60 минут вместе с ежемесячным отчётом.') },
      { featureKey: 'priority_support', status: 'included', detail: L('Acknowledgment within one working day during support hours.', 'Արձագանք մեկ աշխատանքային օրվա ընթացքում՝ աջակցության ժամերին։', 'Ответ в течение одного рабочего дня в часы поддержки.') },
    ],
    boundaries: [
      L('Outreach is a work allowance, not a guarantee of links, placements, rankings or AI-search appearances. Paid placements and third-party fees need separate approval.', 'PR աշխատանքը աշխատանքի ծավալ է, ոչ թե հղումների, հրապարակումների, դիրքերի կամ AI որոնման մեջ հայտնվելու երաշխիք։ Վճարովի տեղադրումները և երրորդ կողմի վճարները պահանջում են առանձին հաստատում։', 'Аутрич — это объём работы, а не гарантия ссылок, публикаций, позиций или появления в AI-поиске. Платные размещения и сторонние расходы — по отдельному согласованию.'),
      L('Large migrations, rebuilds, custom applications, paid experimentation tools and guaranteed A/B test delivery are not included.', 'Խոշոր տեղափոխումները, վերակառուցումները, անհատական հավելվածները, վճարովի փորձարկման գործիքները և երաշխավորված A/B թեստերը ներառված չեն։', 'Крупные миграции, пересборка, собственные приложения, платные инструменты экспериментов и гарантированные A/B-тесты не входят.'),
    ],
  },
  {
    key: 'business-boost',
    category: 'bundle',
    order: 70,
    name: L('Business Boost', 'Business Boost', 'Business Boost'),
    tagline: L('One team for social media and SEO growth', 'Մեկ թիմ՝ սոցցանցերի և SEO աճի համար', 'Одна команда для роста в соцсетях и поиске'),
    summary: L(
      'SMM Dominance and SEO Vision in one coordinated plan, at its own bundle price.',
      'SMM Dominance և SEO Vision մեկ համակարգված փաթեթում՝ իր առանձին գնով։',
      'SMM Dominance и SEO Vision в одном согласованном плане по собственной цене.',
    ),
    prices: { m1: 449000, m3: 430000, m6: 420000, m9: 410000, m12: 389000 },
    components: ['smm-dominance', 'seo-vision'],
    inheritBoundaries: true,
    contact: 'either',
    features: [
      { featureKey: 'bundle_calendar', status: 'included', cadence: 'monthly', detail: L('One shared calendar coordinating social topics, SEO articles and priority pages.', 'Մեկ ընդհանուր օրացույց, որը համակարգում է սոցցանցերի թեմաները, SEO հոդվածները և առաջնահերթ էջերը։', 'Один общий календарь, координирующий темы соцсетей, SEO-статьи и приоритетные страницы.') },
      { featureKey: 'bundle_report', status: 'included', quantity: 60, cadence: 'monthly', detail: L('One consolidated monthly report and one joint review meeting of up to 60 minutes, replacing the separate component meeting.', 'Մեկ միասնական ամսական հաշվետվություն և մինչև 60 րոպե համատեղ հանդիպում՝ առանձին հանդիպումների փոխարեն։', 'Один сводный ежемесячный отчёт и одна совместная встреча до 60 минут вместо отдельных встреч.') },
      { featureKey: 'smm_report', status: 'replaced', replacedBy: 'bundle_report' },
      { featureKey: 'seo_report', status: 'replaced', replacedBy: 'bundle_report', detail: L('Monitoring continues; findings go into the consolidated report.', 'Մոնիթորինգը շարունակվում է, արդյունքները ներառվում են միասնական հաշվետվությունում։', 'Мониторинг продолжается; результаты входят в сводный отчёт.') },
      { featureKey: 'seo_consult', status: 'replaced', replacedBy: 'bundle_report' },
      { featureKey: 'coordination', status: 'included', cadence: 'ongoing', detail: L('Shared coordination between Mariam and Edgar, with one agreed main client contact.', 'Մարիամի և Էդգարի համատեղ համակարգում՝ մեկ համաձայնեցված հիմնական կոնտակտով։', 'Совместная координация Мариам и Эдгара с одним согласованным основным контактом.') },
    ],
    boundaries: [
      L('The same technical task, report or meeting is not counted twice. Social and SEO content quantities stay as their separate component allowances.', 'Նույն տեխնիկական առաջադրանքը, հաշվետվությունը կամ հանդիպումը երկու անգամ չի հաշվվում։ SMM և SEO բովանդակության քանակները մնում են առանձին։', 'Одна и та же задача, отчёт или встреча не считаются дважды. Объёмы SMM- и SEO-контента остаются отдельными.'),
      L('Turning SEO article topics into social posts uses the existing SMM content allowance. Extra formats or translations are quoted.', 'SEO հոդվածների թեմաներից սոցցանցերի հրապարակումներ պատրաստելը կատարվում է SMM բովանդակության քանակի հաշվին։ Լրացուցիչ ձևաչափերը կամ թարգմանությունները գնահատվում են։', 'Адаптация тем SEO-статей в посты идёт в счёт объёма SMM. Дополнительные форматы и переводы оцениваются отдельно.'),
    ],
  },
  {
    key: 'ultra',
    category: 'bundle',
    order: 80,
    name: L('Ultra', 'Ultra', 'Ultra'),
    tagline: L('Full-scale performance with premium support', 'Ամբողջական արդյունավետություն՝ պրեմիում աջակցությամբ', 'Максимальный масштаб и премиальная поддержка'),
    summary: L(
      'SMM Gold and SEO Authority in one strategy, with a quarterly joint review and priority support, at its own bundle price.',
      'SMM Gold և SEO Authority մեկ ռազմավարության մեջ՝ եռամսյակային համատեղ վերանայմամբ և առաջնահերթ աջակցությամբ, իր առանձին գնով։',
      'SMM Gold и SEO Authority в одной стратегии с ежеквартальным совместным разбором и приоритетной поддержкой — по собственной цене.',
    ),
    prices: { m1: 630000, m3: 615000, m6: 610000, m9: 559000, m12: 529000 },
    components: ['smm-gold', 'seo-authority'],
    inheritBoundaries: true,
    contact: 'either',
    features: [
      { featureKey: 'bundle_calendar', status: 'included', cadence: 'monthly', detail: L('One shared strategy and campaign calendar aligning video, social content, search content and conversion priorities.', 'Մեկ ընդհանուր ռազմավարություն և արշավների օրացույց, որը համադրում է տեսանյութերը, սոցցանցերի և որոնողական բովանդակությունը, ինչպես նաև կոնվերսիայի առաջնահերթությունները։', 'Единая стратегия и календарь, объединяющие видео, контент для соцсетей и поиска и приоритеты конверсии.') },
      { featureKey: 'bundle_report', status: 'included', quantity: 60, cadence: 'monthly', detail: L('One consolidated monthly report and one joint review meeting of up to 60 minutes, replacing separate component meetings.', 'Մեկ միասնական ամսական հաշվետվություն և մինչև 60 րոպե համատեղ հանդիպում՝ առանձին հանդիպումների փոխարեն։', 'Один сводный ежемесячный отчёт и одна совместная встреча до 60 минут вместо отдельных встреч.') },
      { featureKey: 'smm_report', status: 'replaced', replacedBy: 'bundle_report' },
      { featureKey: 'smm_meeting', status: 'replaced', replacedBy: 'bundle_report' },
      { featureKey: 'seo_report', status: 'replaced', replacedBy: 'bundle_report', detail: L('Monitoring continues; findings go into the consolidated report.', 'Մոնիթորինգը շարունակվում է, արդյունքները ներառվում են միասնական հաշվետվությունում։', 'Мониторинг продолжается; результаты входят в сводный отчёт.') },
      { featureKey: 'seo_consult', status: 'replaced', replacedBy: 'bundle_report' },
      { featureKey: 'bundle_quarterly', status: 'included', cadence: 'quarterly', detail: L('A joint strategy review every three months.', 'Համատեղ ռազմավարական վերանայում երեք ամիսը մեկ։', 'Совместный пересмотр стратегии раз в три месяца.') },
      { featureKey: 'priority_support', status: 'included', detail: L('Acknowledgment within one working day.', 'Արձագանք մեկ աշխատանքային օրվա ընթացքում։', 'Ответ в течение одного рабочего дня.') },
      { featureKey: 'coordination', status: 'included', cadence: 'ongoing', detail: L('Shared coordination between Mariam and Edgar.', 'Մարիամի և Էդգարի համատեղ համակարգում։', 'Совместная координация Мариам и Эдгара.') },
    ],
    boundaries: [
      L('The same technical task, report or meeting is not counted twice. Social and SEO content quantities stay as their separate component allowances.', 'Նույն տեխնիկական առաջադրանքը, հաշվետվությունը կամ հանդիպումը երկու անգամ չի հաշվվում։ SMM և SEO բովանդակության քանակները մնում են առանձին։', 'Одна и та же задача, отчёт или встреча не считаются дважды. Объёмы SMM- и SEO-контента остаются отдельными.'),
      L('Advertising spend, paid placements, domains, hosting and other external costs remain separate.', 'Գովազդային բյուջեն, վճարովի տեղադրումները, դոմենները, հոսթինգը և այլ արտաքին ծախսերը առանձին են։', 'Рекламный бюджет, платные размещения, домены, хостинг и прочие внешние расходы — отдельно.'),
    ],
  },
  {
    key: 'website-creation',
    category: 'website',
    order: 90,
    name: L('Website Creation', 'Կայքի ստեղծում', 'Создание сайта'),
    tagline: L('With basic SEO setup', 'Հիմնական SEO կարգավորումով', 'С базовой SEO-настройкой'),
    summary: L(
      'A defined, responsive website you can edit yourself, launched with a basic SEO setup.',
      'Հստակ ծավալով ադապտիվ կայք, որը կարող եք ինքնուրույն խմբագրել՝ գործարկված հիմնական SEO կարգավորումով։',
      'Адаптивный сайт с понятным объёмом, который вы сможете редактировать сами, запущенный с базовой SEO-настройкой.',
    ),
    oneTimePrice: 299000,
    contact: 'edgar',
    features: [
      { featureKey: 'web_pages', status: 'included', quantity: 5, cadence: 'one_time', detail: L('In one language, e.g. Home, About, Services, FAQ and Contact. Extra pages use the landing-page add-on rate.', 'Մեկ լեզվով, օրինակ՝ Գլխավոր, Մեր մասին, Ծառայություններ, ՀՏՀ և Կապ։ Լրացուցիչ էջերը՝ լրացուցիչ էջի սակագնով։', 'На одном языке, например: Главная, О нас, Услуги, FAQ и Контакты. Дополнительные страницы — по тарифу доп. страницы.') },
      { featureKey: 'web_responsive', status: 'included', detail: L('Mobile, tablet and desktop, using an agreed visual direction.', 'Բջջային, պլանշետ և համակարգիչ՝ համաձայնեցված վիզուալ ուղղությամբ։', 'Мобильные, планшеты и десктоп в согласованной визуальной концепции.') },
      { featureKey: 'web_cms', status: 'included', detail: L('Edit text, images, contact details, page metadata and supported layout blocks; the controls are explained at handoff.', 'Տեքստերի, պատկերների, կոնտակտների, էջերի մետատվյալների և աջակցվող բլոկների խմբագրում․ կառավարումը բացատրվում է հանձնման ժամանակ։', 'Редактирование текстов, изображений, контактов, метаданных и поддерживаемых блоков; управление объясняем при передаче.') },
      { featureKey: 'web_contact', status: 'included', detail: L('One contact form, phone/WhatsApp links and the social links you supply.', 'Մեկ կապի ձև, հեռախոսի/WhatsApp-ի հղումներ և ձեր տրամադրած սոցցանցերի հղումները։', 'Одна форма связи, ссылки на телефон/WhatsApp и ваши соцсети.') },
      { featureKey: 'web_seo', status: 'included', detail: L('Page titles and descriptions, headings, readable URLs, sitemap, robots settings, indexing checks, image alt text and basic structured data.', 'Էջերի վերնագրեր և նկարագրություններ, ենթավերնագրեր, ընթեռնելի URL-ներ, sitemap, robots, ինդեքսավորման ստուգում, պատկերների alt տեքստեր և հիմնական կառուցվածքային տվյալներ։', 'Title и description, заголовки, понятные URL, sitemap, robots, проверка индексации, alt-тексты и базовая разметка.') },
      { featureKey: 'web_analytics', status: 'included', detail: L('Search Console connection and analytics setup when you provide the accounts and access.', 'Search Console-ի միացում և վերլուծության կարգավորում, եթե տրամադրում եք հաշիվները և հասանելիությունը։', 'Подключение Search Console и аналитики, если вы предоставите аккаунты и доступ.') },
      { featureKey: 'web_revisions', status: 'included', quantity: 2, detail: L('Two consolidated design/content revision rounds, plus browser and mobile checks.', 'Դիզայնի/բովանդակության երկու համախմբված խմբագրման փուլ, ինչպես նաև բրաուզերների և բջջայինի ստուգում։', 'Два сводных раунда правок дизайна/контента и проверка в браузерах и на мобильных.') },
      { featureKey: 'web_training', status: 'included', detail: L('Handoff training and a short editing guide.', 'Հանձնման ուսուցում և խմբագրման կարճ ուղեցույց։', 'Обучение при передаче и краткая инструкция.') },
      { featureKey: 'web_timeline', status: 'included', quantity: 15, quantityMax: 20, detail: L('Counted from receipt of complete approved content, assets, access and the initial payment. Milestones: brief and page map, design approval, build and content entry, revisions and testing, launch and handoff.', 'Հաշվվում է ամբողջական հաստատված բովանդակությունը, նյութերը, հասանելիությունը և նախնական վճարումը ստանալուց հետո։ Փուլեր՝ բրիֆ և էջերի կառուցվածք, դիզայնի հաստատում, մշակում, խմբագրումներ և թեստավորում, գործարկում և հանձնում։', 'Считается с момента получения полного согласованного контента, материалов, доступов и предоплаты. Этапы: бриф и карта страниц, согласование дизайна, разработка, правки и тесты, запуск и передача.') },
      { featureKey: 'web_payment', status: 'included', detail: L('50% before work starts, 50% after acceptance and before public launch.', '50% աշխատանքը սկսելուց առաջ, 50%՝ ընդունումից հետո և հրապարակային գործարկումից առաջ։', '50% до начала работ, 50% после приёмки и до публичного запуска.') },
      { featureKey: 'web_support', status: 'included', quantity: 30, detail: L('Fixes for defects in the delivered scope. New pages, redesigns, content updates and maintenance are quoted separately.', 'Հանձնված ծավալում թերությունների շտկում։ Նոր էջերը, վերադիզայնը, բովանդակության թարմացումները և սպասարկումը գնահատվում են առանձին։', 'Исправление дефектов в рамках сданного объёма. Новые страницы, редизайн, обновления и поддержка — отдельно.') },
    ],
    boundaries: [
      L('Domain, hosting, paid plugins, email services, full copywriting, translations, e-commerce, booking systems, membership, custom applications, advanced animation and ongoing SEO are quoted separately.', 'Դոմենը, հոսթինգը, վճարովի պլագինները, էլ. փոստի ծառայությունները, ամբողջական տեքստերը, թարգմանությունները, էլեկտրոնային առևտուրը, ամրագրման համակարգերը, անդամակցությունը, անհատական հավելվածները, բարդ անիմացիան և շարունակական SEO-ն գնահատվում են առանձին։', 'Домен, хостинг, платные плагины, почтовые сервисы, полный копирайтинг, переводы, интернет-магазин, бронирование, личные кабинеты, собственные приложения, сложная анимация и постоянное SEO — отдельно.'),
      L('You provide approved copy, brand files, images and account access. Additional languages and larger projects receive a custom proposal.', 'Հաստատված տեքստերը, բրենդի ֆայլերը, պատկերները և հաշիվների հասանելիությունը տրամադրում եք դուք։ Լրացուցիչ լեզուների և ավելի մեծ նախագծերի համար պատրաստում ենք անհատական առաջարկ։', 'Вы предоставляете согласованные тексты, файлы бренда, изображения и доступы. Для дополнительных языков и крупных проектов — индивидуальное предложение.'),
    ],
  },
]

export const addons: {
  key: string
  price: number
  priceIsFrom?: boolean
  units?: number
  order: number
  name: L10n
  description: L10n
  relatedFeatureKey?: string
  appliesTo?: string[]
  contact?: 'mariam' | 'edgar'
}[] = [
  {
    key: 'reel',
    price: 25000,
    order: 10,
    name: L('Reel with full equipment', 'Reel՝ ամբողջական սարքավորումով', 'Reels с полным оборудованием'),
    description: L('One agreed shoot of up to one hour, a video of up to 45 seconds and two revision rounds.', 'Մեկ համաձայնեցված նկարահանում՝ մինչև մեկ ժամ, մինչև 45 վայրկյան տեսանյութ և երկու խմբագրման փուլ։', 'Одна согласованная съёмка до часа, видео до 45 секунд и два раунда правок.'),
    relatedFeatureKey: 'smm_videos',
    contact: 'mariam',
  },
  {
    key: 'reel-4',
    price: 89000,
    units: 4,
    order: 20,
    name: L('4 reels with full equipment', '4 Reel՝ ամբողջական սարքավորումով', '4 Reels с полным оборудованием'),
    description: L('One agreed shoot of up to two hours for all four, each video up to 45 seconds, two revision rounds.', 'Մեկ համաձայնեցված նկարահանում՝ մինչև երկու ժամ, չորսի համար, յուրաքանչյուր տեսանյութ՝ մինչև 45 վայրկյան, երկու խմբագրման փուլ։', 'Одна согласованная съёмка до двух часов на все четыре, каждое видео до 45 секунд, два раунда правок.'),
    relatedFeatureKey: 'smm_videos',
    contact: 'mariam',
  },
  {
    key: 'article',
    price: 39000,
    priceIsFrom: true,
    order: 30,
    name: L('Optimised blog article', 'Օպտիմալացված բլոգային հոդված', 'Оптимизированная статья для блога'),
    description: L('A keyword-focused article of a standard 800–1,200 words in one language, with research, metadata, internal links, CMS upload and two revision rounds. Specialist briefs are quoted separately.', 'Բանալի բառերի վրա հիմնված ստանդարտ 800–1200 բառանոց հոդված մեկ լեզվով՝ հետազոտությամբ, մետատվյալներով, ներքին հղումներով, CMS-ում տեղադրմամբ և երկու խմբագրման փուլով։ Մասնագիտական թեմաները գնահատվում են առանձին։', 'Статья под ключевые запросы стандартного объёма 800–1200 слов на одном языке: исследование, метаданные, перелинковка, загрузка в CMS и два раунда правок. Экспертные темы оцениваются отдельно.'),
    relatedFeatureKey: 'seo_articles',
    contact: 'edgar',
  },
  {
    key: 'article-4',
    price: 119000,
    units: 4,
    order: 40,
    name: L('4 blog articles', '4 բլոգային հոդված', '4 статьи для блога'),
    description: L('Four standard 800–1,200-word articles in one language, with research, metadata, internal links, CMS upload and two revision rounds.', 'Չորս ստանդարտ 800–1200 բառանոց հոդված մեկ լեզվով՝ հետազոտությամբ, մետատվյալներով, ներքին հղումներով, CMS-ում տեղադրմամբ և երկու խմբագրման փուլով։', 'Четыре стандартные статьи по 800–1200 слов на одном языке: исследование, метаданные, перелинковка, загрузка в CMS и два раунда правок.'),
    relatedFeatureKey: 'seo_articles',
    contact: 'edgar',
  },
  {
    key: 'landing-page',
    price: 79000,
    order: 50,
    name: L('Additional landing page', 'Լրացուցիչ landing էջ', 'Дополнительная посадочная страница'),
    description: L('One standard page with up to 6 sections on an existing website, using its design system: responsive layout, basic metadata and two revision rounds. Custom functionality is separate.', 'Մեկ ստանդարտ էջ՝ մինչև 6 բաժնով, առկա կայքում՝ դրա դիզայն համակարգով․ ադապտիվ դասավորություն, հիմնական մետատվյալներ և երկու խմբագրման փուլ։ Անհատական ֆունկցիոնալը առանձին է։', 'Одна стандартная страница до 6 блоков на существующем сайте в его дизайн-системе: адаптивная вёрстка, базовые метаданные и два раунда правок. Нестандартный функционал — отдельно.'),
    relatedFeatureKey: 'web_pages',
    contact: 'edgar',
  },
]

export const terms: L10n[] = [
  L('Fees are in AMD. Advertising spend, paid tools, third-party placements, studio hire, models, travel outside Yerevan, hosting and domains are separate unless your proposal explicitly includes them.', 'Վճարները ՀՀ դրամով են։ Գովազդային բյուջեն, վճարովի գործիքները, երրորդ կողմի տեղադրումները, ստուդիան, մոդելները, Երևանից դուրս ճանապարհորդությունը, հոսթինգը և դոմենները առանձին են, եթե ձեր առաջարկում հստակ ներառված չեն։', 'Цены в драмах (AMD). Рекламный бюджет, платные инструменты, сторонние размещения, студия, модели, выезды за пределы Еревана, хостинг и домены — отдельно, если они явно не включены в ваше предложение.'),
  L('Monthly allowances apply to one business and do not roll over. Extra work needs an agreed quote. Articles included in an SEO plan are never charged again as add-ons.', 'Ամսական քանակները վերաբերում են մեկ բիզնեսի և չեն փոխանցվում հաջորդ ամիս։ Լրացուցիչ աշխատանքը պահանջում է համաձայնեցված գնահատում։ SEO փաթեթում ներառված հոդվածները երբեք կրկին չեն վճարվում որպես լրացուցիչ ծառայություն։', 'Месячные объёмы действуют для одного бизнеса и не переносятся. Дополнительная работа — по согласованной оценке. Статьи, входящие в SEO-пакет, никогда не оплачиваются повторно как дополнение.'),
  L('Campaign content is produced in one agreed language. Translations and extra language versions are quoted separately.', 'Արշավների բովանդակությունը պատրաստվում է մեկ համաձայնեցված լեզվով։ Թարգմանությունները և լրացուցիչ լեզվային տարբերակները գնահատվում են առանձին։', 'Контент кампаний готовится на одном согласованном языке. Переводы и дополнительные языковые версии оцениваются отдельно.'),
  L('You provide account access, brand assets, product facts and timely approvals. Publishing starts after approval; late approvals can move delivery dates.', 'Դուք տրամադրում եք հաշիվների հասանելիություն, բրենդի նյութեր, ապրանքի մասին տեղեկություններ և ժամանակին հաստատումներ։ Հրապարակումը սկսվում է հաստատումից հետո, ուշացած հաստատումները կարող են տեղաշարժել ժամկետները։', 'Вы предоставляете доступы, материалы бренда, факты о продукте и своевременные согласования. Публикация — после согласования; задержки могут сдвинуть сроки.'),
  L('Standard support: Monday to Friday, 10:00–18:00 Armenia time, with acknowledgment within two working days. Some packages include priority support.', 'Ստանդարտ աջակցություն՝ երկուշաբթիից ուրբաթ, 10:00–18:00 (Հայաստանի ժամանակով), արձագանք երկու աշխատանքային օրվա ընթացքում։ Որոշ փաթեթներ ներառում են առաջնահերթ աջակցություն։', 'Стандартная поддержка: пн–пт, 10:00–18:00 по времени Армении, ответ в течение двух рабочих дней. Некоторые пакеты включают приоритетную поддержку.'),
  L('Results depend on your business, competition, budget and implementation. No package promises rankings, sales, follower counts or AI-search inclusion.', 'Արդյունքները կախված են ձեր բիզնեսից, մրցակցությունից, բյուջեից և իրականացումից։ Ոչ մի փաթեթ չի խոստանում դիրքեր, վաճառք, հետևորդների քանակ կամ ներառում AI որոնման մեջ։', 'Результаты зависят от бизнеса, конкуренции, бюджета и внедрения. Ни один пакет не гарантирует позиции, продажи, число подписчиков или попадание в AI-поиск.'),
]

/** Private commercial review list (admin only). */
export const reviewChecklist = [
  'Confirm staff capacity and margin for shoots (2h Dominance, 3h Gold), the 4 Gold videos, community management (150 interactions), Meta campaign management (1/2/3 campaigns), articles (2 Vision, 6 Authority), technical hours (3/5/8) and outreach (10 pitches).',
  'Confirm every proposed count: feed pieces 8/10/16, story frames 8/10/16, edited photos 8/15, indexable URLs 25/50/100, keywords 50/100/200, optimised pages 5/10/20, competitors 3/5, AI-search sample 10 queries.',
  'Confirm working hours (Mon–Fri 10:00–18:00), acknowledgment targets (2 working days standard, 1 working day priority) and the Gold community response aim.',
  'Confirm language limits (client content in one language) and ad-spend separation wording.',
  'Website Creation: confirm 5 pages, 15–20 working-day timeline, 50/50 payment schedule and 30-day defect support.',
  'Add-ons: confirm reel shoot durations (1h single / 2h bundle), 45-second limit, article length 800–1,200 words and landing page up to 6 sections.',
  'Prices were NOT revalidated against the new workload — check delivery cost per package before approving.',
  'SEO Fundamental remains unavailable for 9 and 12 months (as in the original price list).',
]
