function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function debounce(fn, ms = 300) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

const GENDER_MAP = {
  masculine: 'm',
  feminine: 'f',
  neuter: 'n',
}

const CASE_INDICES = {
  nominative: { m: 0, f: 1, n: 2 },
  instrumental: { m: 3, f: 4, n: 5 },
}

const NOUN_INDICES = {
  nominative: 0,
  instrumental: 1,
}

function getAdjForm(adj, caseName, gender) {
  const g = GENDER_MAP[gender]
  const idx = CASE_INDICES[caseName]?.[g]
  return idx !== undefined ? adj[idx] : adj[0]
}

function getNounForm(noun, caseName) {
  const idx = NOUN_INDICES[caseName]
  return noun[idx]
}
