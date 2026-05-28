const A1_INSTRUMENTAL = {
  templates: [
    {
      pattern: 'Jestem ____ {ins}.',
      translation: 'I am ____ {en}.',
      hint: '(adjective_base) — instrumental, {gender}',
      gender: null,
    },
    {
      pattern: 'On jest ____ {ins}.',
      translation: 'He is ____ {en}.',
      hint: '(adjective_base) — instrumental, masculine',
      gender: 'masculine',
    },
    {
      pattern: 'Ona jest ____ {ins}.',
      translation: 'She is ____ {en}.',
      hint: '(adjective_base) — instrumental, feminine',
      gender: 'feminine',
    },
    {
      pattern: 'Dziecko jest ____ {ins}.',
      translation: 'The child is ____ {en}.',
      hint: '(adjective_base) — instrumental, neuter',
      gender: 'neuter',
    },
    {
      pattern: 'Oni są ____ {ins}.',
      translation: 'They (masc.) are ____ {en}.',
      hint: '(adjective_base) — instrumental, masculine',
      gender: 'masculine',
    },
  ],
  examples: [
    {
      sentence: 'Jestem nowym studentem.',
      translation: 'I am a new student.',
      explanation: '"nowym" — masc. instrumental, "studentem" — from "student"',
      themes: ['general', 'zawody', 'ludzie'],
    },
    {
      sentence: 'Ona jest nową nauczycielką.',
      translation: 'She is a new teacher.',
      explanation: '"nową" — fem. instrumental, "nauczycielką" — from "nauczycielka"',
      themes: ['general', 'zawody', 'ludzie'],
    },
    {
      sentence: 'On jest dobrym lekarzem.',
      translation: 'He is a good doctor.',
      explanation: '"dobrym" — masc. instrumental, "lekarzem" — from "lekarz"',
      themes: ['general', 'zawody'],
    },
    {
      sentence: 'Dziecko jest małym dzieckiem.',
      translation: 'The child is a small child.',
      explanation: '"małym" — neut. instrumental, "dzieckiem" — from "dziecko"',
      themes: ['general', 'ludzie', 'rodzina'],
    },
    {
      sentence: 'Jestem starą studentką.',
      translation: 'I am an old student (f).',
      explanation: '"starą" — fem. instrumental, "studentką" — from "studentka"',
      themes: ['general', 'zawody', 'ludzie'],
    },
    {
      sentence: 'Oni są dobrymi przyjaciółmi.',
      translation: 'They are good friends.',
      explanation: '"dobrymi" — masc. pl. instrumental, "przyjaciółmi" — from "przyjaciele"',
      themes: ['general', 'ludzie'],
    },
    {
      sentence: 'Jestem zmęczonym pracownikiem.',
      translation: 'I am a tired employee.',
      explanation: '"zmęczonym" — masc. instrumental, "pracownikiem" — from "pracownik"',
      themes: ['general', 'zawody'],
    },
    {
      sentence: 'Ona jest piękną kobietą.',
      translation: 'She is a beautiful woman.',
      explanation: '"piękną" — fem. instrumental, "kobietą" — from "kobieta"',
      themes: ['general', 'ludzie'],
    },
    {
      sentence: 'On jest złym psem.',
      translation: 'He is a bad dog.',
      explanation: '"złym" — masc. instrumental, "psem" — from "pies" (irregular)',
      themes: ['general', 'zwierzeta'],
    },
    {
      sentence: 'Jestem młodym inżynierem.',
      translation: 'I am a young engineer.',
      explanation: '"młodym" — masc. instrumental, "inżynierem" — from "inżynier"',
      themes: ['general', 'zawody'],
    },
  ],
}
