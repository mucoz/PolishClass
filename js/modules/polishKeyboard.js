const POLISH_SPECIAL = ['ą','ć','ę','ł','ń','ó','ś','ź','ż']

class PolishKeyboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.activeInput = null
    this.visible = false
    this.init()
  }

  init() {
    this.container.className = 'kb-floating'
    this.container.innerHTML = this.buildLayout()
    this.bindEvents()
  }

  buildLayout() {
    let html = '<div class="kb-inner">'
    html += '<div class="kb-row">'
    POLISH_SPECIAL.forEach(k => {
      html += `<div class="kb-key special-chars" data-key="${k}">${k}</div>`
    })
    html += `<div class="kb-key" data-key="backspace">⌫</div>`
    html += '</div>'
    html += '</div>'
    return html
  }

  bindEvents() {
    this.container.addEventListener('click', e => {
      const key = e.target.dataset.key
      if (!key) return
      if (key === 'backspace') {
        this.deleteChar()
        return
      }
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

  deleteChar() {
    if (!this.activeInput) return
    const start = this.activeInput.selectionStart
    const end = this.activeInput.selectionEnd
    if (start === 0 && end === 0) return
    if (start !== end) {
      const val = this.activeInput.value
      this.activeInput.value = val.substring(0, start) + val.substring(end)
      this.activeInput.setSelectionRange(start, start)
    } else {
      const val = this.activeInput.value
      this.activeInput.value = val.substring(0, start - 1) + val.substring(start)
      this.activeInput.setSelectionRange(start - 1, start - 1)
    }
    this.activeInput.dispatchEvent(new Event('input', { bubbles: true }))
    this.activeInput.focus()
  }

  focus(input) {
    this.activeInput = input
    this.positionAbove(input)
    this.visible = true
    this.container.classList.add('show')
  }

  blur() {
    this.visible = false
    this.container.classList.remove('show')
    this.activeInput = null
  }

  positionAbove(input) {
    const rect = input.getBoundingClientRect()
    const kbHeight = 56
    const gap = 6
    let top = rect.top - kbHeight - gap
    if (top < 8) top = rect.bottom + gap
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - 180, window.innerWidth - 368))
    this.container.style.top = top + 'px'
    this.container.style.left = left + 'px'
  }
}
