const CONFIG = {
  levels: ['A1'],
  defaultLevel: 'A1',
  cases: [
    { id: 'nominative', label: 'Mianownik (Nominative)', level: 'A1' },
    { id: 'instrumental', label: 'Narzędnik (Instrumental)', level: 'A1' },
    { id: 'mixed', label: 'Mieszane (Mixed)', level: 'A1' },
  ],
  themes: [
    { id: 'all', label: 'All' },
    { id: 'rodzina', label: 'Rodzina' },
    { id: 'zawody', label: 'Zawody' },
    { id: 'jedzenie', label: 'Jedzenie' },
    { id: 'miejsca', label: 'Miejsca' },
    { id: 'kolory', label: 'Kolory' },
    { id: 'ludzie', label: 'Ludzie' },
    { id: 'zwierzeta', label: 'Zwierz\u0119ta' },
    { id: 'przedmioty', label: 'Przedmioty' },
    { id: 'uczucia', label: 'Uczucia' },
    { id: 'nature', label: 'Natura' },
  ],
  exercisesPerCase: 20,
  masteryThreshold: 5,
  streakThreshold: 3,
  storageKeys: {
    nounMastery: 'polishclass_noun_mastery',
    adjMastery: 'polishclass_adj_mastery',
  },
}
