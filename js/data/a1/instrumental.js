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
      explanation: '"nowym" — masc. instrumental, "studentem" — masc. instrumental of "student"',
    },
    {
      sentence: 'Ona jest nową nauczycielką.',
      translation: 'She is a new teacher.',
      explanation: '"nową" — fem. instrumental, "nauczycielką" — fem. instrumental of "nauczycielka"',
    },
    {
      sentence: 'On jest dobrym lekarzem.',
      translation: 'He is a good doctor.',
      explanation: '"dobrym" — masc. instrumental, "lekarzem" — masc. instrumental of "lekarz"',
    },
    {
      sentence: 'Dziecko jest małym dzieckiem.',
      translation: 'The child is a small child.',
      explanation: '"małym" — neut. instrumental, "dzieckiem" — neut. instrumental of "dziecko"',
    },
    {
      sentence: 'Jestem starą studentką.',
      translation: 'I am an old student (f).',
      explanation: '"starą" — fem. instrumental, "studentką" — fem. instrumental of "studentka"',
    },
    {
      sentence: 'Oni są dobrymi przyjaciółmi.',
      translation: 'They are good friends.',
      explanation: '"dobrymi" — masc. pl. instrumental, "przyjaciółmi" — pl. instrumental of "przyjaciele"',
    },
    {
      sentence: 'Jestem zmęczonym pracownikiem.',
      translation: 'I am a tired employee.',
      explanation: '"zmęczonym" — masc. instrumental, "pracownikiem" — masc. instrumental of "pracownik"',
    },
    {
      sentence: 'Ona jest piękną kobietą.',
      translation: 'She is a beautiful woman.',
      explanation: '"piękną" — fem. instrumental, "kobietą" — fem. instrumental of "kobieta"',
    },
    {
      sentence: 'On jest złym psem.',
      translation: 'He is a bad dog.',
      explanation: '"złym" — masc. instrumental, "psem" — masc. instrumental of "pies" (irregular)',
    },
    {
      sentence: 'Jestem młodym inżynierem.',
      translation: 'I am a young engineer.',
      explanation: '"młodym" — masc. instrumental, "inżynierem" — masc. instrumental of "inżynier"',
    },
  ],
}
