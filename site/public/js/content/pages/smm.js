import { faq } from '../faq.js'
import { contactSection } from '../sections.js'

export const smm = {
  file: 'smm.html',
  meta: {
    title: {
      en: 'Social media marketing packages',
      hy: 'Սոցիալական մեդիա մարքեթինգի փաթեթներ',
      ru: 'Пакеты SMM',
    },
    description: {
      en: 'SMM packages Start, Dominance and Gold: content, stories, production and Meta ads, with monthly reports. Compare prices for 1–12 months.',
      hy: 'SMM փաթեթներ Start, Dominance և Gold՝ բովանդակություն, սթորիներ, նկարահանումներ և Meta գովազդ՝ ամսական հաշվետվություններով։',
      ru: 'Пакеты SMM Start, Dominance и Gold: контент, сторис, продакшн и реклама в Meta с ежемесячными отчётами.',
    },
  },
  sections: [
    {
      type: 'hero',
      heading: {
        en: 'Social media people *stop scrolling for.*',
        hy: 'Սոցցանցեր, որոնց համար մարդիկ *դադարում են թերթել։*',
        ru: 'Соцсети, ради которых *перестают листать.*',
      },
      subheading: {
        en: 'Planned content, strong visuals and steady publishing on Instagram, Facebook and TikTok — with reports that show what worked.',
        hy: 'Պլանավորված բովանդակություն, ուժեղ վիզուալներ և կայուն հրապարակումներ Instagram-ում, Facebook-ում և TikTok-ում՝ հաշվետվություններով, որոնք ցույց են տալիս, թե ինչն աշխատեց։',
        ru: 'Продуманный контент, сильные визуалы и стабильные публикации в Instagram, Facebook и TikTok — с отчётами о том, что сработало.',
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
            en: 'Contact Mariam',
            hy: 'Կապվել Մարիամի հետ',
            ru: 'Написать Мариам',
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
        en: 'Consistency beats *bursts.*',
        hy: 'Կայունությունը հաղթում է *պոռթկումներին։*',
        ru: 'Постоянство сильнее *всплесков.*',
      },
      body: {
        en: 'Audiences trust brands that show up regularly with something worth seeing. Our SMM packages give you a dependable rhythm of content, a plan behind it, and regular numbers to steer by.',
        hy: 'Լսարանը վստահում է այն բրենդներին, որոնք կանոնավոր հանդես են գալիս արժեքավոր բովանդակությամբ։ Մեր SMM փաթեթները տալիս են բովանդակության կայուն ռիթմ, դրա հետևում կանգնած պլան և կանոնավոր թվեր՝ ուղղություն պահելու համար։',
        ru: 'Аудитория доверяет брендам, которые регулярно показывают что-то стоящее. Наши SMM-пакеты дают стабильный ритм контента, план за ним и регулярные цифры для управления.',
      },
    },
    {
      type: 'pricing',
      id: 'pricing',
      background: 'surface',
      heading: {
        en: 'Choose your *rhythm*',
        hy: 'Ընտրեք ձեր *ռիթմը*',
        ru: 'Выберите свой *ритм*',
      },
      defaultCategory: 'smm',
      defaultDuration: 6,
      lockCategory: true,
      showAddons: true,
    },
    {
      type: 'faq',
      width: 'narrow',
      heading: {
        en: 'SMM *questions*',
        hy: 'SMM *հարցեր*',
        ru: 'Вопросы о *SMM*',
      },
      items: [
        {
          question: {
            en: 'Which platforms do you manage?',
            hy: 'Ո՞ր հարթակներն եք վարում',
            ru: 'Какие платформы вы ведёте?',
          },
          answer: {
            en: 'We work with Instagram, Facebook and TikTok. The platforms included in each package are listed in its scope; ask us if you need another one.',
            hy: 'Աշխատում ենք Instagram-ի, Facebook-ի և TikTok-ի հետ։ Յուրաքանչյուր փաթեթում ներառված հարթակները նշված են դրա ծավալում․ եթե այլ հարթակ է պետք, գրեք մեզ։',
            ru: 'Мы работаем с Instagram, Facebook и TikTok. Платформы каждого пакета указаны в его объёме; если нужна другая — напишите нам.',
          },
        },
        {
          question: {
            en: 'Can I add extra videos?',
            hy: 'Կարո՞ղ եմ ավելացնել լրացուցիչ տեսանյութեր',
            ru: 'Можно добавить видео?',
          },
          answer: {
            en: 'Yes — Reels with full equipment are available as add-ons, individually or as a bundle of four.',
            hy: 'Այո, ամբողջական սարքավորումով Reels-ը հասանելի է որպես լրացուցիչ ծառայություն՝ առանձին կամ չորսի փաթեթով։',
            ru: 'Да — Reels с полным оборудованием доступны как дополнение, по одному или набором из четырёх.',
          },
        },
        faq.contractLength,
      ],
    },
    contactSection({
      heading: { en: 'Talk to *Mariam*', hy: 'Խոսեք *Մարիամի* հետ', ru: 'Поговорите с *Мариам*' },
      service: 'smm',
    }),
  ],
}
