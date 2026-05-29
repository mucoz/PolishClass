class ExampleEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.caseData = {
      nominative: A1_NOMINATIVE,
      accusative: A1_ACCUSATIVE,
      instrumental: A1_INSTRUMENTAL,
    }
  }

  render(cases, theme = 'all') {
    const active = cases.includes('mixed')
      ? ['nominative', 'instrumental', 'accusative']
      : cases.filter(c => c !== 'mixed')

    this.container.innerHTML = ''

    if (active.length === 0) {
      this.showEmpty()
      return
    }

    active.forEach((caseId, idx) => {
      const data = this.caseData[caseId]
      if (!data || !data.examples || data.examples.length === 0) return

      let filteredExamples = data.examples
      if (theme !== 'all') {
        filteredExamples = data.examples.filter(ex => {
          const exThemes = ex.themes || ['general']
          return exThemes.includes('all') || exThemes.includes(theme)
        })
      }

      if (filteredExamples.length === 0) return

      const section = document.createElement('div')
      section.className = 'mb-6'
      if (idx > 0) section.style.marginTop = '1rem'

      const titleRow = document.createElement('div')
      titleRow.className = 'flex items-center gap-2 mb-3'

      const btn = document.createElement('button')
      const info = CASE_INFO[caseId]
      btn.className = 'text-lg font-semibold text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-1.5'
      btn.innerHTML = `${info ? info.name : caseId}<span class="text-indigo-400 text-xs bg-indigo-50 rounded-full w-5 h-5 flex items-center justify-center hover:bg-indigo-100 transition-colors" title="Learn about this case">ℹ</span>`
      btn.addEventListener('click', () => this.showCaseInfo(caseId))
      titleRow.appendChild(btn)
      section.appendChild(titleRow)

      const grid = document.createElement('div')
      grid.className = 'grid gap-3'

      filteredExamples.forEach((ex) => {
        const card = document.createElement('div')
        card.className = 'example-card bg-white rounded-xl p-4 border border-slate-100 shadow-sm'
        card.innerHTML = `
          <div class="text-base font-medium text-slate-900 mb-1">${ex.sentence}</div>
          <div class="text-sm text-slate-500 italic mb-2">${ex.translation}</div>
          <div class="text-xs text-indigo-600 border-t border-slate-100 pt-2 mt-1">${ex.explanation}</div>
        `
        grid.appendChild(card)
      })

      section.appendChild(grid)
      this.container.appendChild(section)
    })

    const cards = this.container.querySelectorAll('.example-card')
    if (cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      )
    } else {
      this.showEmpty()
    }
  }

  showCaseInfo(caseId) {
    const info = CASE_INFO[caseId]
    if (!info) return

    let declHtml = '<table class="case-decl-table"><thead><tr><th>Gender</th><th>Adjective</th><th>Noun</th><th>Example</th></tr></thead><tbody>'
    info.declension.forEach(row => {
      declHtml += `<tr><td>${row.gender}</td><td><span class="case-suffix">${row.adjEnding}</span></td><td><span class="case-suffix">${row.nounEnding}</span></td><td class="font-medium text-slate-800">${row.example}</td></tr>`
    })
    declHtml += '</tbody></table>'

    const overlay = document.createElement('div')
    overlay.className = 'case-modal-overlay'
    overlay.innerHTML = `
      <div class="case-modal-card">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900">${info.name}</h3>
            <span class="text-sm text-slate-400 font-medium">${info.polishName}</span>
          </div>
          <button class="case-modal-close text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <div class="text-sm text-slate-600 leading-relaxed mb-4">${info.usage}</div>
        <div class="mb-4">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Declension — Adjective + Noun</div>
          ${declHtml}
        </div>
        <div>
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Example Sentences</div>
          <ul class="space-y-1">
            ${info.examples.slice(0, 3).map(ex => `<li class="text-sm text-slate-700">• ${ex}</li>`).join('')}
          </ul>
        </div>
        <div class="mt-3 flex gap-1.5 flex-wrap">
          ${info.keywords.map(k => `<span class="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">${k}</span>`).join('')}
        </div>
      </div>
    `

    document.body.appendChild(overlay)
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    gsap.fromTo(overlay.querySelector('.case-modal-card'), { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' })

    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.closest('.case-modal-close')) {
        this.closeModal(overlay)
      }
    })
    document.addEventListener('keydown', this._closeHandler = e => {
      if (e.key === 'Escape') this.closeModal(overlay)
    })
  }

  closeModal(overlay) {
    gsap.to(overlay, { opacity: 0, duration: 0.15, onComplete: () => {
      overlay.remove()
      if (this._closeHandler) document.removeEventListener('keydown', this._closeHandler)
    }})
  }

  showEmpty() {
    this.container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <div class="text-4xl mb-3">📖</div>
        <p class="font-medium">Select a topic to see examples</p>
      </div>
    `
  }
}
