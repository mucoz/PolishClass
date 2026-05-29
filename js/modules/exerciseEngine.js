class ExerciseEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.exercises = []
    this.currentSet = []
    this.caseData = {
      nominative: A1_NOMINATIVE,
      accusative: A1_ACCUSATIVE,
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

  generateExercises(selectedCases, theme = 'all', count = CONFIG.defaultExerciseCount) {
    this.currentTheme = theme
    const isMixed = selectedCases.includes('mixed')
    const activeCases = isMixed
      ? ['nominative', 'accusative', 'instrumental']
      : selectedCases.filter(c => c !== 'mixed')

    if (activeCases.length === 0) return

    const perCase = Math.ceil(count / activeCases.length)
    const allExercises = []

    for (const caseId of activeCases) {
      const data = this.caseData[caseId]
      if (!data || !data.templates || data.templates.length === 0) continue

      for (let i = 0; i < perCase; i++) {
        const ex = this.buildExercise(caseId, data, theme)
        if (ex) allExercises.push(ex)
      }
    }

    this.currentSet = shuffle(allExercises).slice(0, count)
  }

  buildExercise(caseId, data, theme = 'all') {
    const NOUN_TAG = 4, ADJ_TAG = 8, ADJ_EN = 7
    const template = pick(data.templates)
    const gender = template.gender || pick(['masculine', 'feminine', 'neuter'])

    const caseGenderKey = gender === 'masculine' ? 'masculine'
      : gender === 'feminine' ? 'feminine' : 'neuter'

    let nouns = A1_NOUNS[caseGenderKey]
    if (!nouns || nouns.length === 0) return null
    if (theme !== 'all') nouns = nouns.filter(n => n[NOUN_TAG] && n[NOUN_TAG].includes(theme))
    if (nouns.length === 0) return null

    let noun, animate = true
    if (caseId === 'accusative' && gender === 'masculine') {
      const animates = nouns.filter(n => n[NOUN_TAG] && n[NOUN_TAG].some(t => ['zawody','ludzie','rodzina','zwierzeta'].includes(t)))
      if (animates.length > 0) { noun = pick(animates); animate = true }
      else { noun = pick(nouns); animate = false }
    } else {
      noun = pick(nouns)
    }

    let adjectives = A1_ADJECTIVES
    if (theme !== 'all') adjectives = adjectives.filter(a => a[ADJ_TAG] && a[ADJ_TAG].includes(theme))
    if (adjectives.length === 0) adjectives = A1_ADJECTIVES
    const adj = pick(adjectives)
    const adjForm = getAdjForm(adj, caseId, gender, animate)
    const nounForm = getNounForm(noun, caseId)
    const nounNom = noun[0]

    const pattern = template.pattern
      .replace('{nom}', nounNom)
      .replace('{acc}', nounForm)
      .replace('{ins}', nounForm)
      .replace('{en}', noun[3])

    const translation = template.translation
      .replace('{en}', noun[3])
      .replace('{en_adj}', adj[ADJ_EN])

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

  render(selectedCases, theme = 'all', count = CONFIG.defaultExerciseCount) {
    this.generateExercises(selectedCases, theme, count)
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

    let html = '<div class="space-y-3">'
    this.currentSet.forEach((ex, i) => {
      const parts = ex.sentence.split('____')
      html += `
        <div class="exercise-card bg-white rounded-xl p-4 border border-slate-100 shadow-sm" data-id="${ex.id}">
          <div class="flex items-start gap-2">
            <span class="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">${i + 1}</span>
            <div class="flex-1 min-w-0">
              <div class="text-base font-medium text-slate-900 leading-relaxed">
                ${parts[0]}<input type="text" class="exercise-input-inline" data-exercise-id="${ex.id}" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="..." size="${Math.max(ex.answer.length + 2, 4)}">${parts[1] || ''}
              </div>
              <div class="flex items-center gap-1.5 text-xs mt-1.5 flex-wrap">
                <span class="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Use: <span class="text-indigo-800">${ex.baseWord}</span>
                </span>
                <span class="text-indigo-300">·</span>
                <span class="text-indigo-500">${ex.case} · ${ex.gender}</span>
                <span class="text-xs text-slate-400 ml-auto">${ex.translation}</span>
              </div>
            </div>
          </div>
          <div class="feedback text-xs mt-1 min-h-[20px]"></div>
        </div>
      `
    })
    html += `
      <div class="flex gap-2 pt-2">
        <button id="completeBtn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-indigo-200">
          Complete
        </button>
        <button id="shuffleBtn" class="bg-white hover:bg-slate-50 text-slate-600 font-medium py-3 px-4 rounded-xl border border-slate-200 transition-all active:scale-[0.98]">
          Shuffle
        </button>
      </div>
    `
    html += '</div>'
    this.container.innerHTML = html

    this.bindEvents()
    this.animateIn()
  }

  bindEvents() {
    this.container.querySelectorAll('.exercise-input-inline').forEach(inp => {
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

    cards.forEach(card => {
      const input = card.querySelector('.exercise-input-inline')
      const feedback = card.querySelector('.feedback')
      const ex = this.currentSet.find(e => e.id === card.dataset.id)
      if (!ex) return

      const userAnswer = input.value.trim().toLowerCase()
      const correctAnswer = ex.answer.toLowerCase()

      if (userAnswer === correctAnswer) {
        input.classList.add('correct')
        feedback.innerHTML = '<span class="text-green-600 font-semibold">✓ Correct</span>'
        this.updateMastery(ex.masteryKey, true)
      } else {
        input.classList.add('wrong')
        feedback.innerHTML = `<span class="text-red-500 font-semibold">✗ Correction: <span class="text-red-700">${ex.answer}</span></span>`
        this.updateMastery(ex.masteryKey, false)
      }

      input.disabled = true
    })

    this.showSummary()
  }

  showSummary() {
    const total = this.currentSet.length
    const correct = this.container.querySelectorAll('.exercise-input-inline.correct').length
    const wrong = total - correct

    const summary = document.createElement('div')
    summary.className = 'mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center'
    summary.innerHTML = `
      <div class="text-sm font-semibold text-slate-700 mb-1">Session Complete</div>
      <div class="text-2xl font-bold ${correct === total ? 'text-green-600' : 'text-indigo-600'}">
        ${correct}/${total} correct
      </div>
      <div class="text-xs text-slate-400 mt-1">${wrong > 0 ? wrong + ' to review' : 'Perfect!'}</div>
    `

    this.container.querySelector('.space-y-4').appendChild(summary)
    gsap.fromTo(summary, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 })
    if (window.polishKeyboard) window.polishKeyboard.blur()
  }
}
