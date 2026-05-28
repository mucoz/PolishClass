class ExampleEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.caseData = {
      nominative: A1_NOMINATIVE,
      instrumental: A1_INSTRUMENTAL,
    }
  }

  render(cases) {
    const active = cases.includes('mixed')
      ? ['nominative', 'instrumental']
      : cases.filter(c => c !== 'mixed')

    this.container.innerHTML = ''

    if (active.length === 0) {
      this.showEmpty()
      return
    }

    active.forEach((caseId, idx) => {
      const data = this.caseData[caseId]
      if (!data || !data.examples || data.examples.length === 0) return

      const section = document.createElement('div')
      section.className = 'mb-6'
      if (idx > 0) section.style.marginTop = '1rem'

      const title = document.createElement('h3')
      title.className = 'text-lg font-semibold text-slate-800 mb-3 capitalize'
      title.textContent = caseId === 'nominative'
        ? 'Nominative (Mianownik) — Examples'
        : 'Instrumental (Narzędnik) — Examples'
      section.appendChild(title)

      const grid = document.createElement('div')
      grid.className = 'grid gap-3'

      data.examples.forEach((ex, i) => {
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

    gsap.fromTo(
      this.container.querySelectorAll('.example-card'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
    )
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
