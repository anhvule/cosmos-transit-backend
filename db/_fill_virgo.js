// db/_fill_virgo.js
//
// Reads _virgo_<lens>.js (which exports a map name -> description)
// and patches seed_<lens>_virgo.js in place by replacing
// `description: ''` with the authored text. Idempotent.

const fs = require('fs');
const path = require('path');

const LENSES = ['career', 'relationship', 'food', 'advice'];

for (const lens of LENSES) {
  const fillsPath = path.join(__dirname, `_virgo_${lens}.js`);
  if (!fs.existsSync(fillsPath)) {
    console.log(`SKIP: ${fillsPath} missing`);
    continue;
  }
  delete require.cache[require.resolve(fillsPath)];
  const fills = require(fillsPath);
  const seedPath = path.join(__dirname, `seed_${lens}_virgo.js`);
  let content = fs.readFileSync(seedPath, 'utf8');
  let filled = 0, missing = 0;
  const misses = [];

  for (const [name, desc] of Object.entries(fills)) {
    if (!desc) continue;
    const safeName = name.replace(/'/g, "\\'");
    const safeDesc = desc
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'");
    const empty  = `{ name: '${safeName}', description: '' }`;
    const filledLine = `{ name: '${safeName}', description: '${safeDesc}' }`;
    if (content.includes(empty)) {
      content = content.replace(empty, filledLine);
      filled++;
    } else if (content.includes(filledLine)) {
      filled++;
    } else {
      missing++;
      misses.push(name);
    }
  }
  fs.writeFileSync(seedPath, content);
  console.log(`[${lens}] filled=${filled} missing=${missing}`);
  if (misses.length) {
    console.log(`  misses (first 5):`);
    for (const m of misses.slice(0, 5)) console.log(`    ${m}`);
  }
}
