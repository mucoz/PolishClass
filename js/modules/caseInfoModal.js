function showCaseInfo(caseId) {
  const info = CASE_INFO[caseId]
  if (!info) return

  let declHtml = '<table class="case-decl-table"><thead><tr><th>Gender</th><th>Adjective</th><th>Noun</th><th>Example</th></tr></thead><tbody>'
  info.declension.forEach(row => {
    declHtml += `<tr><td>${row.gender}</td><td><span class="case-suffix">${row.adjEnding}</span></td><td><span class="case-suffix">${row.nounEnding}</span></td><td class="font-medium text-slate-800">${row.example}</td></tr>`
  })
  declHtml += '</tbody></table>'

  const overlay = document.createElement('div')
  overlay.className = 'case-modal-overlay'
  overlay.innerHTML = `
    <div class="case-modal-card">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">${info.name}</h3>
          <span class="text-sm text-slate-400 font-medium">${info.polishName}</span>
        </div>
        <button class="case-modal-close text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
      </div>
      <div class="text-sm text-slate-600 leading-relaxed mb-4">${info.usage}</div>
      <div class="mb-4">
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Declension — Adjective + Noun</div>
        ${declHtml}
      </div>
      <div>
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Example Sentences</div>
        <ul class="space-y-1">
          ${info.examples.slice(0, 3).map(ex => `<li class="text-sm text-slate-700">• ${ex}</li>`).join('')}
        </ul>
      </div>
      <div class="mt-3 flex gap-1.5 flex-wrap">
        ${info.keywords.map(k => `<span class="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">${k}</span>`).join('')}
      </div>
    </div>
  `

  document.body.appendChild(overlay)
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 })
  gsap.fromTo(overlay.querySelector('.case-modal-card'), { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' })

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.closest('.case-modal-close')) {
      closeCaseModal(overlay)
    }
  })
  document.addEventListener('keydown', overlay._closeHandler = e => {
    if (e.key === 'Escape') closeCaseModal(overlay)
  })
}

function closeCaseModal(overlay) {
  gsap.to(overlay, { opacity: 0, duration: 0.15, onComplete: () => {
    overlay.remove()
    if (overlay._closeHandler) document.removeEventListener('keydown', overlay._closeHandler)
  }})
}
