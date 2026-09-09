const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8').replace(/^\uFEFF/,'');
const manifest = vm.runInNewContext(read('curriculum/manifest.js')+';curriculumManifest');
const audit = JSON.parse(read('scripts/source-audit.json'));
const expectedAreas = {'English':284,'Mathematics':240,'Science':152,'Humanities and Social Sciences':333,'Health and Physical Education':97,'Technologies':124,'The Arts':165,'Languages':1283};
const counts={}, ids=new Set(), all=[];
let courseCount=0, levelCount=0;
assert.equal(manifest.subjects.length,34);
assert.equal(manifest.subjects.filter(s=>s.area==='Languages').length,18);
for(const subject of manifest.subjects) {
  assert.match(subject.file,/^curriculum\/[a-z-]+\.json$/);
  const data=JSON.parse(read(subject.file));
  assert.equal(data.subject,subject.id);
  assert.equal(data.release,manifest.release);
  assert.equal(data.items.length,subject.count);
  assert.deepEqual([...new Set(data.items.flatMap(r=>r.years))].sort((a,b)=>a-b),Array.from(subject.years));
  for(const item of data.items) {
    assert.ok(!ids.has(item.id),'Duplicate '+item.id); ids.add(item.id);
    assert.equal(item.code,item.id);
    assert.equal(item.subject,subject.sourceSubject);
    assert.equal(item.area,subject.area);
    assert.ok(item.label.length>10 && item.label.length<160);
    assert.ok(item.topic.length>4);
    assert.ok(!/[\uFFFD]|Ã|Â|â€/.test(item.label+item.topic),'Encoding '+item.id);
    const original={};
    for(const key of ['id','code','area','subject','level','years','pathway','sequence','strand','subStrand','description'].sort()) original[key]=item[key];
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex'),audit[item.id],'Source changed '+item.id);
    assert.ok(item.years.every(y=>Number.isInteger(y)&&y>=0&&y<=10));
    counts[item.area]=(counts[item.area]||0)+1;
    const course=subject.courses.find(c=>c.id===item.course);
    assert.ok(course,'Missing course '+item.id);
    assert.equal(item.pathway,course.pathway);
    assert.equal(item.sequence,course.sequence);
    assert.ok(course.levels.includes(item.level));
    all.push(item);
  }
  for(const course of subject.courses) {
    courseCount++;
    const items=data.items.filter(r=>r.course===course.id);
    assert.deepEqual([...new Set(items.flatMap(r=>r.years))].sort((a,b)=>a-b),Array.from(course.years));
    for(const level of course.levels) {
      levelCount++;
      const subset=items.filter(r=>r.level===level);
      assert.ok(subset.length,'Empty level '+subject.id);
      assert.equal(new Set(subset.map(r=>r.topic+'|'+r.label)).size,subset.length,'Ambiguous labels '+subject.id+' '+level);
    }
  }
}
assert.equal(ids.size,2678);
assert.deepEqual(counts,expectedAreas);
assert.equal(Object.keys(audit).length,2678);
const math=vm.runInNewContext(read('curriculum-maths.js')+';mathsCurriculum');
for(const item of math.items) {
  const current=all.find(r=>r.code===item.code);
  assert.equal(current.label,item.label);
  assert.equal(current.description,item.description);
}
for(const name of ['examples.js','curriculum-picker.js']) new vm.Script(read(name));
const html=read('index.html');
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
assert.ok(html.includes('Do not publish or share it automatically.'));
assert.ok(html.includes('curriculum/manifest.js?v='+manifest.release));
assert.ok(!html.includes('src="curriculum-maths.js'));
console.log('PASS: 2,678 source fingerprints; 34 subjects; 18 language/framework entries; '+courseCount+' courses; '+levelCount+' course-level combinations; all labels, topic identities, bands, metadata and Maths regression checks.');
