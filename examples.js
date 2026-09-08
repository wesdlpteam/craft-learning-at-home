// Suggested starting points, not curriculum mappings or assumptions about ability.
const exampleSets = {
  "4–5": [
    [
      "Counting objects",
      "counting a group of objects once each and saying how many there are"
    ],
    [
      "More or fewer",
      "comparing two groups to work out which has more or fewer objects"
    ],
    [
      "Shapes",
      "recognising circles, squares and triangles in everyday objects"
    ],
    [
      "Letter sounds",
      "connecting letters with the sounds they make"
    ],
    [
      "Retelling a story",
      "putting the beginning, middle and end of a familiar story in order"
    ],
    [
      "Rhyming words",
      "hearing which words rhyme, such as cat and hat"
    ],
    [
      "Living things",
      "sorting familiar things into living and non-living groups"
    ],
    [
      "What plants need",
      "understanding why a plant needs water and light"
    ],
    [
      "Pushes and pulls",
      "exploring how pushing and pulling makes objects move"
    ]
  ],
  "6–7": [
    [
      "Adding and subtracting",
      "choosing whether to add or subtract in a short story problem"
    ],
    [
      "Tens and ones",
      "understanding that 34 means three tens and four ones"
    ],
    [
      "Equal halves",
      "splitting a shape or group into two equal halves"
    ],
    [
      "Sounding out words",
      "blending letter sounds to read an unfamiliar short word"
    ],
    [
      "Understanding a story",
      "explaining what happened in a short story and why"
    ],
    [
      "Writing a sentence",
      "turning an idea into a complete sentence with a capital letter and full stop"
    ],
    [
      "Animal needs",
      "explaining how an animal gets food, water and shelter"
    ],
    [
      "Changing materials",
      "describing what happens when ice melts or water freezes"
    ],
    [
      "Light and shadows",
      "understanding how blocking a light source makes a shadow"
    ]
  ],
  "8–9": [
    [
      "Times tables",
      "using equal groups to work out multiplication facts and related division facts"
    ],
    [
      "Fractions",
      "placing halves, quarters and thirds on a number line and comparing their sizes"
    ],
    [
      "Word problems",
      "choosing a calculation for a multiplication or division word problem"
    ],
    [
      "Reading between the lines",
      "using clues in a story to explain how a character feels"
    ],
    [
      "Paragraphs",
      "grouping related sentences into a paragraph with one main idea"
    ],
    [
      "Spelling patterns",
      "choosing a spelling pattern for a long vowel sound in a word"
    ],
    [
      "Food chains",
      "explaining how energy passes from plants to animals in a simple food chain"
    ],
    [
      "Solids, liquids and gases",
      "comparing solids, liquids and gases using everyday examples"
    ],
    [
      "Forces and movement",
      "explaining how friction changes the way an object moves"
    ]
  ],
  "10–11": [
    [
      "Fractions",
      "finding equivalent fractions and adding fractions with the same denominator"
    ],
    [
      "Decimals",
      "comparing decimals such as 0.6 and 0.45 using place value"
    ],
    [
      "Multi-step problems",
      "breaking a word problem into steps and choosing the calculations needed"
    ],
    [
      "Evidence in a text",
      "supporting an explanation about a character with clues from the text"
    ],
    [
      "Persuasive writing",
      "writing a clear opinion supported by reasons and examples"
    ],
    [
      "Summarising",
      "picking out the main ideas of a text without copying every detail"
    ],
    [
      "The water cycle",
      "explaining evaporation, condensation and precipitation as connected parts of the water cycle"
    ],
    [
      "Electric circuits",
      "understanding why a simple circuit needs a complete loop for a bulb to light"
    ],
    [
      "Adaptations",
      "explaining how a feature of an animal helps it survive in its environment"
    ]
  ],
  "12–13": [
    [
      "Fractions",
      "comparing fractions and adding or subtracting fractions with different denominators, such as 3/4 + 2/3, and explaining why a common denominator is needed"
    ],
    [
      "Percentages",
      "connecting fractions, decimals and percentages and using them to work out a discount"
    ],
    [
      "Word problems",
      "working through a multi-step word problem involving fractions or ratios and explaining each calculation"
    ],
    [
      "Reading between the lines",
      "using evidence from a text to explain an implied idea or a character’s motivation"
    ],
    [
      "Persuasive writing",
      "building a persuasive paragraph with a clear claim, supporting evidence and an explanation"
    ],
    [
      "Explaining a quote",
      "explaining how a quotation supports an idea instead of just repeating what it says"
    ],
    [
      "Particles and changes",
      "using a particle model to explain changes of state, including evaporation and condensation"
    ],
    [
      "Food webs",
      "predicting how a change in one population could affect other organisms in a food web"
    ],
    [
      "Fair experiments",
      "identifying what to change, measure and keep the same when planning a fair experiment"
    ]
  ],
  "14–15": [
    [
      "Algebra",
      "expanding brackets and solving linear equations while keeping both sides balanced"
    ],
    [
      "Graphs",
      "connecting the gradient and intercept of a straight-line graph to its equation"
    ],
    [
      "Probability",
      "working out probabilities for two-step events using a table or tree diagram"
    ],
    [
      "Analysing language",
      "explaining how a writer’s language choices shape a reader’s response, using evidence"
    ],
    [
      "Essay paragraphs",
      "linking a paragraph’s argument, evidence and analysis back to the essay question"
    ],
    [
      "Comparing texts",
      "explaining similarities and differences in how two texts present an idea"
    ],
    [
      "Chemical reactions",
      "balancing a simple chemical equation and explaining conservation of atoms"
    ],
    [
      "Forces",
      "connecting force, mass and acceleration in a practical problem"
    ],
    [
      "Cells and inheritance",
      "explaining how genes are passed from parents to offspring using a simple inheritance example"
    ]
  ],
  "16–18": [
    [
      "Functions",
      "connecting the equation of a function with its graph and explaining transformations"
    ],
    [
      "Rates of change",
      "understanding a derivative as a rate of change and a gradient using a visual example"
    ],
    [
      "Interpreting data",
      "explaining the difference between correlation and causation when interpreting data"
    ],
    [
      "Developing an argument",
      "building a sustained argument that answers an essay question rather than retelling content"
    ],
    [
      "Close analysis",
      "explaining how language, structure and context work together in a passage"
    ],
    [
      "Evaluating sources",
      "weighing the reliability of a source and using evidence to support a judgement"
    ],
    [
      "Chemical equilibrium",
      "explaining dynamic equilibrium and predicting the effect of a change in conditions"
    ],
    [
      "Energy and motion",
      "choosing and applying conservation of energy to a motion problem"
    ],
    [
      "Evaluating an experiment",
      "distinguishing random and systematic errors and explaining how they affect experimental conclusions"
    ]
  ]
};
const basicExamples = [
  ['Fraction basics', 'understanding fractions as equal parts of a whole, starting with halves and quarters'],
  ['Reading basics', 'finding the main idea in a short passage before tackling a longer text'],
  ['Number basics', 'building confidence with place value and simple addition or subtraction before harder calculations']
];
let selectedExample = null;
let lastExampleText = '';
function resizeDifficulty() {
  const field = $('difficulty');
  field.style.height = 'auto';
  field.style.height = Math.max(110, field.scrollHeight + 2) + 'px';
}
function exampleText(description) {
  return `${audience === 'student' ? 'I need' : 'They need'} help with ${description}.`;
}
function syncSelectedExample() {
  if (!selectedExample || $('difficulty').value !== lastExampleText) return;
  const items = selectedExample.basic ? basicExamples : exampleSets[$('age').value];
  const item = items?.find(item => item[0] === selectedExample.label);
  if (!item) { selectedExample = null; return; }
  lastExampleText = exampleText(item[1]);
  $('difficulty').value = lastExampleText;
  resizeDifficulty();
}
function addExampleButton(container, item, basic = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = item[0];
  button.addEventListener('click', () => {
    selectedExample = {label: item[0], basic};
    lastExampleText = exampleText(item[1]);
    $('difficulty').value = lastExampleText;
  resizeDifficulty();
    $('difficulty').removeAttribute('aria-invalid');
    $('error').hidden = true;
    $('difficulty').focus();
  });
  container.appendChild(button);
}
function renderExamples() {
  const items = exampleSets[$('age').value];
  $('example-groups').replaceChildren();
  $('simpler-examples').hidden = !items;
  $('example-hint').textContent = items
    ? `Ideas for ages ${$('age').value}. Pick one to fill the box, then edit it to fit. These are starting points — learners work at different levels.`
    : 'Choose an age range above to see ideas. You can also write your own.';
  $('difficulty').placeholder = 'Choose an idea below, or describe the tricky bit in your own words.';
  if (!items) return;
  ['Maths', 'Reading & writing', 'Science'].forEach((name, group) => {
    const heading = document.createElement('h3');
    heading.textContent = name;
    const buttons = document.createElement('div');
    buttons.className = 'examples';
    buttons.setAttribute('role', 'group');
    buttons.setAttribute('aria-label', name + ' examples');
    items.slice(group * 3, group * 3 + 3).forEach(item => addExampleButton(buttons, item));
    $('example-groups').append(heading, buttons);
  });
  $('basic-examples').replaceChildren();
  basicExamples.forEach(item => addExampleButton($('basic-examples'), item, true));
}
