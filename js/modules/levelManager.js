class LevelManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.activeLevel = CONFIG.defaultLevel
    this.onChange = null
    this.init()
  }

  init() {
    this.render()
    this.container.querySelectorAll('.level-pill').forEach(btn => {
      btn.addEventListener('click', () => this.switch(btn.dataset.level))
    })
  }

  render() {
    this.container.innerHTML = CONFIG.levels.map(l => `
      <button class="level-pill px-4 py-1 rounded-lg text-sm font-medium border transition-all"
        data-level="${l}">${l}</button>
    `).join('')
    this.updateUI()
  }

  switch(level) {
    if (level === this.activeLevel) return
    this.activeLevel = level
    this.updateUI()
    if (this.onChange) this.onChange(level)
  }

  updateUI() {
    this.container.querySelectorAll('.level-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.level === this.activeLevel)
    })
  }

  getLevel() {
    return this.activeLevel
  }
}
