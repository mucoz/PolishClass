class ExerciseEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.exercises = []
    this.currentSet = []
    this.masteryStore = this.loadMastery()
    this.currentTheme = 'all'
    this.onComplete = null
    this._lastParams = null
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
    this._lastParams = { selectedCases, theme, count }
    this.currentTheme = theme
    const isMixed = selectedCases.includes('mixed')
    const activeCases = isMixed
      ? ['nominative', 'instrumental', 'accusative']
      : selectedCases.filter(c => c !== 'mixed')

    if (activeCases.length === 0) return

    const perCase = Math.ceil(count / activeCases.length)
    const allExercises = []

    for (const caseId of activeCases) {
      const pool = CURATED_EXERCISES[caseId]
      if (!pool || pool.length === 0) continue

      const shuffled = shuffle([...pool])
      for (let i = 0; i < perCase && i < shuffled.length; i++) {
        const ex = shuffled[i]
        allExercises.push({
          id: `${caseId}_${ex.noun}_${ex.baseWord}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          sentence: ex.sentence,
          translation: ex.translation,
          answer: ex.answer,
          baseWord: ex.baseWord,
          case: caseId,
          gender: ex.gender,
          noun: ex.noun,
          masteryKey: ex.baseWord,
        })
      }
    }

    this.currentSet = shuffle(allExercises).slice(0, count)
  }

  render(selectedCases, theme = 'all', count = CONFIG.defaultExerciseCount) {
    this.generateExercises(selectedCases, theme, count)
    this.displayExercises()
  }

  saveSet() {
    localStorage.setItem(CONFIG.storageKeys.exerciseSet, JSON.stringify(this.currentSet))
  }

  loadSet() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKeys.exerciseSet)
      if (raw) { this.currentSet = JSON.parse(raw); return true }
    } catch {}
    return false
  }

  clearSet() {
    localStorage.removeItem(CONFIG.storageKeys.exerciseSet)
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
      const info = CASE_INFO[ex.case]
      const question = info && info.question ? info.question : ''
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
                <button class="case-info-btn text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1" data-case="${ex.case}">
                  ${ex.case}<span class="text-[10px] text-indigo-400 bg-indigo-100 rounded-full w-4 h-4 inline-flex items-center justify-center hover:bg-indigo-200 transition-colors font-bold ml-0.5">ℹ</span>
                </button>
                <span class="text-indigo-300">·</span>
                <span class="text-indigo-500">${ex.gender}</span>
                ${question ? `<span class="text-xs font-medium text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">${question}</span>` : ''}
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

    this.container.querySelectorAll('.case-info-btn').forEach(btn => {
      btn.addEventListener('click', () => showCaseInfo(btn.dataset.case))
    })

    document.getElementById('completeBtn')?.addEventListener('click', () => this.checkAll())
    document.getElementById('shuffleBtn')?.addEventListener('click', () => {
      if (window.polishKeyboard) window.polishKeyboard.blur()
      if (this._lastParams) {
        this.clearSet()
        this.generateExercises(this._lastParams.selectedCases, this._lastParams.theme, this._lastParams.count)
        this.displayExercises()
      }
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
    const perfect = correct === total

    if (window.polishKeyboard) window.polishKeyboard.blur()

    const overlay = document.createElement('div')
    overlay.className = 'case-modal-overlay'
    overlay.style.opacity = '0'

    overlay.innerHTML = `
      <div class="case-modal-card text-center" style="max-width:340px;transform:scale(0.9);">
        <div class="text-4xl mb-2">${perfect ? '🎉' : '💪'}</div>
        <div class="text-base font-semibold text-slate-700 mb-1">Session Complete</div>
        <div class="text-3xl font-bold ${perfect ? 'text-green-600' : 'text-indigo-600'}">${correct}/${total} correct</div>
        <div class="text-xs text-slate-400 mt-1 mb-5">${wrong > 0 ? wrong + ' to review' : 'Perfect!'}</div>
        <div class="flex flex-col gap-2">
          <button class="new-set-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-[0.98]" style="box-shadow:0 4px 6px rgba(79,70,229,.3)">
            New Set
          </button>
          <button class="close-summary-btn w-full bg-white hover:bg-slate-50 text-slate-600 font-medium py-3 px-6 rounded-xl border border-slate-200 transition-all active:scale-[0.98]">
            Close
          </button>
        </div>
      </div>
    `

    document.body.appendChild(overlay)
    const card = overlay.querySelector('.case-modal-card')

    gsap.to(overlay, { opacity: 1, duration: 0.2 })
    gsap.to(card, { scale: 1, duration: 0.25, ease: 'backOut(1.5)' })

    const close = () => {
      gsap.to(overlay, {
        opacity: 0, duration: 0.15,
        onComplete: () => overlay.remove()
      })
    }

    overlay.querySelector('.new-set-btn').addEventListener('click', () => {
      close()
      this.newSet()
    })
    overlay.querySelector('.close-summary-btn').addEventListener('click', close)
    overlay.addEventListener('click', e => { if (e.target === overlay) close() })
  }

  newSet() {
    if (!this._lastParams) return
    this.clearSet()
    const { selectedCases, theme, count } = this._lastParams
    this.generateExercises(selectedCases, theme, count)
    this.displayExercises()
  }
}
