const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto'), vm = require('node:vm');
const root = path.resolve(__dirname,'../..');
const read = name => JSON.parse(fs.readFileSync(path.join(root,name),'utf8').replace(/^\uFEFF/,''));
const d = read('curriculum/senior/catalogue.json'), audit = read('scripts/senior/source-audit.json');
assert.equal(d.release,'20260909-senior-1'); assert.equal(d.subjects.length,316);
assert.equal(new Set(d.subjects.map(s=>s.id)).size,316);
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'curriculum/senior/catalogue.json'),'utf8').replace(/\r\n/g,'\n')).digest('hex'),audit.sha256);
const by = id => {const s=d.subjects.find(s=>s.id===id); assert(s,id); return s;};
const ib = read('scripts/senior/ib-inventory.json');
for(const s of ib.subjects) assert.deepEqual(by('ib-'+s.code).levels,s.levels);
for(const code of Object.keys(ib.excluded)) assert(!d.subjects.some(s=>s.inventoryCode===code));
for(let i=0;i<126;i++) assert(d.subjects.some(s=>s.inventoryIndex===([17,18,19].includes(i)?16:i)),`VCE index ${i}`);
for(const s of d.subjects) {
 assert(s.source.startsWith('https://')); assert(['outline','general'].includes(s.coverage));
 assert(s.coverage==='general'||s.topics.length>0,s.id);
 const seen = new Set();
 for(const t of s.topics) {
  assert(!seen.has(t.id));seen.add(t.id);assert(t.label.length>8&&t.label.length<160, t.label);
  assert(!/opportunities for students|Area of Study|Key knowledge/.test(t.label));
  assert(t.source.startsWith('https://'));
  if(s.programme==='VCE') assert(t.units.every(u=>s.units.includes(u)));
  else {assert(t.years.length);assert(t.levels.every(l=>['SL','HL'].includes(l)));}
 }
}
for(const id of ['vce-algorithmics-hess','vce-extended-investigation','vce-data-analytics','vce-software-development','vce-music-inquiry']) assert.deepEqual(by(id).units,['3','4']);
assert.deepEqual(by('vce-bridging-english-as-an-additional-language').units,['1','2']);
assert.deepEqual(by('vce-foundation-english').units,['1','2']);
assert.deepEqual(by('ib-100246').levels,['SL']); // Hebrew B
assert.deepEqual(by('ib-149712').levels,['HL']);
const general = by('vce-general-mathematics');
assert.deepEqual(general.topics.filter(t=>t.units.includes('3')).map(t=>t.heading).sort(),['Data analysis','Recursion and financial modelling'].sort());
assert.deepEqual(general.topics.filter(t=>t.units.includes('4')).map(t=>t.heading).sort(),['Matrices','Networks and decision mathematics'].sort());
for(const id of ['ib-100132','ib-100146','ib-100474','ib-100608']) {
 const s=by(id);assert(s.topics.some(t=>t.years.includes(2026)&&/last assessment 2026/.test(t.version)));
 assert(s.topics.some(t=>t.years.includes(2027)&&/first assessment 2027/.test(t.version)));
 assert(!s.topics.some(t=>t.years.includes(2027)&&/last assessment 2026/.test(t.version)));
}
assert(by('ib-100680').topics.some(t=>t.years.includes(2028)&&/first assessment 2028/.test(t.version)));
assert.equal(d.subjects.filter(s=>s.programme==='VCE'&&s.coverage==='general').length,29);
for(const name of ['senior-picker.js','curriculum-picker.js']) new vm.Script(fs.readFileSync(path.join(root,name),'utf8'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('senior-picker.js?v='+d.release));assert(html.includes('Do not publish or share it automatically'));
assert(!/localStorage|sessionStorage|sendBeacon|api[_-]?key/i.test(fs.readFileSync(path.join(root,'senior-picker.js'),'utf8')));
console.log(`PASS: ${d.subjects.length} senior choices, 174 IB source entries, 126 VCAA source entries, allowed units/levels, course transitions, source fingerprints and static privacy checks.`);
