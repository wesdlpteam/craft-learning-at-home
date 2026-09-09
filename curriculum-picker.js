/* Curriculum selections remain in this page. Subject data is static, same-origin JSON. */
let selectedCurriculum = null;
let selectedCurriculumText = '';
let activeTopic = '';
let lastUnsureText = '';
let subjectData = null;
let pickerState = 'choose';
let loadVersion = 0;
const subjectCache = new Map();

function schoolYearLabel(value) {
  return value === 'F' ? 'Foundation (Prep)' : value === 'unsure' ? 'Not sure' : 'Year ' + value;
}
function schoolYearNumber() {
  const value = $('school-year').value;
  return value === 'F' ? 0 : /^\d+$/.test(value) ? Number(value) : null;
}
function selectedSubject() {
  const id = $('subject').value === 'Languages' ? $('language').value : $('subject').value;
  return curriculumManifest.subjects.find(subject => subject.id === id) || null;
}
function subjectDisplayName() {
  return selectedSubject()?.name || $('subject').selectedOptions[0]?.textContent || 'this subject';
}
function selectedCourse() {
  const subject = selectedSubject();
  const year = schoolYearNumber();
  if (!subject || year === null || year > 10) return null;
  return subject.courses.find(course =>
    course.years.includes(year) &&
    course.sequence === $('language-sequence').value &&
    course.pathway === $('language-pathway').value) || null;
}
function selectedLevel() { return $('study-year').value; }
function contextMatches(item) {
  const subject = selectedSubject(), course = selectedCourse();
  return Boolean(subject && course) && pickerState === 'ready' && subjectData?.subject === subject.id &&
    item.subject === subject.sourceSubject && item.course === course?.id && item.level === selectedLevel();
}
function clearCurriculumSelection(clearGenerated = false) {
  if (clearGenerated && ((selectedCurriculum && $('difficulty').value === selectedCurriculumText) ||
      (lastUnsureText && $('difficulty').value === lastUnsureText))) $('difficulty').value = '';
  selectedCurriculum = null; selectedCurriculumText = ''; lastUnsureText = '';
  $('curriculum-selection').textContent = '';
}
function curriculumSentence(item) {
  return (audience === 'student' ? 'I need help with: ' : 'They need help with: ') +
    item.label.charAt(0).toLowerCase() + item.label.slice(1) + '.';
}
function unsureSentence() {
  return (audience === 'student' ? 'I am' : 'They are') + ' finding ' + subjectDisplayName() +
    ' difficult, but I am not sure which skill is the problem. Ask one simple question to help identify a starting point before building.';
}
function syncCurriculumAudience() {
  if (lastUnsureText && $('difficulty').value === lastUnsureText) {
    lastUnsureText = unsureSentence(); $('difficulty').value = lastUnsureText;
  }
  if (selectedCurriculum && $('difficulty').value === selectedCurriculumText) {
    selectedCurriculumText = curriculumSentence(selectedCurriculum); $('difficulty').value = selectedCurriculumText;
  }
}
function addOption(select, value, label) {
  const option = document.createElement('option');
  option.value = value; option.textContent = label; select.appendChild(option);
}
function availableAtYear(subject) {
  const year = schoolYearNumber();
  return year === null || year > 10 || subject.years.includes(year);
}
function updateSubjects() {
  const previous = $('subject').value || 'Maths';
  $('subject').replaceChildren();
  const areaOrder = ['Mathematics','English','Science','Humanities and Social Sciences','Health and Physical Education','The Arts','Technologies'];
  for (const area of areaOrder) {
    const subjects = curriculumManifest.subjects.filter(s => s.area === area && availableAtYear(s));
    if (!subjects.length) continue;
    const group = document.createElement('optgroup'); group.label = area;
    subjects.forEach(s => addOption(group,s.id,s.name)); $('subject').appendChild(group);
  }
  addOption($('subject'),'Languages','Languages');
  addOption($('subject'),'Other','Something else / not sure');
  $('subject').value = [...$('subject').options].some(o => o.value === previous) ? previous : 'Maths';
  const language = $('language').value;
  $('language').replaceChildren();
  addOption($('language'),'','Choose a language');
  curriculumManifest.subjects.filter(s => s.area === 'Languages' && availableAtYear(s))
    .sort((a,b) => a.name.localeCompare(b.name)).forEach(s => addOption($('language'),s.id,s.name));
  $('language').value = [...$('language').options].some(o => o.value === language) ? language : '';
}
function sequenceName(value) {
  return value === 'F-10 Sequence' ? 'Started in primary school' : value === '7-10 Sequence' ? 'Started in secondary school' : value;
}
function pathwayName(value) {
  if (value.includes('Revival')) return 'Bringing a language back into use';
  if (value.includes('Background-Language and First-Language')) return 'Used at home / first language';
  if (value.includes('Background')) return 'Used at home or in the family';
  if (value.includes('Second-Language')) return 'Learning it as a new language';
  if (value.includes('First-Language')) return 'Used as a first language';
  return value;
}
function configureChoice(id, wrap, values, label, reset) {
  const select = $(id), previous = reset ? '' : select.value;
  select.replaceChildren();
  $(wrap).hidden = values.length <= 1;
  if (values.length <= 1) {
    addOption(select, values[0] || '', values[0] ? label(values[0]) : 'Standard course');
    return;
  }
  addOption(select,'','Choose the closest answer');
  values.forEach(value => addOption(select,value,label(value)));
  addOption(select,'unsure','Not sure');
  select.value = values.includes(previous) || previous === 'unsure' ? previous : '';
}
function configureCourses(resetSequence = false, resetPath = false, resetLevel = false) {
  const subject = selectedSubject(), year = schoolYearNumber();
  $('language-wrap').hidden = $('subject').value !== 'Languages';
  $('language-name-wrap').hidden = !subject?.framework;
  $('framework-note').hidden = !subject?.framework;
  const courses = subject && year !== null && year <= 10 ? subject.courses.filter(c => c.years.includes(year)) : [];
  configureChoice('language-sequence','sequence-wrap',[...new Set(courses.map(c => c.sequence))],sequenceName,resetSequence);
  const possible = courses.filter(c => c.sequence === $('language-sequence').value);
  configureChoice('language-pathway','pathway-wrap',[...new Set(possible.map(c => c.pathway))],pathwayName,resetPath || resetSequence);
  const course = selectedCourse(), previous = resetLevel ? '' : selectedLevel();
  $('study-year').replaceChildren();
  if (course) {
    course.levels.forEach(level => addOption($('study-year'),level,level === 'Foundation Year' ? 'Foundation (Prep)' : level));
    const matching = course.levels.find(level => levelYears(level).includes(year));
    $('study-year').value = course.levels.includes(previous) ? previous : matching || course.levels[0];
  }
}
function levelYears(level) {
  if (level === 'Foundation Year') return [0];
  const numbers = (level.match(/\d+/g) || []).map(Number);
  return numbers.length === 2 ? Array.from({length:numbers[1]-numbers[0]+1},(_,i)=>numbers[0]+i) : numbers;
}
async function loadSubject(subject) {
  if (!subjectCache.has(subject.id)) {
    const pending = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(),12000);
      try {
        const response = await fetch(subject.file + '?v=' + curriculumManifest.release,{signal:controller.signal});
        if (!response.ok) throw new Error('Subject load failed');
        const data = await response.json();
        if (data.release !== curriculumManifest.release || data.subject !== subject.id ||
            !Array.isArray(data.items) || data.items.length !== subject.count) throw new Error('Mismatched subject version');
        return data;
      } finally { clearTimeout(timeout); }
    })();
    subjectCache.set(subject.id,pending);
    pending.catch(() => { if (subjectCache.get(subject.id) === pending) subjectCache.delete(subject.id); });
  }
  return subjectCache.get(subject.id);
}
async function refreshCurriculum(options = {}) {
  const ticket = ++loadVersion;
  subjectData = null;
  configureCourses(options.resetSequence,options.resetPath,options.resetLevel);
  const subject = selectedSubject(), course = selectedCourse(), year = schoolYearNumber();
  if (!subject || !course || year === null || year > 10) {
    pickerState = 'choose'; renderExamples(); return;
  }
  pickerState = 'loading'; renderExamples();
  try {
    const data = await loadSubject(subject);
    if (ticket !== loadVersion) return;
    subjectData = data; pickerState = 'ready';
  } catch {
    if (ticket !== loadVersion) return;
    pickerState = 'error';
  }
  renderExamples(); resizeDifficulty();
}
function eligibleItems() {
  const course = selectedCourse();
  return pickerState === 'ready' && course ? subjectData.items.filter(item => item.course === course.id && item.level === selectedLevel()) : [];
}
function renderExamples() {
  const subject = selectedSubject(), year = schoolYearNumber();
  const ready = pickerState === 'ready';
  $('curriculum-picker').hidden = !ready;
  $('load-retry').hidden = pickerState !== 'error';
  $('topic-status').textContent = '';
  if (pickerState === 'loading') $('topic-status').textContent = 'Loading ' + subjectDisplayName() + ' topics…';
  else if (pickerState === 'error') $('topic-status').textContent = 'These topics could not load. Try again, or describe the tricky bit in your own words.';
  else if (!$('school-year').value) $('topic-status').textContent = 'Choose a school year to see suitable topics.';
  else if (year === null || year > 10) $('topic-status').textContent = 'Mapped topics cover Foundation–Year 10. You can still describe the difficulty and create a general prompt.';
  else if ($('subject').value === 'Languages' && !subject) $('topic-status').textContent = 'Choose a language to see its topics.';
  else if (subject && !selectedCourse()) $('topic-status').textContent = 'Choose the course details above, or use “Not sure” and describe the tricky bit. We will not guess a curriculum pathway.';
  else if (!subject) $('topic-status').textContent = 'Describe the subject and the tricky bit in your own words.';
  const general = !ready && pickerState === 'choose' && $('school-year').value && ['Maths','English','Science','Other'].includes($('subject').value);
  $('legacy-picker').hidden = !general;
  $('age-wrap').hidden = !general;
  if (general) {
    legacyRenderExamples();
    $('example-hint').textContent = 'These are general starting points, not matched curriculum topics. Choose an age for ideas or write your own.';
  }
  $('difficulty').placeholder = ready ? 'Click a skill above, or describe the tricky bit in your own words.' : 'Describe the tricky bit in your own words. Leave out names and personal details.';
  const items = eligibleItems();
  const topics = [...new Set(items.map(item => item.topic))];
  if (!topics.includes(activeTopic)) activeTopic = '';
  $('topic-groups').replaceChildren();
  $('curriculum-skills').replaceChildren();
  $('skills-panel').hidden = !ready || !activeTopic;
  if (!ready) { $('curriculum-selection').textContent = ''; return; }
  $('curriculum-year-note').textContent = 'Showing ' + selectedLevel() + ' · ' + subject.name +
    '. Choose a topic, then the part that feels difficult.';
  for (const topic of topics) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'topic-card';
    button.setAttribute('aria-pressed',String(activeTopic === topic));
    const title = document.createElement('strong'); title.textContent = topic;
    const detail = document.createElement('span');
    const count = items.filter(item => item.topic === topic).length;
    detail.textContent = count + (count === 1 ? ' skill to choose from' : ' skills to choose from');
    button.append(title,detail);
    button.addEventListener('click',() => { activeTopic = topic; renderExamples(); $('skills-heading').focus(); });
    $('topic-groups').appendChild(button);
  }
  $('skills-heading').textContent = activeTopic ? activeTopic + ': which part?' : 'Which part feels difficult?';
  items.filter(item => item.topic === activeTopic).forEach(item => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = item.label; button.dataset.skillId = item.id;
    button.setAttribute('aria-pressed',String(selectedCurriculum?.id === item.id));
    button.addEventListener('click',() => {
      selectedExample = null; lastExampleText = ''; lastUnsureText = '';
      selectedCurriculum = item; selectedCurriculumText = curriculumSentence(item);
      $('difficulty').value = selectedCurriculumText; $('error').hidden = true;
      $('difficulty').removeAttribute('aria-invalid'); renderExamples(); resizeDifficulty(); $('difficulty').focus();
    });
    $('curriculum-skills').appendChild(button);
  });
  $('curriculum-selection').textContent = selectedCurriculum && contextMatches(selectedCurriculum) ?
    'Selected: ' + selectedCurriculum.label + '. You can edit the wording below; editing removes the curriculum link.' : '';
}
function curriculumPromptContext() {
  const subject = selectedSubject(), course = selectedCourse();
  let text = '\nSchool year: ' + schoolYearLabel($('school-year').value) + '.\nSubject: ' + subjectDisplayName() + '.\n';
  if (subject?.framework && $('language-name').value.trim()) text += 'Language being studied: ' + $('language-name').value.trim() + '.\n';
  if (subject?.area === 'Languages') {
    text += course ? 'Language course: ' + [course.sequence,course.pathway].filter(Boolean).join('; ') + '.\n' :
      'Language course or starting point is uncertain. Ask one plain-language question if needed; do not infer a curriculum pathway.\n';
  }
  if (selectedCurriculum && selectedCurriculumText === $('difficulty').value && contextMatches(selectedCurriculum)) {
    const item = selectedCurriculum;
    text += '\nCURRICULUM CONTEXT\nAustralian Curriculum Version 9.0. Learning area: ' + item.area +
      '. Subject: ' + item.subject + '. Topic level: ' + item.level + '.\nReference: ' + item.code +
      '\nOfficial content description: ' + item.description + '\nPlain-language focus: ' + item.label +
      '\nSource: ' + curriculumManifest.source +
      '\nUse the official description as the teaching target, not a claim of ACARA endorsement. The short focus is a navigation aid, not the full standard. If the topic level differs from school year, teach that selected level with age-respectful presentation. Use only course details explicitly supplied above.\n';
  }
  if (subject?.framework) text += '\nThis is a language FRAMEWORK, not a complete syllabus for a named language. If the language or a suitable example is missing, ask for it. Use teacher- or community-approved language materials; do not invent vocabulary, local cultural knowledge or permissions.\n';
  if (subject?.id === 'auslan') text += '\nAuslan is a signed language with its own grammar. Do not substitute spoken-language pronunciation exercises or assume word-for-word English signing. Use verified, teacher-approved signing examples; if unavailable, request an example or build an appropriate text-based concept aid rather than inventing signs or presenting generated animation as authoritative.\n';
  if (subject?.area === 'Languages' && subject.id !== 'auslan') text += '\nUse the named language and its writing system. Use checked examples; acknowledge uncertainty rather than inventing translations. Do not require speech recording or uploads.\n';
  if (subject && ['Health and Physical Education','The Arts','Technologies'].includes(subject.area)) text += '\nFor practical skills, make a suitable explanation, planning or reflection aid. Do not claim that a web activity replaces supervised practice or demonstrates mastery of a physical performance. Use age-appropriate fictional examples rather than asking for personal health, relationship or account details.\n';
  return text;
}
function resetCurriculum() {
  clearCurriculumSelection(); activeTopic = ''; ++loadVersion; subjectData = null;
  $('earlier-level').open = false; $('language').value = ''; $('language-name').value = '';
  updateSubjects(); refreshCurriculum({resetSequence:true,resetPath:true,resetLevel:true});
}
function changeContext(options = {}) {
  clearCurriculumSelection(true); clearGeneralSelection(); activeTopic = '';
  refreshCurriculum(options); resizeDifficulty();
}
function initCurriculumPicker() {
  for (const value of ['F','1','2','3','4','5','6','7','8','9','10','11','12','unsure'])
    addOption($('school-year'),value,schoolYearLabel(value));
  updateSubjects();
  $('school-year').addEventListener('change',() => {
    updateSubjects();
    $('school-year').removeAttribute('aria-invalid'); $('error').hidden = true;
    changeContext({resetSequence:true,resetPath:true,resetLevel:true});
  });
  $('subject').addEventListener('change',() => {
    $('language').value = ''; $('language-name').value = '';
    changeContext({resetSequence:true,resetPath:true,resetLevel:true});
  });
  $('language').addEventListener('change',() => {
    $('language-name').value = ''; changeContext({resetSequence:true,resetPath:true,resetLevel:true});
  });
  $('language-sequence').addEventListener('change',() => changeContext({resetPath:true,resetLevel:true}));
  $('language-pathway').addEventListener('change',() => changeContext({resetLevel:true}));
  $('study-year').addEventListener('change',() => changeContext());
  $('load-retry').addEventListener('click',() => refreshCurriculum());
  $('write-own').addEventListener('click',() => {
    clearCurriculumSelection(true); clearGeneralSelection(); renderExamples(); resizeDifficulty(); $('difficulty').focus();
  });
  $('not-sure').addEventListener('click',() => {
    clearCurriculumSelection(); selectedExample = null;
    lastUnsureText = unsureSentence(); $('difficulty').value = lastUnsureText;
    $('difficulty').removeAttribute('aria-invalid'); $('error').hidden = true;
    renderExamples(); resizeDifficulty(); $('difficulty').focus();
  });
  refreshCurriculum({resetSequence:true,resetPath:true,resetLevel:true});
}
