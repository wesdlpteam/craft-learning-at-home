"""Build static curriculum files from the audited extraction and authored labels."""
import collections, hashlib, json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
rows=json.loads((ROOT/'output/curriculum/all-source.json').read_text(encoding='utf-8'))
labels={}
def select(target):
    if target.startswith('@'):
        parts=target[1:].split('|')
        return [r for r in rows if r['subject']==parts[0] and (len(parts)==1 or r['pathway']==parts[1])]
    if target.startswith('~'): return [r for r in rows if r['code'].startswith(target[1:])]
    return [r for r in rows if re.fullmatch(re.escape(target)+r'\d+',r['code'])]
def apply(targets, lines, file):
    for target in targets:
        records=select(target)
        assert len(records)==len(lines),(file.name,target,len(records),len(lines))
        for r,label in zip(records,lines):
            assert r['id'] not in labels or labels[r['id']]==label, r['id']
            labels[r['id']]=label
for file in sorted((ROOT/'scripts/labels').glob('*.txt')):
    targets=[]; lines=[]
    for line in file.read_text(encoding='utf-8-sig').splitlines()+['[END]']:
        line=line.strip()
        if not line:continue
        if line.startswith('['):
            if targets:apply(targets,lines,file)
            targets=line[1:-1].split(','); lines=[]
        else:lines.append(line)
mathtext=(ROOT/'curriculum-maths.js').read_text(encoding='utf-8-sig')
math=json.loads(mathtext[mathtext.index('{'):].strip().rstrip(';'))
labels.update({r['code']:r['label'] for r in math['items']})
assert set(labels)=={r['id'] for r in rows},set(r['id'] for r in rows)-set(labels)
# Script-specific labels retain distinctions that matter to families.
scripts={'Arabic':'Arabic letters and vowel marks','Hindi':'Devanagari script','Japanese':'hiragana, katakana and kanji','Korean':'hangeul','Modern Greek':'the Greek alphabet','Turkish':'letters and their extra marks','Vietnamese':'letters and tone marks','Chinese':'Chinese characters and their parts'}
for subject,script in scripts.items():
    for r in rows:
        if r['subject']==subject and r['level']=='Years 1 and 2' and r['code'].endswith('U02'):
            labels[r['id']]='Recognise '+script+' in written language'
# Keep specific sound-and-script connections visible.
overrides={
'AC9LC4U01':'Use Chinese tones and Pinyin to form words and phrases',
'AC9LC8EU01':'Use Chinese tones and Pinyin to develop pronunciation',
'AC9LC2C05':'Create simple messages with familiar characters and Pinyin',
'AC9LCH2C05':'Create simple messages with familiar characters and Pinyin',
}
labels.update(overrides)
normal=lambda s:re.sub(r'\s+',' ',s.replace('\\xa0',' ')).strip()
mathgroups={'Number':'Numbers, fractions & amounts','Algebra':'Patterns & missing numbers','Measurement':'Measuring, time & angles','Space':'Shapes, maps & positions','Statistics':'Charts & information','Probability':'Chance & likelihood'}
hassgroups={'History':'People & the past','Geography':'Places & environments','Civics and Citizenship':'Rules, rights & communities','Economics and Business':'Money, resources & choices','Deep time history of Australia':'First Nations deep history','The ancient world':'Ancient societies','Medieval Europe and the early modern world':'Medieval & Renaissance Europe','Empires and expansions':'Empires & expansion','Asia-Pacific world':'Asia-Pacific societies','Making and transforming the Australian nation (1750–1914)':'Australia from 1750 to 1914','First World War (1914–1918)':'World War I','The Industrial Revolution and the movement of peoples (1750–1900)':'Industry & migration, 1750–1900','Asia and the World (1750–1914)':'Asia from 1750 to 1914','Second World War':'World War II','Building modern Australia':'Modern Australia & rights','The globalising world':'Australia in a connected world','Water in the world':'Water & its importance','Place and liveability':'Places to live','Landscapes and landforms':'Landscapes & natural hazards','Changing nations':'Cities & migration','Biomes and food security':'Environments, farming & food','Geographies of interconnections':'Connections between places','Environmental change and management':'Environmental change & care','Geographies of human wellbeing':'Wellbeing around the world','Government and democracy':'Government & democracy','Laws and citizens':'Laws & rights','Citizenship, diversity and identity':'Citizenship & identity'}
def topic(r):
    a=r['area']; s=normal(r['strand']); sub=normal(r['subStrand'])
    if a=='Mathematics':return mathgroups[s]
    if a=='English':
        if s=='Literature':return 'Stories, poetry & authors'
        if 'word knowledge' in sub.lower():return 'Sounds, spelling & words'
        if sub in ['Interacting with others','Language for interacting with others']:return 'Speaking & listening'
        if sub=='Creating texts':return 'Writing & presenting'
        if s=='Language':return 'Sentences & how writing works'
        return 'Reading & understanding'
    if a=='Science':
        if s=='Science inquiry':return 'Investigations & evidence'
        if s=='Science as a human endeavour':return 'Science in everyday life'
        return {'Biological sciences':'Living things','Chemical sciences':'Materials & chemical changes','Earth and space sciences':'Earth & space','Physical sciences':'Forces & energy'}[sub]
    if a=='Humanities and Social Sciences':
        if s=='Skills':return 'Investigating & explaining'
        return hassgroups.get(sub,'Money, business & choices' if r['subject'].startswith('Economics') else 'People, places & the past')
    if a=='Health and Physical Education':
        return {'Identities and change':'Identity & growing up','Interacting with others':'Feelings & relationships','Making healthy and safe choices':'Health & staying safe','Moving our bodies':'Movement & skills','Making active choices':'Being active','Learning through movement':'Games & teamwork'}[sub]
    if a=='The Arts':return {'Exploring and responding':'Explore artists & ideas','Developing practices and skills':'Build creative skills','Creating and making':'Create & develop work','Presenting and performing':'Present & perform'}[s]
    if a=='Languages':
        if s.startswith('Foundation'):return 'First steps in the language'
        if sub.startswith('Interacting'):return 'Signing & conversations' if r['subject']=='Auslan' else 'Conversations & everyday use'
        if sub.startswith('Creating'):return 'Create signed messages' if r['subject']=='Auslan' else 'Create messages & stories'
        if sub.startswith('Mediating') or sub=='Translating':return 'Understand & translate meaning'
        if sub.startswith('Accessing'):return 'Read about the ancient world'
        if sub=='Understanding systems of language':return 'Signs & grammar' if r['subject']=='Auslan' else 'Sounds, writing & grammar'
        return 'Language, culture & identity'
    if a=='Technologies':
        if r['subject']=='Digital Technologies':
            if sub=='Digital systems':return 'Computers & networks'
            if sub in ['Data representation','Acquiring, managing and analysing data']:return 'Data & information'
            if sub=='Privacy and security':return 'Privacy & online safety'
            if sub=='Collaborating and managing':return 'Digital tools & teamwork'
            return 'Design, code & solve problems'
        if 'Engineering' in sub:return 'How products work'
        if 'Food' in sub:return 'Food & fibre'
        if 'Materials' in sub:return 'Materials & making'
        if sub=='Technologies and society':return 'Design in everyday life'
        return 'Design, make & evaluate'
    raise ValueError(r)
