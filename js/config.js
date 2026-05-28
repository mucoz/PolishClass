const CONFIG = {
  levels: ['A1'],
  defaultLevel: 'A1',
  cases: [
    { id: 'nominative', label: 'Nominative (Mianownik)', level: 'A1' },
    { id: 'instrumental', label: 'Instrumental (Narzędnik)', level: 'A1' },
    { id: 'mixed', label: 'Mixed (Mieszane)', level: 'A1' },
  ],
  exercisesPerCase: 20,
  masteryThreshold: 5,
  streakThreshold: 3,
  storageKeys: {
    nounMastery: 'polishclass_noun_mastery',
    adjMastery: 'polishclass_adj_mastery',
  },
}
