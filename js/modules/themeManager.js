class ThemeManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.selected = 'all'
    this.onChange = null
    this.init()
  }

  init() {
    this.render()
    this.container.querySelectorAll('.theme-chip').forEach(btn => {
      btn.addEventListener('click', () => this.switch(btn.dataset.theme))
    })
  }

  render() {
    this.container.innerHTML = CONFIG.themes.map(t => `
      <button class="theme-chip px-3 py-1 rounded-lg text-xs font-medium border transition-all
        ${t.id === this.selected ? 'active' : ''}"
        data-theme="${t.id}">${t.label}</button>
    `).join('')
  }

  switch(theme) {
    if (theme === this.selected) return
    this.selected = theme
    this.container.querySelectorAll('.theme-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme)
    })
    if (this.onChange) this.onChange(theme)
  }

  getTheme() {
    return this.selected
  }
}
