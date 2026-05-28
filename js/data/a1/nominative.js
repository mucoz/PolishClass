const A1_NOMINATIVE = {
  templates: [
    {
      pattern: 'To jest ____ {nom}.',
      translation: 'This is ____ {en}.',
      hint: '(adjective_base) — nominative, {gender}',
      gender: null,
    },
    {
      pattern: '____ {nom} jest nowy.',
      translation: '____ {en} is new.',
      hint: '(adjective_base) — nominative, {gender}',
      gender: null,
    },
    {
      pattern: 'Tu jest ____ {nom}.',
      translation: 'Here is ____ {en}.',
      hint: '(adjective_base) — nominative, {gender}',
      gender: null,
    },
    {
      pattern: '{nom} jest ____ i miły.',
      translation: '{en} is ____ and nice.',
      hint: '(adjective_base) — nominative, {gender}',
      gender: null,
    },
  ],
  examples: [
    {
      sentence: 'To jest nowy student.',
      translation: 'This is a new student.',
      explanation: '"nowy" — masculine nominative, agrees with "student" (masc.)',
      themes: ['general', 'zawody', 'ludzie'],
    },
    {
      sentence: 'To jest nowa nauczycielka.',
      translation: 'This is a new teacher.',
      explanation: '"nowa" — feminine nominative, agrees with "nauczycielka" (fem.)',
      themes: ['general', 'zawody', 'ludzie'],
    },
    {
      sentence: 'To jest nowe dziecko.',
      translation: 'This is a new child.',
      explanation: '"nowe" — neuter nominative, agrees with "dziecko" (neut.)',
      themes: ['general', 'ludzie', 'rodzina'],
    },
    {
      sentence: 'To jest dobry lekarz.',
      translation: 'This is a good doctor.',
      explanation: '"dobry" — masculine nominative, agrees with "lekarz" (masc.)',
      themes: ['general', 'zawody'],
    },
    {
      sentence: 'To jest dobra książka.',
      translation: 'This is a good book.',
      explanation: '"dobra" — feminine nominative, agrees with "książka" (fem.)',
      themes: ['general', 'przedmioty'],
    },
    {
      sentence: 'To jest dobre krzesło.',
      translation: 'This is a good chair.',
      explanation: '"dobre" — neuter nominative, agrees with "krzesło" (neut.)',
      themes: ['general', 'przedmioty'],
    },
    {
      sentence: 'To jest mały dom.',
      translation: 'This is a small house.',
      explanation: '"mały" — masculine nominative, agrees with "dom" (masc.)',
      themes: ['general', 'miejsca'],
    },
    {
      sentence: 'To jest mała kawa.',
      translation: 'This is a small coffee.',
      explanation: '"mała" — feminine nominative, agrees with "kawa" (fem.)',
      themes: ['general', 'jedzenie'],
    },
    {
      sentence: 'To jest małe okno.',
      translation: 'This is a small window.',
      explanation: '"małe" — neuter nominative, agrees with "okno" (neut.)',
      themes: ['general', 'przedmioty', 'miejsca'],
    },
    {
      sentence: 'To jest stary pies.',
      translation: 'This is an old dog.',
      explanation: '"stary" — masculine nominative, agrees with "pies" (masc.)',
      themes: ['general', 'zwierzeta'],
    },
  ],
}
