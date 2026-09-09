/* Static senior course outlines. Answers stay in memory until the user copies a prompt. */
const SENIOR_RELEASE = '20260909-senior-1';
let seniorData = null;
let seniorPending = null;
let seniorState = 'choose';
let seniorTicket = 0;
let seniorSelection = null;
let seniorText = '';
const seniorHelp = [
  ['idea','Understand the main idea','understand the main idea'],
  ['example','Work through an example','work through an example one step at a time'],
  ['apply','Try a new question','apply the idea to a new question'],
  ['explain','Explain an answer','explain an answer using reasons or evidence']
];
function isSenior() { return schoolYearNumber() >= 11; }
function seniorSubject() { return seniorData?.subjects.find(s => s.id === $('senior-subject').value && s.programme === $('senior-programme').value) || null; }
function seniorClear(clearGenerated = false) {
  if (clearGenerated && seniorText && $('difficulty').value === seniorText) $('difficulty').value = '';
  seniorSelection = null; seniorText = '';
}
function seniorSentence(topic,mode = 'idea') {
  const person = audience === 'student' ? 'I need' : 'They need';
  const action = seniorHelp.find(h => h[0] === mode)[2];
  return person + ' help to ' + action + '. The topic is: ' + topic.label.charAt(0).toLowerCase() + topic.label.slice(1) + '.';
}
function seniorSyncAudience() {
  if (seniorSelection && $('difficulty').value === seniorText) {
    seniorText = seniorSentence(seniorSelection.topic,seniorSelection.mode); $('difficulty').value = seniorText;
  }
}
function seniorTopics() {
  const s = seniorSubject(), year = Number($('senior-year').value), level = $('senior-level').value;
  if (!s || s.coverage === 'general' || ![2026,2027,2028].includes(year)) return [];
  if (s.programme === 'VCE') return s.topics.filter(t => t.units.includes(level));
  return s.topics.filter(t => t.years.includes(year) && (!s.levels.length || (level === 'unsure' ? s.levels.every(l => t.levels.includes(l)) : t.levels.includes(level))));
}
function seniorConfigureLevel() {
  const s = seniorSubject(); $('senior-level').replaceChildren();
  $('senior-level-wrap').hidden = !s || !(s.units || s.levels).length;
  if (!s) return;
  $('senior-level-label').textContent = s.programme === 'VCE' ? 'Which unit is being studied?' : 'Which course level?';
  $('senior-level-hint').textContent = s.programme === 'VCE' ? 'Units are parts of a course. They do not always match the school year.' : 'Standard Level (SL) and Higher Level (HL) are different course options. HL explores more material or greater depth.';
  addOption($('senior-level'),'','Choose, or select Not sure');
  (s.units || s.levels).forEach(v => addOption($('senior-level'),v,s.programme === 'VCE' ? 'Unit '+v : v === 'SL' ? 'Standard Level (SL)' : 'Higher Level (HL)'));
  addOption($('senior-level'),'unsure','Not sure');
  // Even a single available level requires an explicit choice: never infer it from school year.
}
function seniorList() {
  const previous = $('senior-subject').value, programme = $('senior-programme').value;
  const query = $('senior-search').value.trim().toLocaleLowerCase().replace(/\bmaths\b/g,'mathemat');
  const matches = (seniorData?.subjects || []).filter(s => s.programme === programme && (s.name+' '+s.group).toLocaleLowerCase().includes(query));
  $('senior-subject').replaceChildren(); addOption($('senior-subject'),'','Choose a subject');
  for (const group of [...new Set(matches.map(s => s.group))]) {
    const opt = document.createElement('optgroup'); opt.label = group;
    matches.filter(s => s.group === group).forEach(s => addOption(opt,s.id,s.name)); $('senior-subject').appendChild(opt);
  }
  if (matches.some(s => s.id === previous)) $('senior-subject').value = previous;
  else { seniorClear(true); seniorConfigureLevel(); }
  $('senior-search-count').textContent = matches.length ? matches.length+(matches.length === 1 ? ' course matches. Choose it below.' : ' courses match. Choose one below.') : 'No matching course. Try fewer words, or describe the subject in your own words below.';
}
async function refreshSenior() {
  const ticket = ++seniorTicket;
  if (!isSenior()) return;
  if (!['IB','VCE'].includes($('senior-programme').value)) { seniorState = 'choose'; renderSenior(); return; }
  if (seniorData) { seniorState = 'ready'; seniorList(); renderSenior(); return; }
  seniorState = 'loading'; renderSenior();
  try {
    if (!seniorPending) {
      seniorPending = (async () => {
        const controller = new AbortController(), timer = setTimeout(() => controller.abort(),12000);
        try {
          const response = await fetch('curriculum/senior/catalogue.json?v='+SENIOR_RELEASE,{signal:controller.signal});
          if (!response.ok) throw new Error('Senior data unavailable');
          const data = await response.json();
          if (data.release !== SENIOR_RELEASE || !Array.isArray(data.subjects) || data.subjects.length !== 316) throw new Error('Senior data version mismatch');
          return data;
        } finally { clearTimeout(timer); }
      })();
    }
    seniorData = await seniorPending;
    if (ticket !== seniorTicket || !isSenior()) return;
    seniorState = 'ready'; seniorList();
  } catch {
    seniorPending = null;
    if (ticket !== seniorTicket || !isSenior()) return;
    seniorState = 'error';
  }
  renderSenior();
}
function seniorChoose(topic,mode) {
  selectedExample = null; lastExampleText = ''; lastUnsureText = '';
  seniorSelection = {topic,mode}; seniorText = seniorSentence(topic,mode);
  $('difficulty').value = seniorText; $('difficulty').removeAttribute('aria-invalid'); $('error').hidden = true;
  renderSenior(); resizeDifficulty();
}
function renderSenior() {
  if (!isSenior()) return;
  for (const id of ['curriculum-picker','legacy-picker','age-wrap','load-retry']) $(id).hidden = true;
  $('topic-status').textContent = '';
  $('senior-picker').hidden = false;
  const ready = seniorState === 'ready' && ['IB','VCE'].includes($('senior-programme').value);
  $('senior-details').hidden = !ready;
  $('senior-retry').hidden = seniorState !== 'error';
  const s = seniorSubject(), items = ready ? seniorTopics() : [];
  $('senior-year-label').textContent = $('senior-programme').value === 'IB' ? 'Which year are the final IB exams?' : 'Which year is this unit being studied?';
  $('senior-course-details').hidden = !s;
  $('senior-selected-course').textContent = s && s.name.length > 32 ? 'Selected course: '+s.name : '';
  $('senior-selected-course').hidden = !s || s.name.length <= 32;
  let note = seniorState === 'loading' ? 'Loading senior courses…' : seniorState === 'error' ? 'Senior topics could not load. Try again, or use your own words below.' : !ready ? 'Choose a programme, or use Not sure and describe the tricky bit below.' : !s ? 'Search or browse the subjects, then choose the course being studied.' : '';
  if (s) {
    if (s.coverage === 'general') note = 'This course uses school- or qualification-specific content. Add the topic or a short teacher-provided example below. We will create a general starting prompt, without guessing an official syllabus.';
    else if (!['2026','2027','2028'].includes($('senior-year').value)) note = 'Choose the study or exam year to see the matching outline. For another year or Not sure, use your own words; the prompt will ask which course applies.';
    else if (!items.length) note = 'Choose the unit or level to see its topics. If unsure, use your own words below; we will not guess a unit.';
    else note = 'Choose a topic, then the kind of help needed. These are short course outlines, not every skill or school-selected option.';
    if (s.programme === 'VCE' && ['2027','2028'].includes($('senior-year').value)) note += ' Showing the currently published VCAA design, checked September 2026. Confirm with the teacher that it applies to the selected study year.';
    $('senior-source').href = s.source;
    $('senior-source').textContent = s.programme === 'VCE' ? 'View the VCAA course source' : 'View the IB course source';
    $('senior-version').textContent = [...new Set(items.map(t => t.version || s.version))].join('; ') || s.version;
    $('senior-context').placeholder = s.coverage === 'general' ? 'Teacher’s topic, module or language. No personal details.' : 'A topic or example from class. No names or personal details.';
  }
  $('senior-status').textContent = note;
  $('senior-topics').replaceChildren();
  $('senior-topics-wrap').hidden = !items.length;
  items.forEach(topic => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'topic-card';
    button.textContent = topic.label; button.dataset.seniorTopic = topic.id;
    button.setAttribute('aria-pressed',String(seniorSelection?.topic.id === topic.id));
    button.addEventListener('click',() => { seniorChoose(topic,'idea'); $('senior-help-heading').focus(); });
    $('senior-topics').appendChild(button);
  });
  const selection = seniorSelection && items.some(t => t.id === seniorSelection.topic.id) ? seniorSelection : null;
  $('senior-help-wrap').hidden = !selection;
  $('senior-help-buttons').replaceChildren();
  if (selection) seniorHelp.forEach(([mode,label]) => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.setAttribute('aria-pressed',String(selection.mode === mode));
    button.addEventListener('click',() => { seniorChoose(selection.topic,mode); $('difficulty').focus(); });
    $('senior-help-buttons').appendChild(button);
  });
  $('senior-selection').textContent = selection ? 'Selected: '+selection.topic.label+'. You can edit the wording below; editing removes the topic link.' : '';
  $('difficulty').placeholder = 'Choose a senior topic above, or describe the tricky bit in your own words.';
}
function seniorPromptContext() {
  const s = seniorSubject(), programme = $('senior-programme').value;
  let text = '\nSchool year: '+schoolYearLabel($('school-year').value)+'.\nProgramme: '+(programme === 'IB' ? 'IB Diploma Programme' : programme === 'VCE' ? 'Victorian Certificate of Education (VCE)' : 'Not sure')+'.\n';
  if (!s) return text+'Senior subject or course is uncertain. Ask a short question if needed; do not infer a programme, unit, level or syllabus.\n';
  text += 'Subject/course: '+s.name+'.\n';
  const level = $('senior-level').value, year = $('senior-year').value;
  if ((s.units || s.levels).length) text += (s.programme === 'VCE' ? 'Unit: ' : 'Course level: ')+(level && level !== 'unsure' ? level : 'Not sure')+'.\n';
  text += (s.programme === 'IB' ? 'Final IB exam year: ' : 'Unit study year: ')+(['2026','2027','2028'].includes(year) ? year : 'Other or not sure')+'.\n';
  if ($('senior-context').value.trim()) text += 'Teacher-provided topic or course detail: '+$('senior-context').value.trim()+'\n';
  const item = seniorSelection && $('difficulty').value === seniorText && seniorTopics().find(t => t.id === seniorSelection.topic.id);
  text += '\nSENIOR COURSE CONTEXT\n'+(item ? 'Selected plain-language focus: '+item.label+'\n'+(item.reference ? 'VCAA outline locator: '+item.reference+'; unit(s) '+item.units.join(', ')+'.\n' : '')+'Course version: '+(item.version || s.version)+'\nSource: '+item.source : 'General starting point; no curriculum topic mapping has been selected.\nCourse listing: '+s.source)+'\n';
  text += 'These are original summaries of public course outlines, not full licensed syllabuses or an IB/VCAA endorsement. Use only the supplied course and version. Do not invent assessment requirements, official codes, prescribed texts or school-selected options. Ask for a short teacher-provided example where necessary.\n';
  if (!item || level === 'unsure' || !level && (s.units || s.levels).length) text += 'Some course details are uncertain. Do not infer a unit, level or syllabus from school year. Clarify any missing detail needed before building.\n';
  if (s.programme === 'VCE' && year !== '2026') text += 'This is the published VCAA design checked September 2026. Before claiming alignment for this study year, ask whether the teacher has confirmed that this design applies. Otherwise provide only general concept help.\n';
  if (s.coverage === 'general') text += 'This school-based, pilot, language-request or VET pathway needs its actual course/module/topic from the teacher. The listing does not establish a detailed syllabus or VCE unit number.\n';
  if (/auslan/i.test(s.name)) text += 'Auslan is a signed language. Use verified teacher-approved examples; do not invent signs, substitute pronunciation tasks or claim generated signing is authoritative.\n';
  if (/Aboriginal|Language A: Literature \(special/i.test(s.name)) text += 'Ask for the named language and approved examples. Respect community permissions and do not invent vocabulary or local cultural knowledge.\n';
  text += 'For practical subjects, build an explanation, planning or reflection aid; it does not replace supervised practical work. For essays, investigations and CAS, teach the process with examples: do not fabricate evidence, experiences or assessed submissions.\n';
  return text;
}
function initSenior() {
  $('senior-programme').addEventListener('change',() => {
    clearCurriculumSelection(true); clearGeneralSelection(); $('senior-search').value = ''; $('senior-subject').value = ''; $('senior-context').value = ''; $('senior-year').value = ''; seniorConfigureLevel(); refreshSenior(); resizeDifficulty();
  });
  $('senior-search').addEventListener('input',() => { const previous = $('senior-subject').value; seniorList(); if (previous !== $('senior-subject').value) { clearCurriculumSelection(true); $('senior-context').value = ''; } renderSenior(); resizeDifficulty(); });
  $('senior-subject').addEventListener('change',() => { clearCurriculumSelection(true); clearGeneralSelection(); $('senior-context').value = ''; seniorConfigureLevel(); renderSenior(); resizeDifficulty(); });
  for (const id of ['senior-level','senior-year']) $(id).addEventListener('change',() => { clearCurriculumSelection(true); clearGeneralSelection(); renderSenior(); resizeDifficulty(); });
  $('senior-retry').addEventListener('click',refreshSenior);
}
