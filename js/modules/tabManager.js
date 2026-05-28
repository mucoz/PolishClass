class TabManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.buttons = this.container.querySelectorAll('.tab-btn')
    this.activeTab = null
    this.onChange = null
    this.init()
  }

  init() {
    const first = this.buttons[0]
    if (first) {
      first.classList.add('active')
      this.activeTab = first.dataset.tab
    }
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => this.switch(btn.dataset.tab))
    })
  }

  switch(tab) {
    if (tab === this.activeTab) return
    this.activeTab = tab
    this.buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab)
    })
    gsap.fromTo(this.container, { scale: 0.97, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.2 })
    if (this.onChange) this.onChange(tab)
  }
}
