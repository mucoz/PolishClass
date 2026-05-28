document.addEventListener('DOMContentLoaded', () => {
  const tabManager = new TabManager('tabBar')
  const topicManager = new TopicManager('topicBar')
  const themeManager = new ThemeManager('themeBar')
  const levelManager = new LevelManager('levelBar')
  const polishKeyboard = new PolishKeyboard('polishKeyboard')
  const exampleEngine = new ExampleEngine('exampleContent')
  const exerciseEngine = new ExerciseEngine('exerciseContent')
  const storyEngine = new StoryEngine('czytankiContent')

  window.polishKeyboard = polishKeyboard

  let exerciseCount = CONFIG.defaultExerciseCount

  const countBar = document.getElementById('countBar')
  CONFIG.exerciseCounts.forEach(n => {
    const btn = document.createElement('button')
    btn.className = `count-btn px-2 py-0.5 rounded text-xs font-medium border transition-all ${n === exerciseCount ? 'active' : ''}`
    btn.dataset.count = n
    btn.textContent = n
    countBar.appendChild(btn)
    btn.addEventListener('click', () => {
      if (n === exerciseCount) return
      exerciseCount = n
      countBar.querySelectorAll('.count-btn').forEach(b => b.classList.toggle('active', +b.dataset.count === n))
      if (tabManager.activeTab === 'exercises') renderActive()
    })
  })

  function countWords() {
    const m = A1_NOUNS.masculine?.length || 0
    const f = A1_NOUNS.feminine?.length || 0
    const n = A1_NOUNS.neuter?.length || 0
    document.getElementById('wordCount').textContent = m + f + n
    document.getElementById('adjCount').textContent = A1_ADJECTIVES?.length || 0
  }
  countWords()

  const tabs = ['examples', 'exercises', 'czytanki']
  const contentAreas = {
    examples: document.getElementById('exampleContent'),
    exercises: document.getElementById('exerciseContent'),
    czytanki: document.getElementById('czytankiContent'),
  }

  function renderActive() {
    const tab = tabManager.activeTab
    const cases = topicManager.getSelected()
    const theme = themeManager.getTheme()

    countBar.classList.toggle('hidden', tab !== 'exercises')

    if (tab === 'examples') {
      exampleEngine.render(cases)
    } else if (tab === 'exercises') {
      exerciseEngine.render(cases, theme, exerciseCount)
    } else if (tab === 'czytanki') {
      storyEngine.render(cases, theme)
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
  themeManager.onChange = () => renderActive()
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
