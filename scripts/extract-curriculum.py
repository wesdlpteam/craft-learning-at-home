"""Extract ACARA content descriptions; run with a Python environment containing openpyxl."""
import argparse, collections, hashlib, json, re
from pathlib import Path
import openpyxl

ROOT=Path(__file__).resolve().parents[1]
def extract(source):
    book=openpyxl.load_workbook(source,read_only=True,data_only=True)
    rows=book['Learning areas'].iter_rows(values_only=True)
    headers=next(rows); result=[]; context=None; strand=''; sub=''
    for row in rows:
        d=dict(zip(headers,row))
        key=tuple(d.get(k) or '' for k in ['Learning Area','Subject','Level','Pathway','Sequence'])
        if key!=context: strand=''; sub=''; context=key
        if d.get('Strand'): strand=d['Strand']; sub=''
        if d.get('Sub-Strand'): sub=d['Sub-Strand']
        if not d.get('Content Description'): continue
        assert re.fullmatch(r'AC9[A-Z0-9]+', d['Code']),d['Code']
        level=d['Level']
        years=[0] if level=='Foundation Year' else [int(n) for n in re.findall(r'\d+',level)]
        if len(years)==2: years=list(range(years[0],years[1]+1))
        result.append(dict(id=d['Code'],code=d['Code'],area=key[0],subject=key[1],level=level,years=years,pathway=key[3],sequence=key[4],strand=strand,subStrand=sub,description=d['Content Description']))
    assert len(result)==2678
    assert len({r['id'] for r in result})==len(result),'duplicate code: use composite identity'
    assert all(r['strand'] for r in result)
    return result

if __name__=='__main__':
    ap=argparse.ArgumentParser()
    ap.add_argument('source',nargs='?',default=str(ROOT/'output/curriculum/source.xlsx'))
    ap.add_argument('--output',default=str(ROOT/'output/curriculum/all-source.json'))
    args=ap.parse_args(); rows=extract(args.source)
    Path(args.output).write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Extracted',len(rows),'descriptors;',len({r['subject'] for r in rows}),'subjects/frameworks.')
    print('Source SHA256:',hashlib.sha256(Path(args.source).read_bytes()).hexdigest())
    print(dict(collections.Counter(r['area'] for r in rows)))
