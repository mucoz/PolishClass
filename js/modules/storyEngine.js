class StoryEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.stories = A1_STORIES || []
    this.filtered = []
    this.currentIndex = 0
  }

  render(cases, theme = 'all') {
    this.filtered = this.filterStories(cases, theme)

    if (this.filtered.length === 0) {
      this.showEmpty()
      return
    }

    this.currentIndex = 0
    this.showStory()
  }

  filterStories(cases, theme) {
    const isMixed = cases.includes('mixed')
    const activeCases = isMixed
      ? ['nominative', 'accusative', 'instrumental']
      : cases.filter(c => c !== 'mixed')

    return this.stories.filter(s => {
      const caseMatch = activeCases.some(c => s.cases.includes(c))
      const themeMatch = theme === 'all' || s.themes.includes(theme)
      return caseMatch && themeMatch
    })
  }

  showStory() {
    if (this.filtered.length === 0) return this.showEmpty()

    const story = this.filtered[this.currentIndex]
    const total = this.filtered.length

    let html = `
      <div class="story-card bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-slate-900">${story.title}</h3>
          <span class="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">${story.level}</span>
        </div>
        <div class="text-sm text-indigo-400 mb-4 flex gap-1.5 flex-wrap">
          ${story.cases.map(c => '<span class="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-xs font-medium">' + c + '</span>').join('')}
        </div>
    `

    story.paragraphs.forEach((p, i) => {
      html += `
        <div class="mb-4">
          <div class="text-base font-medium text-slate-800 leading-relaxed">${p.pl}</div>
          <button class="expand-btn text-xs text-slate-400 hover:text-indigo-600 mt-1" data-para="${i}">Show translation ▾</button>
          <div class="text-sm text-slate-500 italic mt-1 hidden" data-translation="${i}">${p.en}</div>
        </div>
      `
    })

    html += `
      <div class="mt-4 pt-4 border-t border-slate-100">
        <button class="expand-btn text-sm font-medium text-slate-600 hover:text-indigo-600 mb-2" data-vocab="1">📖 Key Vocabulary ▾</button>
        <div class="hidden" data-vocab-content="1">
          <table class="story-vocab w-full text-sm">
            <tbody>
              ${story.vocab.map(v => `
                <tr>
                  <td class="font-medium text-slate-800 w-1/3">${v[0]}</td>
                  <td class="text-slate-500 w-1/3">${v[1]}</td>
                  <td class="text-slate-400 text-xs w-1/3">
                    <span class="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">${v[2]}</span>
                    <span class="bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded text-[10px] ml-1">${v[3]}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `

    if (total > 1) {
      html += `
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <button id="prevStoryBtn" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all ${this.currentIndex === 0 ? 'opacity-30 pointer-events-none' : ''}">◀ Previous</button>
          <span class="text-xs text-slate-400">${this.currentIndex + 1} / ${total}</span>
          <button id="nextStoryBtn" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all ${this.currentIndex === total - 1 ? 'opacity-30 pointer-events-none' : ''}">Next ▶</button>
        </div>
      `
    }

    html += '</div>'
    this.container.innerHTML = html
    this.bindEvents()
    this.animateIn()
  }

  bindEvents() {
    this.container.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.para !== undefined) {
          const el = this.container.querySelector(`[data-translation="${btn.dataset.para}"]`)
          const isHidden = el.classList.contains('hidden')
          el.classList.toggle('hidden')
          btn.textContent = isHidden ? 'Hide translation ▴' : 'Show translation ▾'
        }
        if (btn.dataset.vocab) {
          const el = this.container.querySelector(`[data-vocab-content="${btn.dataset.vocab}"]`)
          const isHidden = el.classList.contains('hidden')
          el.classList.toggle('hidden')
          btn.textContent = isHidden ? '📖 Key Vocabulary ▴' : '📖 Key Vocabulary ▾'
        }
      })
    })

    const prevBtn = document.getElementById('prevStoryBtn')
    const nextBtn = document.getElementById('nextStoryBtn')
    if (prevBtn) prevBtn.addEventListener('click', () => { this.currentIndex--; this.showStory() })
    if (nextBtn) nextBtn.addEventListener('click', () => { this.currentIndex++; this.showStory() })
  }

  animateIn() {
    gsap.fromTo(
      this.container.querySelector('.story-card'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    )
  }

  showEmpty() {
    this.container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <div class="text-4xl mb-3">📖</div>
        <p class="font-medium text-sm">No stories match your selection.</p>
        <p class="text-xs mt-1">Try different topics or themes.</p>
      </div>
    `
  }
}
