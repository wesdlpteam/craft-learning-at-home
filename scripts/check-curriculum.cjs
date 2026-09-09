const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const data = vm.runInNewContext(fs.readFileSync(path.join(root, 'curriculum-maths.js'), 'utf8') + '; mathsCurriculum');
const counts = [12,15,18,23,23,24,24,30,27,23,21];
const strands = {N:'Number',A:'Algebra',M:'Measurement',SP:'Space',ST:'Statistics',P:'Probability'};
assert.equal(data.items.length,240);
assert.equal(new Set(data.items.map(x=>x.code)).size,240);
for (let year=0;year<=10;year++) {
  assert.equal(data.items.filter(x=>x.year === (year ? 'Year '+year : 'Foundation Year')).length, counts[year]);
}
for (const item of data.items) {
  const m = item.code.match(/^AC9M(F|10|[1-9])(N|A|M|SP|ST|P)\d{2}$/);
  assert.ok(m,item.code);
  assert.equal(item.year,m[1]==='F' ? 'Foundation Year' : 'Year '+m[1]);
  assert.equal(item.strand,strands[m[2]]);
  assert.ok(item.label.length > 10 && item.label.length < 150);
  assert.ok(item.description.length > 20);
}
for (const file of ['examples.js','curriculum-picker.js']) new vm.Script(fs.readFileSync(path.join(root,file),'utf8'));
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
assert.ok(html.includes('Do not publish or share it automatically.'));
console.log('PASS: 240 unique descriptors, all 11 year counts, code/year/strand mapping, labels and JavaScript syntax.');
