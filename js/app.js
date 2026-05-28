document.addEventListener('DOMContentLoaded', () => {
  const tabManager = new TabManager('tabBar')
  const topicManager = new TopicManager('topicBar')
  const levelManager = new LevelManager('levelBar')
  const polishKeyboard = new PolishKeyboard('polishKeyboard')
  const exampleEngine = new ExampleEngine('exampleContent')
  const exerciseEngine = new ExerciseEngine('exerciseContent')

  window.polishKeyboard = polishKeyboard

  function countWords() {
    const m = A1_NOUNS.masculine?.length || 0
    const f = A1_NOUNS.feminine?.length || 0
    const n = A1_NOUNS.neuter?.length || 0
    document.getElementById('wordCount').textContent = m + f + n
    document.getElementById('adjCount').textContent = A1_ADJECTIVES?.length || 0
  }
  countWords()

  const tabs = ['examples', 'exercises']
  const contentAreas = {
    examples: document.getElementById('exampleContent'),
    exercises: document.getElementById('exerciseContent'),
  }

  function renderActive() {
    const tab = tabManager.activeTab
    const cases = topicManager.getSelected()
    if (tab === 'examples') {
      exampleEngine.render(cases)
    } else {
      exerciseEngine.render(cases)
    }
  }

  function switchTab(tab) {
    tabs.forEach(t => {
      contentAreas[t].classList.toggle('hidden', t !== tab)
    })
    if (tab !== 'exercises') {
      polishKeyboard.blur()
      document.querySelectorAll('input').forEach(inp => inp.blur())
    }
    renderActive()
  }

  tabManager.onChange = tab => switchTab(tab)
  topicManager.onChange = () => renderActive()
  levelManager.onChange = () => renderActive()

  document.getElementById('headerShuffleBtn').addEventListener('click', () => {
    if (tabManager.activeTab === 'exercises') {
      exerciseEngine.currentSet = shuffle(exerciseEngine.currentSet)
      exerciseEngine.displayExercises()
    }
  })

  document.addEventListener('click', e => {
    if (!e.target.closest('#polishKeyboard') &&
        !e.target.closest('.exercise-input') &&
        !e.target.closest('.kb-key')) {
      const anyFocused = document.querySelector('.exercise-input:focus')
      if (!anyFocused) polishKeyboard.blur()
    }
  })

  switchTab('examples')
})
