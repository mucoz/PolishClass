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
      btn.innerHTML = `${info ? info.name : caseId}<span class="text-indigo-400 text-sm bg-indigo-100 rounded-full w-6 h-6 flex items-center justify-center hover:bg-indigo-200 transition-colors font-bold" title="Learn about this case">ℹ</span>`
      btn.addEventListener('click', () => showCaseInfo(caseId))
      titleRow.appendChild(btn)

      if (info && info.question) {
        const q = document.createElement('span')
        q.className = 'text-xs font-medium text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full'
        q.textContent = info.question
        titleRow.appendChild(q)
      }

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
    if (cards.length === 0) this.showEmpty()
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
