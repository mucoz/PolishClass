class ExerciseEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.exercises = []
    this.currentSet = []
    this.caseData = {
      nominative: A1_NOMINATIVE,
      instrumental: A1_INSTRUMENTAL,
    }
    this.masteryStore = this.loadMastery()
    this.currentTheme = 'all'
    this.onComplete = null
  }

  loadMastery() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKeys.nounMastery)
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  }

  saveMastery() {
    localStorage.setItem(CONFIG.storageKeys.nounMastery, JSON.stringify(this.masteryStore))
  }

  getMastery(key) {
    return this.masteryStore[key] || { mastery: 0, streak: 0 }
  }

  updateMastery(word, correct) {
    const entry = this.getMastery(word)
    if (correct) {
      entry.mastery = Math.min((entry.mastery || 0) + 1, 10)
      entry.streak = (entry.streak || 0) + 1
    } else {
      entry.mastery = Math.max((entry.mastery || 0) - 2, 0)
      entry.streak = 0
    }
    entry.lastSeen = Date.now()
    this.masteryStore[word] = entry
    this.saveMastery()
  }

  generateExercises(selectedCases, theme = 'all', count = CONFIG.exercisesPerCase) {
    this.currentTheme = theme
    const isMixed = selectedCases.includes('mixed')
    const activeCases = isMixed
      ? ['nominative', 'instrumental']
      : selectedCases.filter(c => c !== 'mixed')

    if (activeCases.length === 0) return

    const allExercises = []

    for (const caseId of activeCases) {
      const data = this.caseData[caseId]
      if (!data || !data.templates || data.templates.length === 0) continue

      for (let i = 0; i < count; i++) {
        const ex = this.buildExercise(caseId, data, theme)
        if (ex) allExercises.push(ex)
      }
    }

    this.currentSet = isMixed || activeCases.length > 1
      ? shuffle(allExercises)
      : allExercises
  }

  buildExercise(caseId, data, theme = 'all') {
    const template = pick(data.templates)
    const gender = template.gender || pick(['masculine', 'feminine', 'neuter'])

    const caseGenderKey = gender === 'masculine' ? 'masculine'
      : gender === 'feminine' ? 'feminine' : 'neuter'

    let nouns = A1_NOUNS[caseGenderKey]
    if (!nouns || nouns.length === 0) return null
    if (theme !== 'all') nouns = nouns.filter(n => n[3] && n[3].includes(theme))
    if (nouns.length === 0) return null
    const noun = pick(nouns)

    let adjectives = A1_ADJECTIVES
    if (theme !== 'all') adjectives = adjectives.filter(a => a[7] && a[7].includes(theme))
    if (adjectives.length === 0) adjectives = A1_ADJECTIVES
    const adj = pick(adjectives)
    const adjForm = getAdjForm(adj, caseId, gender)
    const nounForm = getNounForm(noun, caseId)
    const nounNom = noun[0]

    const pattern = template.pattern
      .replace('{nom}', nounNom)
      .replace('{ins}', nounForm)
      .replace('{en}', noun[2])

    const translation = template.translation
      .replace('{en}', noun[2])
      .replace('{en_adj}', adj[6])

    const hint = template.hint
      .replace('{adjective_base}', adj[0])
      .replace('{gender}', gender === 'masculine' ? 'masc.' : gender === 'feminine' ? 'fem.' : 'neut.')
      .replace('{case}', caseId)

    const exerciseId = `${caseId}_${nounNom}_${adj[0]}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

    return {
      id: exerciseId,
      sentence: pattern,
      translation,
      hint,
      answer: adjForm,
      baseWord: adj[0],
      case: caseId,
      gender,
      noun: nounNom,
      masteryKey: adj[0],
    }
  }

  render(selectedCases, theme = 'all') {
    this.generateExercises(selectedCases, theme)
    this.displayExercises()
  }

  displayExercises() {
    if (this.currentSet.length === 0) {
      this.container.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-3">✏️</div>
          <p class="font-medium">No exercises available. Select a topic.</p>
        </div>
      `
      return
    }

    let html = '<div class="space-y-4">'
    this.currentSet.forEach((ex, i) => {
      const parts = ex.sentence.split('____')
      html += `
        <div class="exercise-card bg-white rounded-xl p-4 border border-slate-100 shadow-sm" data-id="${ex.id}">
          <div class="flex items-start gap-2 mb-2">
            <span class="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0">${i + 1}</span>
            <div class="flex-1">
              <div class="text-base font-medium text-slate-900 mb-1">
                ${parts[0]}<span class="inline-block border-b-2 border-indigo-300 min-w-[80px] px-1 text-indigo-600">${ex.answer ? '______' : ''}</span>${parts[1] || ''}
              </div>
              <div class="text-xs text-slate-400 italic">${ex.hint}</div>
              <div class="text-xs text-slate-300 mt-1">${ex.translation}</div>
            </div>
          </div>
          <input type="text"
            class="exercise-input w-full rounded-lg px-3 py-2 text-sm mt-1"
            placeholder="Type the answer..."
            data-exercise-id="${ex.id}"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false">
          <div class="feedback text-xs mt-1 min-h-[20px]"></div>
        </div>
      `
    })
    html += `
      <div class="flex gap-2 pt-2">
        <button id="completeBtn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-indigo-200">
          ✅ Complete
        </button>
        <button id="shuffleBtn" class="bg-white hover:bg-slate-50 text-slate-600 font-medium py-3 px-4 rounded-xl border border-slate-200 transition-all active:scale-[0.98]">
          🔀
        </button>
      </div>
    `
    html += '</div>'
    this.container.innerHTML = html

    this.bindEvents()
    this.animateIn()
  }

  bindEvents() {
    const inputs = this.container.querySelectorAll('.exercise-input')
    inputs.forEach(inp => {
      inp.addEventListener('focus', e => {
        if (window.polishKeyboard) window.polishKeyboard.focus(e.target)
      })
    })

    document.getElementById('completeBtn')?.addEventListener('click', () => this.checkAll())
    document.getElementById('shuffleBtn')?.addEventListener('click', () => {
      if (window.polishKeyboard) window.polishKeyboard.blur()
      this.currentSet = shuffle(this.currentSet)
      this.displayExercises()
    })
  }

  animateIn() {
    gsap.fromTo(
      this.container.querySelectorAll('.exercise-card'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out' }
    )
  }

  checkAll() {
    const cards = this.container.querySelectorAll('.exercise-card')
    if (cards.length === 0) return

    let idx = 0
    const checkNext = () => {
      if (idx >= cards.length) {
        this.showSummary()
        return
      }
      const card = cards[idx]
      const input = card.querySelector('.exercise-input')
      const feedback = card.querySelector('.feedback')
      const ex = this.currentSet.find(e => e.id === card.dataset.id)
      if (!ex) { idx++; checkNext(); return }

      const userAnswer = input.value.trim().toLowerCase()
      const correctAnswer = ex.answer.toLowerCase()

      if (userAnswer === correctAnswer) {
        input.classList.add('correct')
        feedback.innerHTML = '<span class="text-green-600 font-medium">✓ Correct!</span>'
        this.updateMastery(ex.masteryKey, true)
      } else {
        input.classList.add('wrong')
        feedback.innerHTML = `<span class="text-red-500">✗ Correction: <span class="font-semibold">${ex.answer}</span></span>`
        this.updateMastery(ex.masteryKey, false)
      }

      input.disabled = true
      idx++
      gsap.to(card, { x: userAnswer === correctAnswer ? [4, -4, 0] : 0, duration: 0.2 })
      setTimeout(checkNext, 350)
    }

    checkNext()
  }

  showSummary() {
    const total = this.currentSet.length
    const correct = this.container.querySelectorAll('.exercise-input.correct').length
    const wrong = total - correct

    const summary = document.createElement('div')
    summary.className = 'mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center'
    summary.innerHTML = `
      <div class="text-sm font-semibold text-slate-700 mb-1">Session Complete</div>
      <div class="text-2xl font-bold ${correct === total ? 'text-green-600' : 'text-indigo-600'}">
        ${correct}/${total} correct
      </div>
      <div class="text-xs text-slate-400 mt-1">${wrong > 0 ? wrong + ' to review' : 'Perfect! 🎉'}</div>
    `

    this.container.querySelector('.space-y-4').appendChild(summary)
    gsap.fromTo(summary, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 })
    if (window.polishKeyboard) window.polishKeyboard.blur()
  }
}
