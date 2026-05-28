class TopicManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.selected = new Set()
    this.onChange = null
    this.init()
  }

  init() {
    this.render()
    this.select('nominative')
    this.select('instrumental')
  }

  render() {
    this.container.innerHTML = CONFIG.cases.map(c => `
      <button class="topic-chip px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
        data-topic="${c.id}">${c.label}</button>
    `).join('')
    this.container.querySelectorAll('.topic-chip').forEach(btn => {
      btn.addEventListener('click', () => this.toggle(btn.dataset.topic))
    })
  }

  toggle(topic) {
    if (topic === 'mixed') {
      if (this.selected.has('mixed')) {
        this.selected.delete('mixed')
      } else {
        this.selected.clear()
        this.selected.add('mixed')
      }
    } else {
      this.selected.delete('mixed')
      if (this.selected.has(topic)) {
        this.selected.delete(topic)
      } else {
        this.selected.add(topic)
      }
    }
    if (this.selected.size === 0) this.selected.add('nominative')
    this.updateUI()
    if (this.onChange) this.onChange([...this.selected])
  }

  select(topic) {
    this.selected.add(topic)
    this.updateUI()
  }

  updateUI() {
    this.container.querySelectorAll('.topic-chip').forEach(btn => {
      btn.classList.toggle('active', this.selected.has(btn.dataset.topic))
    })
  }

  getSelected() {
    return [...this.selected]
  }
}
