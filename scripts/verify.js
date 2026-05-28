const fs = require('fs');
const vm = require('vm');

const code = [
  'js/config.js', 'js/utils.js',
  'js/data/a1/nouns.js', 'js/data/a1/adjectives.js',
  'js/data/a1/nominative.js', 'js/data/a1/instrumental.js',
].map(f => fs.readFileSync(f, 'utf8')).join('\n');

const testCode = code + `
const n = A1_NOUNS;
const total = n.masculine.length + n.feminine.length + n.neuter.length;
const tagged = n.masculine.filter(x => x[3]).length + n.feminine.filter(x => x[3]).length + n.neuter.filter(x => x[3]).length;
console.log("Nouns: " + total + " total, " + tagged + " tagged");

const a = A1_ADJECTIVES;
console.log("Adjectives: " + a.length + " total, " + a.filter(x => x[7]).length + " tagged");

const ex = [...A1_NOMINATIVE.examples, ...A1_INSTRUMENTAL.examples];
console.log("Examples: " + ex.length + " total, " + ex.filter(e => e.themes).length + " with themes");

console.log("\\nSample: student → " + JSON.stringify(n.masculine[0][3]));
console.log("Sample: pies → " + JSON.stringify(n.masculine.find(x => x[0] === 'pies')[3]));
console.log("Sample: nowy → " + JSON.stringify(a[0][7]));
const red = a.find(x => x[0] === 'czerwony');
console.log("Sample: czerwony → " + JSON.stringify(red ? red[7] : 'not found'));
`;

vm.runInNewContext(testCode, { console });
