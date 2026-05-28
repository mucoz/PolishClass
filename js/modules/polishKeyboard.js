const POLISH_KEYS = [
  ['q','w','e','r','t','z','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['y','x','c','v','b','n','m'],
]

const POLISH_SPECIAL = ['ą','ć','ę','ł','ń','ó','ś','ź','ż']

class PolishKeyboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.activeInput = null
    this.shiftOn = false
    this.init()
  }

  init() {
    this.container.innerHTML = this.buildLayout()
    this.bindEvents()
  }

  buildLayout() {
    let html = '<div class="max-w-2xl mx-auto px-2 py-3 space-y-1.5 select-none">'
    POLISH_KEYS.forEach(row => {
      html += '<div class="flex justify-center gap-1">'
      row.forEach(k => {
        html += `<div class="kb-key" data-key="${k}">${k}</div>`
      })
      html += '</div>'
    })
    html += '<div class="flex justify-center gap-1">'
    html += `<div class="kb-key special" data-key="shift">⇧</div>`
    html += `<div class="kb-key" data-key=" " style="flex:3;min-width:120px">Space</div>`
    html += `<div class="kb-key special" data-key="backspace">⌫</div>`
    html += '</div>'
    html += '<div class="flex justify-center gap-1">'
    POLISH_SPECIAL.forEach(k => {
      html += `<div class="kb-key bg-indigo-50 text-indigo-700 font-semibold" data-key="${k}">${k}</div>`
    })
    html += '</div>'
    html += '</div>'
    return html
  }

  bindEvents() {
    this.container.addEventListener('click', e => {
      const key = e.target.dataset.key
      if (!key) return
      if (key === 'shift') {
        this.shiftOn = !this.shiftOn
        e.target.classList.toggle('bg-indigo-200', this.shiftOn)
        return
      }
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
    const c = this.shiftOn ? char.toUpperCase() : char
    this.activeInput.value = val.substring(0, start) + c + val.substring(end)
    const pos = start + 1
    this.activeInput.setSelectionRange(pos, pos)
    this.activeInput.dispatchEvent(new Event('input', { bubbles: true }))
    this.activeInput.focus()
    if (this.shiftOn) {
      this.shiftOn = false
      this.updateShiftUI()
    }
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
    this.show()
  }

  blur() {
    this.hide()
    this.activeInput = null
  }

  show() {
    this.container.classList.add('show')
  }

  hide() {
    this.container.classList.remove('show')
  }

  updateShiftUI() {
    this.container.querySelectorAll('[data-key="shift"]').forEach(el => {
      el.classList.toggle('bg-indigo-200', this.shiftOn)
    })
  }
}
