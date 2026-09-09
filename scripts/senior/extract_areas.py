import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2];out=root/'output/senior'
records=[]
for f in sorted(out.glob('vce-design-*.json'),key=lambda p:int(p.stem.split('-')[-1])):
 idx=int(f.stem.split('-')[-1]);d=json.loads(f.read_text(encoding='utf-8'));ps=d['paragraphs'];unit='';course=d['name']
 for j,p in enumerate(ps):
  t=' '.join(p['text'].split());style=p['style'];heading='Heading' in style and not style.startswith('TOC')
  if style.startswith('TOC'):continue
  if (heading or style=='pdf') and re.match(r'^Units? [1-4](?:\b|–)',t) and len(t)<110:
   if style=='pdf' and not re.match(r'^Unit [1-4](?::|$)',t):continue
   if heading and not style.endswith('Heading1'):continue
   nums=re.findall(r'[1-4]',t.split(':')[0]);unit=','.join(nums)
   if idx in [16,17,18,19]:
    m=re.search(r'(Foundation Mathematics|General Mathematics|Mathematical Methods|Specialist Mathematics)',t)
    if m:course=m[1]
   if idx==77 and ':' in t:course=t.split(':',1)[1].strip().title()
   if idx==2 and t.startswith('Units 3'):course='Music '+t.lower().split('music',1)[1].strip()
   if idx==2 and t.startswith('Unit 1:'):course='Music'
   if idx==67:
    for name in ['Empires','Modern History','Ancient History','Australian History','Revolutions']:
     if name in t:course='History: '+name
   continue
  if not unit:continue
  if not re.match(r'^Area of [Ss]tudy [1-9](?:\b|:)',t):continue
  if style!='pdf' and not (heading or style==''):continue
  if style=='pdf' and re.search(r'\s\d+$',t) and len(t)>17:continue
  title=t.split(':',1)[1].strip() if ':' in t else ps[j+1]['text'].strip()
  if re.match(r'Unit [1-4]',title):title=ps[j+1]['text'].strip()
  if len(title)>150 or len(title)<3 or title in ['Key knowledge','Key skills','Outcome 1','Outcome 2']:continue
  rec={'index':idx,'course':course,'units':unit,'area':re.search(r'[1-9]',t)[0],'title':title,'source':d['source'],'paragraph':j,'context':' '.join(z['text'] for z in ps[j+1:j+4])[:1100]}
  if idx in [17,18,19]:continue
  if not any(r['course']==course and r['units']==unit and r['area']==rec['area'] and r['title'].lower()==title.lower() for r in records):records.append(rec)
(out/'vce-areas.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
summary={}
for r in records:summary.setdefault(r['index'],[]).append(f"{r['course']}|{r['units']}|{r['area']}|{r['title']}")
(out/'vce-areas-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
for i,v in summary.items():
 if i in [0,50,51,53,55,56,83,88,98,124,125]:print(i,'\n'+'\n'.join(v))
print('RECORDS',len(records))
