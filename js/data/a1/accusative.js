const A1_ACCUSATIVE = {
  templates: [
    {
      pattern: 'Widzę ____ {acc}.',
      translation: 'I see ____ {en}.',
      hint: '(adjective_base) — accusative, {gender}',
      gender: null,
    },
    {
      pattern: 'Mam ____ {acc}.',
      translation: 'I have ____ {en}.',
      hint: '(adjective_base) — accusative, {gender}',
      gender: null,
    },
    {
      pattern: 'Lubię ____ {acc}.',
      translation: 'I like ____ {en}.',
      hint: '(adjective_base) — accusative, {gender}',
      gender: null,
    },
    {
      pattern: 'Kupuję ____ {acc}.',
      translation: 'I am buying ____ {en}.',
      hint: '(adjective_base) — accusative, {gender}',
      gender: null,
    },
    {
      pattern: 'Spotykam ____ {acc}.',
      translation: 'I meet ____ {en}.',
      hint: '(adjective_base) — accusative, masculine',
      gender: 'masculine',
    },
  ],
  examples: [
    {
      sentence: 'Widzę nowego studenta.',
      translation: 'I see a new student.',
      explanation: '"nowego" — masc. accusative (animate), "studenta" — from "student"',
      themes: ['general', 'zawody', 'ludzie'],
    },
    {
      sentence: 'Mam nową książkę.',
      translation: 'I have a new book.',
      explanation: '"nową" — fem. accusative, "książkę" — from "książka"',
      themes: ['general', 'przedmioty'],
    },
    {
      sentence: 'Lubię dobrego psa.',
      translation: 'I like a good dog.',
      explanation: '"dobrego" — masc. accusative (animate), "psa" — from "pies" (irregular)',
      themes: ['general', 'zwierzeta'],
    },
    {
      sentence: 'Kupuję małe dziecko.',
      translation: 'I am buying a small child.',
      explanation: '"małe" — neut. accusative (same as nominative), "dziecko" — neut.',
      themes: ['general', 'ludzie', 'rodzina'],
    },
    {
      sentence: 'Widzę starą kobietę.',
      translation: 'I see an old woman.',
      explanation: '"starą" — fem. accusative, "kobietę" — from "kobieta"',
      themes: ['general', 'ludzie'],
    },
    {
      sentence: 'Mam nowy telefon.',
      translation: 'I have a new phone.',
      explanation: '"nowy" — masc. accusative (inanimate, same as nom.), "telefon" — masc.',
      themes: ['general', 'przedmioty'],
    },
    {
      sentence: 'Lubię dobrego lekarza.',
      translation: 'I like a good doctor.',
      explanation: '"dobrego" — masc. accusative (animate), "lekarza" — from "lekarz"',
      themes: ['general', 'zawody'],
    },
    {
      sentence: 'Kupuję świeże mleko.',
      translation: 'I am buying fresh milk.',
      explanation: '"świeże" — neut. accusative (same as nom.), "mleko" — neut.',
      themes: ['general', 'jedzenie'],
    },
    {
      sentence: 'Spotykam nowego kolegę.',
      translation: 'I meet a new colleague.',
      explanation: '"nowego" — masc. accusative (animate), "kolegę" — from "kolega" (-a → -ę)',
      themes: ['general', 'ludzie', 'zawody'],
    },
    {
      sentence: 'Mam brzydkiego kota.',
      translation: 'I have an ugly cat.',
      explanation: '"brzydkiego" — masc. accusative (animate), "kota" — from "kot"',
      themes: ['general', 'zwierzeta'],
    },
  ],
}
