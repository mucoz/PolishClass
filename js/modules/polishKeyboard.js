const POLISH_SPECIAL = ['ą','ć','ę','ł','ń','ó','ś','ź','ż']

class PolishKeyboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.activeInput = null
    this.init()
  }

  init() {
    this.container.innerHTML = this.buildLayout()
    this.bindEvents()
  }

  buildLayout() {
    let html = '<div class="kb-inner"><div class="kb-row">'
    POLISH_SPECIAL.forEach(k => {
      html += `<div class="kb-key special-chars" data-key="${k}">${k}</div>`
    })
    html += '</div></div>'
    return html
  }

  bindEvents() {
    this.container.addEventListener('click', e => {
      const key = e.target.dataset.key
      if (!key) return
      this.insertChar(key)
    })
  }

  insertChar(char) {
    if (!this.activeInput) return
    const start = this.activeInput.selectionStart
    const end = this.activeInput.selectionEnd
    const val = this.activeInput.value
    this.activeInput.value = val.substring(0, start) + char + val.substring(end)
    const pos = start + 1
    this.activeInput.setSelectionRange(pos, pos)
    this.activeInput.dispatchEvent(new Event('input', { bubbles: true }))
    this.activeInput.focus()
  }

  focus(input) {
    if (this.container.classList.contains('hidden')) return
    this.activeInput = input
    this.container.classList.add('show')
  }

  blur() {
    this.container.classList.remove('show')
    this.activeInput = null
  }
}
