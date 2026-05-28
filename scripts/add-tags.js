const fs = require('fs');

function wordMatch(word, text) {
  return new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(text);
}

const THEME_RULES = [
  { keywords: ['teacher','doctor','engineer','director','manager','employee','professor','police','firefighter','politician','artist','musician','writer','poet','actor','cook','baker','electrician','gardener','farmer','fisherman','driver','pilot','soldier','mailman','salesperson','waiter','waitress','nurse','secretary','cleaner','journalist','hairdresser','psychologist','caregiver','singer','dancer'], tags: ['zawody'] },
  { keywords: ['student','pupil'], tags: ['zawody','ludzie'] },
  { keywords: ['mother','father','brother','sister','son','daughter','wife','husband','grandfather','grandma','uncle','aunt','cousin','family','dad','mom','sibling','child','baby'], tags: ['rodzina','ludzie'] },
  { keywords: ['boyfriend','girlfriend','boy','girl','man','woman','lady','friend','colleague','neighbor','guest','adult'], tags: ['ludzie'] },
  { keywords: ['cat','dog','horse','bird','lion','tiger','elephant','bear','hare','fox','wolf','deer','snake','turtle','crocodile','hedgehog','animal','pet','puppy','kitten','fish','mouse','rabbit'], tags: ['zwierzeta'] },
  { keywords: ['bread','cheese','rice','pasta','yogurt','soup','salad','sandwich','roll','orange','lemon','pear','plum','cherry','strawberry','raspberry','blueberry','apricot','peach','carrot','onion','cabbage','lettuce','parsley','pepper','coffee','tea','water','milk','cake','cookie','chicken','meat','butter','beer','wine','juice','egg','honey','sugar','salt','food','fruit','vegetable','dish','breakfast','lunch','dinner','dessert','chocolate','potato','tomato','cucumber'], tags: ['jedzenie'] },
  { keywords: ['house','room','garden','park','forest','bridge','station','port','square','market','shop','bank','hospital','church','castle','palace','hotel','bar','club','theatre','stadium','school','university','library','pharmacy','street','road','mountain','valley','river','island','beach','city','cinema','museum','airport','kitchen','bathroom','bedroom','dining','basement','garage','office','restaurant','country','world'], tags: ['miejsca'] },
  { keywords: ['pen','pencil','notebook','computer','telephone','key','watch','ring','ticket','passport','letter','painting','carpet','armchair','pot','plate','knife','fork','cup','umbrella','backpack','wallet','tie','hat','shoe','coat','sweater','suit','book','newspaper','bag','suitcase','handbag','dress','skirt','blouse','shirt','jacket','pillow','quilt','curtain','lamp','candle','wardrobe','shelf','bench','sofa','floor','wall','bottle','glass','spoon','chair','desk','mirror','table','window','door','toy','gift','present','car','bicycle','train','bus','airplane','ship','tram','scooter','glove','scarf'], tags: ['przedmioty'] },
  { keywords: ['love','friendship','hope','joy','longing','faith','truth','freedom','knowledge','wisdom','thought','idea','art','culture','music','song','happiness','health','beauty','life','death','feeling','peace','noise','sound','voice','taste','smell','touch','time','work','science','learning','history','literature','sport','dance'], tags: ['uczucia'] },
  { keywords: ['rain','snow','wind','frost','ice','fire','smoke','sand','stone','flower','bush','leaf','sky','sun','moon','tree','meadow','nature','storm','fog','cloud','star','plant','grass','rose','pine','birch','willow'], tags: ['nature'] },
  { keywords: ['color','colour'], tags: ['kolory'] },
];

function getNounThemes(en) {
  const themes = new Set(['general']);
  for (const rule of THEME_RULES) {
    if (rule.keywords.some(k => wordMatch(k, en))) {
      rule.tags.forEach(t => themes.add(t));
    }
  }
  return [...themes];
}

const COLOR_ADJ = ['white','black','red','blue','green','yellow','grey','gray','brown','orange','purple','pink','golden','silver','colorful','bright','dark','light'];
const EMOTION_ADJ = ['happy','sad','cheerful','tired','nervous','angry','satisfied','lonely','calm','lazy','brave','cowardly','kind','nice','pleasant','unpleasant','jealous','worried','proud','shy','bored','excited','curious'];

function getAdjThemes(en) {
  const themes = new Set(['general']);
  if (COLOR_ADJ.some(c => wordMatch(c, en))) themes.add('kolory');
  if (EMOTION_ADJ.some(e => wordMatch(e, en))) themes.add('uczucia');
  return [...themes];
}

// Process line by line
function processLines(content, type) {
  const lines = content.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("['")) {
      const strings = trimmed.match(/'([^']*)'/g);

      if (type === 'noun' && strings && strings.length === 3) {
        const en = strings[2].replace(/'/g, '').replace(/\([^)]*\)/g, '').trim();
        const themes = getNounThemes(en);
        const tagStr = themes.map(t => "'" + t + "'").join(',');
        line = line.replace(/'\]/, "', [" + tagStr + "]]");
      } else if (type === 'adj' && strings && strings.length === 7) {
        const en = strings[6].replace(/'/g, '');
        const themes = getAdjThemes(en);
        const tagStr = themes.map(t => "'" + t + "'").join(',');
        line = line.replace(/'\]/, "', [" + tagStr + "]]");
      }
    }

    result.push(line);
  }

  return result.join('\n');
}

let n = fs.readFileSync('js/data/a1/nouns.js', 'utf8');
n = processLines(n, 'noun');
fs.writeFileSync('js/data/a1/nouns.js', n);
console.log('nouns.js done');

let a = fs.readFileSync('js/data/a1/adjectives.js', 'utf8');
a = processLines(a, 'adj');
fs.writeFileSync('js/data/a1/adjectives.js', a);
console.log('adjectives.js done');

// Verify
const nv = fs.readFileSync('js/data/a1/nouns.js', 'utf8');
const nlines = nv.split('\n').filter(l => l.trim().startsWith("['"));
console.log('\nSample nouns:');
nlines.slice(0,5).forEach(l => console.log(' ', l.trim().slice(0,100)));

const av = fs.readFileSync('js/data/a1/adjectives.js', 'utf8');
const alines = av.split('\n').filter(l => l.trim().startsWith("['"));
console.log('\nSample adj:');
alines.slice(0,5).forEach(l => console.log(' ', l.trim().slice(0,100)));

// Count total tags
let nounTagged = nlines.filter(l => l.includes(", ['")).length;
let adjTagged = alines.filter(l => l.includes(", ['")).length;
console.log('\nTagged nouns:', nounTagged + '/' + nlines.length);
console.log('Tagged adj:', adjTagged + '/' + alines.length);
