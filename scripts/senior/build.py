"""Build original senior topic summaries from the committed, reviewed inventories.
Raw guides stay in ignored output/senior; only headings/locators and original summaries ship.
"""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
RELEASE='20260909-senior-1'
def read(name):return json.loads((HERE/name).read_text(encoding='utf-8-sig'))
def slug(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
subjects=[]
inv=read('vce-inventory.json');areas=read('vce-areas.json');labels=read('vce-labels.json')
for index,course in dict.fromkeys((r['index'],r['course']) for r in areas):
 rows=[r for r in areas if r['index']==index and r['course']==course]
 for name in (['English','English as an Additional Language (EAL)'] if index==51 else [course]):
  items=[];seen=set()
  for r in rows:
   key=(r['units'],r['area'],r['title'])
   if key in seen:continue
   seen.add(key)
   items.append(dict(id='vce-'+slug(name)+'-'+str(len(items)+1),label=('Analyse data and relationships between variables' if course=='General Mathematics' and r['title']=='Data analysis' and r['units']=='3' else labels[r['title']]),units=r['units'].split(','),reference='Area of Study '+r['area'],source=r['source'],locator=r['paragraph'],heading=r['title']))
  subjects.append(dict(id='vce-'+slug(name),programme='VCE',name=name,group=inv[index]['group'],source=inv[index]['url'],inventoryIndex=index,units=sorted(set(u for i in items for u in i['units'])),coverage='outline',version='Current VCAA published study design, checked 9 September 2026',topics=items))
for index in range(21,50):
 x=inv[index];subjects.append(dict(id='vce-vet-'+slug(x['name']),programme='VCE',name=x['name'],group='VCE VET pathways',source=x['url'],inventoryIndex=index,units=[],coverage='general',version='VCAA programme listing, checked 9 September 2026',topics=[]))
IB='https://ibo.org/programmes/diploma-programme/curriculum/'
profiles={}
def profile(key,path,labels,hl='',version='Public course outline checked 9 September 2026',years=(2026,2027,2028)):
 source=path if path.startswith('https:') else IB+path+'/'
 topics=[dict(label=t,levels=['SL','HL'],years=list(years)) for t in labels.split('|') if t]
 topics.extend(dict(label=t,levels=['HL'],years=list(years)) for t in hl.split('|') if t)
 profiles[key]=dict(source=source,version=version,topics=topics)
profile('literature','language-and-literature/language-a-literature','Explain how a writer creates meaning|Connect a literary work to its context|Compare ideas across two works|Build an interpretation using evidence|Plan a clear spoken literary analysis','Develop a focused literary essay')
profile('langlit','language-and-literature/language-a-language-and-literature','Analyse how language shapes a message|Explore audience, purpose and context|Interpret a literary work|Compare literary works|Support an oral analysis with evidence','Develop a sustained essay on a work or body of work')
profile('performance','language-and-literature/literature-and-performance','Interpret a literary passage|Turn a written passage into a performance|Explain how staging choices change meaning|Reflect on a performance using evidence')
profile('ab','language-acquisition/language-ab-initio','Understand a short everyday text|Follow the main idea in a conversation|Write a clear everyday message|Talk about identity and experiences|Express ideas about communities and the planet',version='Language ab initio: course with last assessment in 2028')
profile('b','language-acquisition/language-b','Understand ideas and viewpoints in a text|Follow and respond to spoken language|Develop a clear written response|Explain and justify an opinion|Discuss identity, experiences and global issues','Interpret a literary work in the language',version='Language B: course with last assessment in 2028')
profile('classical','language-acquisition/classical-languages','Work out a sentence using grammar|Translate an original passage accurately|Interpret a literary passage in context|Explain how language choices create meaning|Connect a text to its ancient culture')
profile('business','individuals-and-societies/business-and-management','Explain how a business is organised|Understand people and motivation at work|Interpret business finance information|Explain a marketing decision|Compare ways to organise production')
profile('digital','individuals-and-societies/digital-society','Explain how data and algorithms shape decisions|Understand networks and digital communication|Examine artificial intelligence and robotics|Analyse the influence of digital media|Evaluate the ethical effects of a digital system','Evaluate digital solutions to a global challenge')
profile('economics','individuals-and-societies/economics','Explain how markets respond to change|Evaluate government intervention in a market|Connect national economic indicators|Explain policies affecting growth and stability|Evaluate international trade and development|Use a model to explain a real economic issue')
profile('geography','individuals-and-societies/geography','Explain relationships between people and environments|Compare patterns across places and scales|Evaluate resource use and sustainability|Explain a climate or development issue|Use geographical evidence in a case study')
profile('politics','individuals-and-societies/global-politics','Explain power and political decisions|Compare perspectives on rights and justice|Explore development and sustainability|Analyse the causes of conflict|Use a political example to support an argument')
profile('history','individuals-and-societies/history','Explain causes and consequences of an event|Compare historical interpretations|Evaluate what a source can tell us|Explain change and continuity|Build a historical argument with evidence','Connect evidence from a regional depth study',version='History: course with last assessment in 2027',years=(2026,2027))
profile('history-new','https://ibo.org/globalassets/new-structure/programmes/dp/pdfs/dp-history-sb-en.pdf','Explain why an event had several causes|Evaluate a source in its historical context|Compare perspectives and build an argument|Connect examples in a thematic study|Develop a focused historical inquiry','Evaluate an interpretation of regional history',version='History: first assessment 2028',years=(2028,))
profile('philosophy','individuals-and-societies/philosophy','Identify an assumption in an argument|Build and test a philosophical argument|Explore questions about human identity|Compare views on an ethical question|Interpret an idea in a prescribed text','Evaluate philosophical issues in contemporary life')
profile('psychology','individuals-and-societies/psychology','Explain a biological account of behaviour|Explain how thinking affects behaviour|Explore social and cultural influences|Evaluate the evidence from a psychology study|Identify strengths and limits of a research method',version='Psychology: last assessment 2026',years=(2026,))
profile('psychology-new','https://ibo.org/globalassets/new-structure/programmes/dp/pdfs/dp_psychology_subjectbrief_en.pdf','Connect biological, thinking and social explanations|Apply a psychology idea to a new context|Identify bias and limits in a study|Distinguish a cause from a correlation|Plan an ethical research proposal','Analyse psychological data|Explore culture, motivation or technology',version='Psychology: first assessment 2027',years=(2027,2028))
profile('anthropology','individuals-and-societies/social-and-cultural-anthropology','Compare how societies organise everyday life|Question assumptions about another culture|Explain social change and inequality|Compare perspectives using cultural evidence')
profile('religions','individuals-and-societies/world-religions','Understand a religious belief in context|Connect beliefs and practices|Compare religious traditions respectfully|Use evidence in an investigation of religion',version='World religions: current course before the 2029 replacement')
profile('biology','sciences/biology','Explain how cells and membranes work|Connect DNA, inheritance and variation|Explain how enzymes support life processes|Compare respiration and photosynthesis|Explain transport and gas exchange|Understand immunity and body regulation|Explain evolution and natural selection|Connect organisms, ecosystems and energy|Interpret evidence from a biological investigation','Explain gene regulation|Understand chemical signalling|Explain viruses and their effects',version='Biology: first assessment 2025')
profile('chemistry','sciences/chemistry','Use particle models to explain matter|Connect chemical bonding to properties|Use the periodic table to explain patterns|Explain energy changes in reactions|Calculate amounts in a chemical reaction|Explain reaction speed and equilibrium|Understand how a reaction takes place',version='Chemistry: first assessment 2025')
profile('physics','sciences/physics','Connect motion, forces and momentum|Calculate energy transfers and power|Explain thermal processes and gases|Understand electric circuits|Explain waves and their behaviour|Use gravitational and electromagnetic field ideas|Explain atoms, radioactivity and nuclear energy|Interpret experimental evidence','Explain rotational motion|Use ideas from special relativity|Explain thermodynamic processes|Understand electromagnetic induction|Explore quantum behaviour',version='Physics: first assessment 2025')
profile('cs','sciences/computer-science','Trace and explain an algorithm|Turn a problem into working code|Understand computer systems and networks|Explain a teacher-selected computing option|Test and improve a computational solution',version='Computer science: last assessment 2026',years=(2026,))
profile('cs-new','https://ibo.org/globalassets/new-structure/university-admission/pdfs/dp_comp_sci_subjectbrief_en.pdf','Explain how computer components work together|Understand communication across networks|Design and query a database|Understand a machine learning approach|Develop and trace an algorithm|Write and debug a program|Use objects to organise a program','Apply an abstract data type',version='Computer science: first assessment 2027',years=(2027,2028))
profile('design','sciences/design-technology','Connect a design to the needs of its user|Select suitable materials and processes|Use a model to test a design idea|Evaluate resources and environmental effects|Explain how a product developed','Evaluate a user-centred design|Connect design decisions to commercial production',version='Design technology: last assessment 2026',years=(2026,))
profile('design-new','https://ibo.org/globalassets/new-structure/university-admission/pdfs/dp_destech_subjectbrief_en.pdf','Investigate what users need|Apply ergonomics to a design|Develop and test a prototype|Choose materials and manufacturing methods|Evaluate inclusive and sustainable design|Connect design theory to a real product',version='Design technology: first assessment 2027',years=(2027,2028))
profile('ess','sciences/environmental-systems-and-societies','Explain connections within an environmental system|Compare perspectives on an environmental issue|Evaluate resource use and sustainability|Interpret environmental evidence|Plan an environmental investigation','Connect environmental law, economics and ethics',version='Environmental systems and societies: SL and HL from assessment 2026')
profile('sehs','sciences/sports-exercise-and-health-science','Explain how the body responds to exercise|Connect nutrition and exercise physiology|Use biomechanics to explain movement|Explain psychological influences on performance|Understand how a movement skill is learned|Interpret evidence from a sport science investigation',version='Sports, exercise and health science: first assessment 2026')
profile('aa','mathematics','Use algebra to develop an exact argument|Analyse functions and their graphs|Solve geometry and trigonometry problems|Reason with statistics and probability|Use differentiation and integration|Develop a mathematical exploration',version='Mathematics AA: course with last assessment in 2028')
profile('ai','mathematics','Use numbers and algebra in a real situation|Build and interpret a function model|Apply geometry and trigonometry|Use statistics to interpret data|Model chance and uncertainty|Use calculus to model change|Explain results from mathematical technology',version='Mathematics AI: course with last assessment in 2028')
profile('dance','the-arts/dance','Develop and explain choreographic choices|Analyse a dance from its cultural context|Reflect on a dance performance|Connect dance ideas across traditions',version='Dance: course with last assessment in 2028')
profile('film','the-arts/film','Explain how a film creates meaning|Compare films in their cultural contexts|Plan and evaluate a film production role|Connect practical choices to an intended effect','Reflect on a collaborative film project')
profile('music','the-arts/music','Explore music in different contexts|Experiment with musical ideas|Explain choices in creating music|Reflect on musical performance','Plan a contemporary collaborative music project')
profile('theatre','the-arts/theatre','Turn a play text into staging ideas|Explore a theatre tradition|Develop a collaborative performance|Explain the effects of production choices','Apply a theatre theory in a solo performance')
profile('visual','the-arts/visual-arts','Compare artworks in context|Develop and document an art-making process|Explain choices for an exhibition|Connect visual choices to an intention',version='Visual arts: last assessment 2026',years=(2026,))
profile('visual-new','https://ibo.org/globalassets/new-structure/university-admission/pdfs/dp_vis-arts_subjectbrief_en.pdf','Develop an art-making inquiry|Experiment with materials and visual ideas|Connect an artwork to artists and contexts|Document and reflect on studio choices|Communicate an artistic intention',version='Visual arts: first assessment 2027',years=(2027,2028))
profile('tok','dp-core/theory-of-knowledge','Turn a claim into a question about knowledge|Evaluate evidence and assumptions|Compare different ways of knowing|Connect an object to a knowledge question|Build an argument and consider another view')
profile('ee','dp-core/extended-essay','Narrow an idea into a research question|Choose and evaluate useful evidence|Organise a reasoned argument|Explain how evidence supports a conclusion|Reflect honestly on research decisions',version='General research skills; confirm the applicable essay guide with the supervisor')
profile('cas','dp-core/creativity-activity-and-service','Plan a meaningful creative activity|Plan a suitable physical activity|Explore a community service idea|Plan collaboration in a project|Reflect on what an experience taught you',version='CAS planning and reflection; use real experiences and coordinator guidance')
canonical={
'112845':('Literature and performance','performance'), '117712':('Chinese B — Cantonese','b'),'117711':('Chinese B — Mandarin','b'),'100129':('Classical Greek','classical'),'100340':('Latin','classical'),
'100058':('Art history','general'),'100068':('Astronomy','general'),'101711':('Brazilian social studies','general'),'147712':('Business management','business'),'179711':('Digital society','digital'),'100164':('Economics','economics'),'123711':('Global politics','politics'),'100680':('History','history'),
'149713':('History: Africa and the Middle East','history'),'149711':('History: Americas','history'),'149714':('History: Asia and Oceania','history'),'149712':('History: Europe','history'),'100449':('Philosophy','philosophy'),'100474':('Psychology','psychology'),'100532':('Social and cultural anthropology','anthropology'),'107711':('Turkey in the 20th century','general'),'100619':('World religions','religions'),
'100088':('Biology','biology'),'100113':('Chemistry','chemistry'),'100132':('Computer science','cs'),'100146':('Design technology','design'),'100222':('Geography','geography'),'100671':('Marine science','general'),'100452':('Physics','physics'),'100546':('Sports, exercise and health science','sehs'),'166711':('Mathematics: analysis and approaches','aa'),'166712':('Mathematics: applications and interpretation','ai'),
'100140':('Dance','dance'),'100200':('Film','film'),'182711':('Literary arts','general'),'100402':('Music','music'),'100575':('Theatre','theatre'),'100608':('Visual arts','visual'),'100673':('Environmental systems and societies','ess'),'184711':('Language and culture (pilot)','general'),'150711':('Nature of science','general')}
ib=read('ib-inventory.json')
for row in ib['subjects']:
 code=row['code'];text=row['row'].split('Yes')[0].strip()
 if code in canonical:name,key=canonical[code]
 elif 'A: Lang and Literature' in text:
  name=text.split('A: Lang and Literature',1)[1].strip().replace('A: Lang and Literature','A Language and Literature').title();key='langlit'
 elif 'A: Literature' in text:name=text.split('A: Literature',1)[1].strip().title();key='literature'
 elif re.search(r' AB\.? ',text):name=re.split(r' AB\.? ',text,maxsplit=1)[1].strip().title().replace('Ab Initio','ab initio (beginner)');key='ab'
 elif ' B ' in text:name=text.split(' B ',1)[1].strip().title();key='b'
 else:raise ValueError((code,text))
 group='Languages and literature' if key in ['literature','langlit','performance','ab','b','classical'] else 'Sciences' if key in ['biology','chemistry','physics','cs','design','sehs'] else 'Mathematics' if key in ['aa','ai'] else 'The Arts' if key in ['dance','film','music','theatre','visual'] else 'School-based and pilot subjects' if key=='general' else 'Individuals and societies'
 subject=dict(id='ib-'+code,programme='IB',name=name,group=group,levels=row['levels'],inventoryCode=code,coverage='general' if key=='general' else 'outline',source=IB+'other-dp-subjects-offered-by-the-ib/' if key=='general' else profiles[key]['source'],version='School-based or pilot course: use the teacher’s current outline' if key=='general' else profiles[key]['version'],topics=[])
 for pk in [key]+([key+'-new'] if key+'-new' in profiles else []):
  if pk=='general':continue
  for t in profiles[pk]['topics']:
   subject['topics'].append(dict(t,id=subject['id']+'-'+str(len(subject['topics'])+1),source=profiles[pk]['source'],version=profiles[pk]['version']))
 subjects.append(subject)
for code,key,name in [('tok','tok','Theory of Knowledge (TOK)'),('ee','ee','Extended Essay (EE)'),('cas','cas','Creativity, Activity, Service (CAS)')]:
 pr=profiles[key];subjects.append(dict(id='ib-core-'+code,programme='IB',name=name,group='DP core',levels=[],coverage='outline',source=pr['source'],version=pr['version'],topics=[dict(t,id='ib-core-'+code+'-'+str(i+1),source=pr['source'],version=pr['version']) for i,t in enumerate(pr['topics'])]))
for code,name in [('systems-transformation','Systems transformation (pilot)'),('other-language-a','Another Language A: Literature (special request)')]:
 subjects.append(dict(id='ib-'+code,programme='IB',name=name,group='School-based and pilot subjects',levels=[],coverage='general',source=IB+('language-and-literature/language-a-literature/' if code=='other-language-a' else 'other-dp-subjects-offered-by-the-ib/'),version='Availability and course details must be confirmed with the school',topics=[]))
for s in subjects:
 s['topics']=[t for t in s['topics'] if not s.get('levels') or set(s['levels'])&set(t.get('levels',s['levels']))]
 s['topics'].sort(key=lambda t:(t.get('units',[''])[0],t['label']))
subjects.sort(key=lambda s:(s['programme'],s['group'],s['name']))
dest=ROOT/'curriculum/senior';dest.mkdir(exist_ok=True)
data=dict(release=RELEASE,checked='2026-09-09',subjects=subjects)
(dest/'catalogue.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
(HERE/'source-audit.json').write_text(json.dumps(dict(release=RELEASE,ibListed=len(ib['subjects']),vceListed=len(inv),ibExclusions=ib['excluded'],sha256=hashlib.sha256((dest/'catalogue.json').read_text(encoding='utf-8').encode('utf-8')).hexdigest(),counts={p:sum(s['programme']==p for s in subjects) for p in ['IB','VCE']},topicCount=sum(len(s['topics']) for s in subjects)),indent=2),encoding='utf-8')
print('Built',len(subjects),'courses;',sum(len(s['topics']) for s in subjects),'topic summaries')
