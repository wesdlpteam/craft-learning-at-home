let selectedMath = null;
let selectedMathText = '';
let mathsGroup = '';
let lastUnsureText = '';
const mathsGroups = {
  Number: ['Numbers, fractions & amounts', 'Counting, calculating and solving number problems'],
  Algebra: ['Patterns & missing numbers', 'Rules, formulas and finding unknown amounts'],
  Measurement: ['Measuring, time & angles', 'Lengths, area, volume, clocks and turns'],
  Space: ['Shapes, maps & positions', 'Visualising shapes and describing where things are'],
  Statistics: ['Charts & information', 'Collecting information and making sense of results'],
  Probability: ['Chance & likelihood', 'Exploring what might happen and how likely it is']
};
function schoolYearLabel(value) { return value === 'F' ? 'Foundation (Prep)' : value === 'unsure' ? 'Not sure' : 'Year ' + value; }
function mathsAvailable() { return $('subject').value === 'Maths' && /^[F0-9]+$/.test($('school-year').value) && Number($('school-year').value === 'F' ? 0 : $('school-year').value) <= 10; }
function clearMathSelection(clearGenerated = false) {
  if (clearGenerated && ((selectedMath && $('difficulty').value === selectedMathText) || (lastUnsureText && $('difficulty').value === lastUnsureText))) $('difficulty').value = '';
  selectedMath = null; selectedMathText = ''; lastUnsureText = '';
  if ($('math-selection')) $('math-selection').textContent = '';
}
function mathsSentence(item) { return (audience === 'student' ? 'I need help learning how to ' : 'They need help learning how to ') + item.label.charAt(0).toLowerCase() + item.label.slice(1) + '.'; }
function unsureSentence() { return (audience === 'student' ? 'I am' : 'They are') + ' finding ' + $('subject').value + ' difficult, but I am not sure which skill is the problem. Ask one simple question to help identify a starting point before building.'; }
function syncMathAudience() {
  if (lastUnsureText && $('difficulty').value === lastUnsureText) { lastUnsureText = unsureSentence(); $('difficulty').value = lastUnsureText; }
  if (selectedMath && $('difficulty').value === selectedMathText) {
    selectedMathText = mathsSentence(selectedMath);
    $('difficulty').value = selectedMathText;
  }
}
function renderExamples() {
  const available = mathsAvailable();
  $('math-picker').hidden = !available;
  $('legacy-picker').hidden = available || !$('school-year').value;
  $('age-wrap').hidden = available || !$('school-year').value;
  if (!available) {
    legacyRenderExamples();
    if (!$('school-year').value) $('difficulty').placeholder = 'Describe the tricky bit in your own words, or choose a school year for topic ideas.';
    $('example-hint').textContent = $('subject').value === 'Maths' ? 'The maths topic picker covers Foundation–Year 10. Describe the tricky bit, or choose an age for general ideas.' : 'These are general suggestions, not curriculum-mapped topics. Describe the tricky bit or choose an age for ideas.';
    return;
  }
  $('difficulty').placeholder = 'Click a skill above, or describe the tricky bit in your own words.';
  const year = $('study-year').value || $('school-year').value;
  const sourceYear = year === 'F' ? 'Foundation Year' : 'Year ' + year;
  const items = mathsCurriculum.items.filter(item => item.year === sourceYear);
  $('math-year-note').textContent = 'Showing ' + schoolYearLabel(year) + ' Maths. Choose a topic, then the part that feels difficult.';
  $('topic-groups').replaceChildren();
  for (const [key, [label, hint]] of Object.entries(mathsGroups)) {
    if (!items.some(item => item.strand === key)) continue;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'topic-card';
    button.setAttribute('aria-pressed', String(mathsGroup === key));
    const title = document.createElement('strong'); title.textContent = label;
    const detail = document.createElement('span'); detail.textContent = hint;
    button.append(title,detail);
    button.addEventListener('click', () => { mathsGroup = key; renderExamples(); $('skills-heading').focus(); });
    $('topic-groups').appendChild(button);
  }
  $('math-skills').replaceChildren();
  $('skills-panel').hidden = !mathsGroup || !items.some(item => item.strand === mathsGroup);
  $('skills-heading').textContent = mathsGroup ? 'Which part of ' + mathsGroups[mathsGroup][0].toLowerCase() + '?' : 'Which part feels difficult?';
  items.filter(item => item.strand === mathsGroup).forEach(item => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = item.label;
    button.setAttribute('aria-pressed', String(selectedMath?.code === item.code));
    button.addEventListener('click', () => {
      selectedExample = null; lastExampleText = '';
      selectedMath = item; selectedMathText = mathsSentence(item);
      $('difficulty').value = selectedMathText; $('error').hidden = true;
      $('difficulty').removeAttribute('aria-invalid'); renderExamples(); resizeDifficulty(); $('difficulty').focus();
    });
    $('math-skills').appendChild(button);
  });
  $('math-selection').textContent = selectedMath ? 'Selected: ' + schoolYearLabel(year) + ' · ' + selectedMath.label + '. You can edit the wording below; editing removes the curriculum link.' : '';
}
function curriculumPromptContext() {
  let text = '\nSchool year: ' + schoolYearLabel($('school-year').value) + '.\nSubject: ' + $('subject').value + '.\n';
  if (selectedMath && selectedMathText === $('difficulty').value) {
    text += '\nCURRICULUM CONTEXT\nAustralian Curriculum Mathematics, Version 9.0. Topic level: ' + selectedMath.year + '.\nReference: ' + selectedMath.code + '\nOfficial content description: ' + selectedMath.description + '\nParent-friendly focus: ' + selectedMath.label + '\nSource: ' + mathsCurriculum.source + '\nUse this description as the teaching target, not a claim of ACARA endorsement. If the topic level differs from the school year, teach the selected topic level with age-respectful presentation. Do not ask the parent for curriculum terminology.\n';
  }
  return text;
}
function resetCurriculum() { selectedMath = null; selectedMathText = ''; lastUnsureText = ''; mathsGroup = ''; $('earlier-level').open = false; }
function initCurriculumPicker() {
  for (const id of ['school-year','study-year']) {
    for (const value of ['F','1','2','3','4','5','6','7','8','9','10']) {
      const option = document.createElement('option'); option.value = value; option.textContent = schoolYearLabel(value); $(id).appendChild(option);
    }
  }
  for (const value of ['11','12','unsure']) {
    const option=document.createElement('option');option.value=value;option.textContent=schoolYearLabel(value);$('school-year').appendChild(option);
  }
  $('school-year').addEventListener('change', () => {
    clearMathSelection(true); clearGeneralSelection(); mathsGroup = '';
    $('study-year').value = $('school-year').value; renderExamples(); resizeDifficulty();
  });
  $('subject').addEventListener('change', () => { clearMathSelection(true); clearGeneralSelection(); mathsGroup = ''; renderExamples(); resizeDifficulty(); });
  $('study-year').addEventListener('change', () => { clearMathSelection(true); mathsGroup = ''; renderExamples(); resizeDifficulty(); });
  $('write-own').addEventListener('click', () => { clearMathSelection(true); clearGeneralSelection(); renderExamples(); resizeDifficulty(); $('difficulty').focus(); });
  $('not-sure').addEventListener('click', () => {
    clearMathSelection(); selectedExample=null;
    lastUnsureText = unsureSentence(); $('difficulty').value = lastUnsureText;
    renderExamples(); resizeDifficulty(); $('difficulty').focus();
  });
}

