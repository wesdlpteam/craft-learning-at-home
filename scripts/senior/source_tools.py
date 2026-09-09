import urllib.request,json,hashlib
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor
OUT=Path(__file__).resolve().parents[2]/'output'/'senior'
def fetch(url):
 key=hashlib.sha256(url.encode()).hexdigest()[:16]; p=OUT/key
 if not p.exists():
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
  p.write_bytes(urllib.request.urlopen(req,timeout=45).read())
 return p
class Node:
 def __init__(self,tag='',attrs=()):self.tag=tag;self.attrs=dict(attrs);self.children=[]
 def text(self):return ' '.join(c if isinstance(c,str) else c.text() for c in self.children).strip()
 def all(self,tags):
  for c in self.children:
   if isinstance(c,Node):
    if c.tag in tags:yield c
    yield from c.all(tags)
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.root=Node();self.stack=[self.root]
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs);self.stack[-1].children.append(n)
  if tag not in ['meta','link','input','br','hr','img','source','area','wbr']:self.stack.append(n)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,d):self.stack[-1].children.append(d)
def doc(url):
 p=Parser();p.feed(fetch(url).read_text(encoding='utf-8'));return p.root
if __name__=='__main__':
 urls={
 'ib-list':'https://ibo.org/globalassets/new-structure/programmes/dp/pdfs/all-dp-subjects-list-en.pdf',
 'ib-index':'https://ibo.org/programmes/diploma-programme/curriculum/',
 'vce-index':'https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/vce-study-designs',
 'vce-languages':'https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/languages/vce-study-designs-languages',
 'vce-list':'https://www.vcaa.vic.edu.au/sites/default/files/2025-12/VCEStudyDesignsList2026.pdf'}
 for name,url in urls.items():
  try:
   p=fetch(url);(OUT/(name+('.pdf' if url.endswith('.pdf') else '.html'))).write_bytes(p.read_bytes());print(name,p.stat().st_size)
  except Exception as e:print(name,str(e))
 (OUT/'urls.json').write_text(json.dumps(urls,indent=2),encoding='utf-8')
