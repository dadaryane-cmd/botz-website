/**
 * Package finder: questions, and the scoring rules that map answers to packages.
 */
export const finder = {
  questions: [
    {
      key: 'goal',
      role: 'normal',
      label: {
        en: 'What matters most right now?',
        hy: 'Ի՞նչն է հիմա ամենակարևորը',
        ru: 'Что сейчас важнее всего?',
      },
      options: [
        {
          value: 'social',
          label: {
            en: 'Being seen on social media',
            hy: 'Տեսանելի լինել սոցցանցերում',
            ru: 'Быть заметным в соцсетях',
          },
        },
        {
          value: 'search',
          label: {
            en: 'Being found on Google',
            hy: 'Գտնվել Google-ում',
            ru: 'Находиться в Google',
          },
        },
        {
          value: 'both',
          label: {
            en: 'Both social and search',
            hy: 'Եվ սոցցանցեր, և որոնում',
            ru: 'И соцсети, и поиск',
          },
        },
        {
          value: 'site',
          label: {
            en: 'A new website',
            hy: 'Նոր կայք',
            ru: 'Новый сайт',
          },
        },
      ],
    },
    {
      key: 'website',
      role: 'normal',
      label: {
        en: 'Do you have a website today?',
        hy: 'Այսօր կայք ունե՞ք',
        ru: 'Есть ли у вас сайт?',
      },
      options: [
        {
          value: 'yes',
          label: {
            en: 'Yes, and it works well',
            hy: 'Այո, և այն լավ է աշխատում',
            ru: 'Да, и он работает хорошо',
          },
        },
        {
          value: 'outdated',
          label: {
            en: 'Yes, but it is outdated',
            hy: 'Այո, բայց հնացած է',
            ru: 'Да, но он устарел',
          },
        },
        {
          value: 'no',
          label: {
            en: 'Not yet',
            hy: 'Դեռ ոչ',
            ru: 'Пока нет',
          },
        },
      ],
    },
    {
      key: 'social',
      role: 'normal',
      label: {
        en: 'How active are your social accounts?',
        hy: 'Որքանո՞վ են ակտիվ ձեր սոցցանցերը',
        ru: 'Насколько активны ваши соцсети?',
      },
      options: [
        {
          value: 'none',
          label: {
            en: 'We are just starting',
            hy: 'Նոր ենք սկսում',
            ru: 'Только начинаем',
          },
        },
        {
          value: 'irregular',
          label: {
            en: 'We post now and then',
            hy: 'Հրապարակում ենք երբեմն',
            ru: 'Публикуем время от времени',
          },
        },
        {
          value: 'active',
          label: {
            en: 'Active, ready to grow',
            hy: 'Ակտիվ ենք, պատրաստ աճի',
            ru: 'Активны и готовы расти',
          },
        },
      ],
    },
    {
      key: 'production',
      role: 'normal',
      label: {
        en: 'Do you need photo or video production?',
        hy: 'Ֆոտո կամ վիդեո նկարահանում պե՞տք է',
        ru: 'Нужна ли фото- или видеосъёмка?',
      },
      options: [
        {
          value: 'none',
          label: {
            en: 'No, we have our own material',
            hy: 'Ոչ, ունենք մեր նյութերը',
            ru: 'Нет, есть свои материалы',
          },
        },
        {
          value: 'photo',
          label: {
            en: 'Regular photos',
            hy: 'Կանոնավոր լուսանկարներ',
            ru: 'Регулярные фото',
          },
        },
        {
          value: 'video',
          label: {
            en: 'Short-form video too',
            hy: 'Նաև կարճ տեսանյութեր',
            ru: 'И короткие видео',
          },
        },
      ],
    },
    {
      key: 'budget',
      role: 'budget',
      label: {
        en: 'What monthly budget do you have for our fee?',
        hy: 'Ի՞նչ ամսական բյուջե ունեք մեր վճարի համար',
        ru: 'Какой месячный бюджет на наши услуги?',
      },
      help: {
        en: 'Advertising spend is separate.',
        hy: 'Գովազդային բյուջեն առանձին է։',
        ru: 'Рекламный бюджет — отдельно.',
      },
      options: [
        {
          value: 'b100',
          label: {
            en: 'Up to 100,000 ֏',
            hy: 'Մինչև 100,000 ֏',
            ru: 'До 100 000 ֏',
          },
          budgetMax: 100000,
        },
        {
          value: 'b200',
          label: {
            en: 'Up to 200,000 ֏',
            hy: 'Մինչև 200,000 ֏',
            ru: 'До 200 000 ֏',
          },
          budgetMax: 200000,
        },
        {
          value: 'b400',
          label: {
            en: 'Up to 400,000 ֏',
            hy: 'Մինչև 400,000 ֏',
            ru: 'До 400 000 ֏',
          },
          budgetMax: 400000,
        },
        {
          value: 'b700',
          label: {
            en: 'Up to 700,000 ֏',
            hy: 'Մինչև 700,000 ֏',
            ru: 'До 700 000 ֏',
          },
          budgetMax: 700000,
        },
        {
          value: 'unsure',
          label: {
            en: 'Not sure yet',
            hy: 'Դեռ չգիտեմ',
            ru: 'Пока не знаю',
          },
        },
      ],
    },
    {
      key: 'term',
      role: 'duration',
      label: {
        en: 'How long would you like to work together?',
        hy: 'Որքա՞ն ժամանակ կցանկանայիք համագործակցել',
        ru: 'Как долго вы хотели бы работать вместе?',
      },
      options: [
        {
          value: 'm1',
          label: {
            en: '1 month',
            hy: '1 ամիս',
            ru: '1 месяц',
          },
          months: 1,
        },
        {
          value: 'm3',
          label: {
            en: '3 months',
            hy: '3 ամիս',
            ru: '3 месяца',
          },
          months: 3,
        },
        {
          value: 'm6',
          label: {
            en: '6 months',
            hy: '6 ամիս',
            ru: '6 месяцев',
          },
          months: 6,
        },
        {
          value: 'm9',
          label: {
            en: '9 months',
            hy: '9 ամիս',
            ru: '9 месяцев',
          },
          months: 9,
        },
        {
          value: 'm12',
          label: {
            en: '12 months',
            hy: '12 ամիս',
            ru: '12 месяцев',
          },
          months: 12,
        },
      ],
    },
  ],
  rules: [
    {
      key: 'social-start',
      packageKey: 'smm-start',
      points: 2,
      when: [
        {
          question: 'goal',
          values: ['social'],
        },
      ],
      reason: {
        en: 'You want a steady social presence.',
        hy: 'Ցանկանում եք կայուն ներկայություն սոցցանցերում։',
        ru: 'Вам нужно стабильное присутствие в соцсетях.',
      },
    },
    {
      key: 'social-dominance',
      packageKey: 'smm-dominance',
      points: 3,
      when: [
        {
          question: 'goal',
          values: ['social'],
        },
      ],
      reason: {
        en: 'Strong creative direction for steady social growth.',
        hy: 'Ուժեղ կրեատիվ ուղղություն՝ սոցցանցերում կայուն աճի համար։',
        ru: 'Сильная креативная концепция для стабильного роста в соцсетях.',
      },
    },
    {
      key: 'social-gold',
      packageKey: 'smm-gold',
      points: 2,
      when: [
        {
          question: 'goal',
          values: ['social'],
        },
      ],
      reason: {
        en: 'Full-service social media across several platforms.',
        hy: 'Սոցցանցերի ամբողջական սպասարկում մի քանի հարթակում։',
        ru: 'Полный сервис в соцсетях на нескольких платформах.',
      },
    },
    {
      key: 'new-start',
      packageKey: 'smm-start',
      points: 2,
      when: [
        {
          question: 'social',
          values: ['none', 'irregular'],
        },
      ],
      reason: {
        en: 'Start builds a consistent rhythm from the ground up.',
        hy: 'Start-ը զրոյից ստեղծում է կայուն ռիթմ։',
        ru: 'Start выстраивает стабильный ритм с нуля.',
      },
    },
    {
      key: 'active-grow',
      packageKey: 'smm-dominance',
      points: 1,
      when: [
        {
          question: 'social',
          values: ['active'],
        },
      ],
      reason: {
        en: 'Your accounts are active and ready for more.',
        hy: 'Ձեր հաշիվներն ակտիվ են և պատրաստ են ավելիին։',
        ru: 'Ваши аккаунты активны и готовы к большему.',
      },
    },
    {
      key: 'photo',
      packageKey: 'smm-dominance',
      points: 2,
      when: [
        {
          question: 'production',
          values: ['photo'],
        },
      ],
      reason: {
        en: 'Built for brands that need regular production support.',
        hy: 'Նախատեսված է կանոնավոր արտադրական աջակցության կարիք ունեցող բրենդների համար։',
        ru: 'Для брендов, которым нужен регулярный продакшн.',
      },
    },
    {
      key: 'video',
      packageKey: 'smm-gold',
      points: 3,
      when: [
        {
          question: 'production',
          values: ['video'],
        },
      ],
      reason: {
        en: 'Gold is our most complete social media package.',
        hy: 'Gold-ը մեր ամենաամբողջական SMM փաթեթն է։',
        ru: 'Gold — наш самый полный SMM-пакет.',
      },
    },
    {
      key: 'video-ultra',
      packageKey: 'ultra',
      points: 1,
      when: [
        {
          question: 'production',
          values: ['video'],
        },
        {
          question: 'goal',
          values: ['both'],
        },
      ],
      reason: {
        en: 'Full-scale social and search in one plan.',
        hy: 'Ամբողջական SMM և որոնում մեկ փաթեթում։',
        ru: 'Полный SMM и поиск в одном плане.',
      },
    },
    {
      key: 'search-fundamental',
      packageKey: 'seo-fundamental',
      points: 2,
      when: [
        {
          question: 'goal',
          values: ['search'],
        },
      ],
      reason: {
        en: 'A technical foundation is the first step in search.',
        hy: 'Տեխնիկական հիմքը որոնման մեջ առաջին քայլն է։',
        ru: 'Технический фундамент — первый шаг в поиске.',
      },
    },
    {
      key: 'search-vision',
      packageKey: 'seo-vision',
      points: 3,
      when: [
        {
          question: 'goal',
          values: ['search'],
        },
      ],
      reason: {
        en: 'Regular content widens the searches you appear for.',
        hy: 'Կանոնավոր բովանդակությունն ընդլայնում է այն որոնումները, որտեղ հայտնվում եք։',
        ru: 'Регулярный контент расширяет круг запросов, где вы появляетесь.',
      },
    },
    {
      key: 'search-authority',
      packageKey: 'seo-authority',
      points: 2,
      when: [
        {
          question: 'goal',
          values: ['search'],
        },
        {
          question: 'website',
          values: ['yes'],
        },
      ],
      reason: {
        en: 'An established site can compete for tougher searches.',
        hy: 'Կայացած կայքը կարող է մրցել ավելի բարդ որոնումներում։',
        ru: 'Сложившийся сайт может бороться за конкурентные запросы.',
      },
    },
    {
      key: 'search-no-site',
      packageKey: 'website-creation',
      points: 3,
      when: [
        {
          question: 'goal',
          values: ['search'],
        },
        {
          question: 'website',
          values: ['no'],
        },
      ],
      reason: {
        en: 'SEO needs a site you control — we can build it first or alongside.',
        hy: 'SEO-ին անհրաժեշտ է ձեր վերահսկած կայք․ կարող ենք այն ստեղծել նախապես կամ զուգահեռ։',
        ru: 'Для SEO нужен ваш сайт — мы можем сделать его заранее или параллельно.',
      },
    },
    {
      key: 'search-no-site-seo',
      packageKey: 'seo-fundamental',
      points: 1,
      when: [
        {
          question: 'goal',
          values: ['search'],
        },
        {
          question: 'website',
          values: ['no'],
        },
      ],
      reason: {
        en: 'SEO can start alongside a new website.',
        hy: 'SEO-ն կարող է սկսվել նոր կայքի հետ զուգահեռ։',
        ru: 'SEO можно начать параллельно с созданием сайта.',
      },
    },
    {
      key: 'both-boost',
      packageKey: 'business-boost',
      points: 4,
      when: [
        {
          question: 'goal',
          values: ['both'],
        },
      ],
      reason: {
        en: 'One coordinated plan for social and search.',
        hy: 'Մեկ համակարգված փաթեթ սոցցանցերի և որոնման համար։',
        ru: 'Один согласованный план для соцсетей и поиска.',
      },
    },
    {
      key: 'both-ultra',
      packageKey: 'ultra',
      points: 3,
      when: [
        {
          question: 'goal',
          values: ['both'],
        },
      ],
      reason: {
        en: 'Full-scale social and search with priority support.',
        hy: 'Ամբողջական SMM և SEO՝ առաջնահերթ աջակցությամբ։',
        ru: 'Максимальный SMM и SEO с приоритетной поддержкой.',
      },
    },
    {
      key: 'site',
      packageKey: 'website-creation',
      points: 5,
      when: [
        {
          question: 'goal',
          values: ['site'],
        },
      ],
      reason: {
        en: 'You want a new website.',
        hy: 'Ցանկանում եք նոր կայք։',
        ru: 'Вам нужен новый сайт.',
      },
    },
    {
      key: 'site-outdated',
      packageKey: 'website-creation',
      points: 2,
      when: [
        {
          question: 'website',
          values: ['outdated', 'no'],
        },
      ],
      reason: {
        en: 'A refreshed website gives every channel a better place to send people.',
        hy: 'Թարմացված կայքը յուրաքանչյուր ալիքի համար ավելի լավ վայր է՝ մարդկանց ուղղորդելու։',
        ru: 'Обновлённый сайт — лучшее место, куда вести людей из любых каналов.',
      },
    },
  ],
}