names={'Mathematics':('Maths','Maths'),'English':('English','English'),'Science':('Science','Science'),'HASS F-6':('hass','Humanities: people & places'),'Civics and Citizenship 7-10':('civics','Civics & Citizenship'),'Economics and Business 7-10':('economics','Economics & Business'),'Geography 7-10':('geography','Geography'),'History 7-10':('history','History'),'Health and Physical Education':('health-pe','Health & PE'),'Design and Technologies':('design-technologies','Design & Technologies'),'Digital Technologies':('digital-technologies','Digital Technologies'),'Framework for Aboriginal Languages and Torres Strait Islander Languages':('first-nations-framework','First Nations languages (framework)'),'Framework for Classical Languages 7-10':('classical-framework','Classical languages (framework)'),'Classical Greek 7-10':('classical-greek','Classical Greek'),'Latin 7-10':('latin','Latin')}
VERSION='20260909-all-1'
out=ROOT/'curriculum';out.mkdir(exist_ok=True)
manifest={'version':'9.0','release':VERSION,'accessed':'2026-09-09','source':'https://www.australiancurriculum.edu.au/content/dam/en/curriculum/ac-version-9/downloads/curriculum-workbook.xlsx','count':len(rows),'subjects':[]}
audit={}
for subject in dict.fromkeys(r['subject'] for r in rows):
    rr=[r for r in rows if r['subject']==subject]
    ident,name=names.get(subject,(subject.lower().replace(' ','-'),subject))
    courses=[]
    for n,(seq,path) in enumerate(dict.fromkeys((r['sequence'],r['pathway']) for r in rr)):
        cr=[r for r in rr if (r['sequence'],r['pathway'])==(seq,path)]
        course=dict(id='c'+str(n),sequence=seq,pathway=path,years=sorted({y for r in cr for y in r['years']}),levels=list(dict.fromkeys(r['level'] for r in cr)))
        courses.append(course)
        for r in cr:r['course']=course['id']
    for r in rr:
        original={k:v for k,v in r.items() if k!='course'}
        audit[r['id']]=hashlib.sha256(json.dumps(original,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
        r['label']=labels[r['id']]
        r['topic']=topic(r)
        assert 10<len(r['label'])<160,(r['id'],r['label'])
    entry=dict(id=ident,name=name,area=rr[0]['area'],sourceSubject=subject,file='curriculum/'+ident.lower()+'.json',count=len(rr),years=sorted({y for r in rr for y in r['years']}),courses=courses,framework='Framework' in subject)
    manifest['subjects'].append(entry)
    (out/(ident.lower()+'.json')).write_text(json.dumps({'release':VERSION,'subject':ident,'items':rr},ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
(out/'manifest.js').write_text('// ACARA v9.0 adaptations. See CURRICULUM-SOURCES.md.\nconst curriculumManifest = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
auditfile=ROOT/'scripts/source-audit.json'
if auditfile.exists():
    assert json.loads(auditfile.read_text(encoding='utf-8'))==audit,'Source differs from recorded audit; review the workbook change.'
else:auditfile.write_text(json.dumps(audit,indent=2)+'\n',encoding='utf-8')
print('PASS: authored labels mapped to all',len(labels),'descriptors;',len(manifest['subjects']),'static subject files built.')
