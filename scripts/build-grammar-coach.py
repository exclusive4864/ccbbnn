"""Build original, self-contained mobile Grammar Coach from reviewed source data."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
lessons=[]
for part in 'abc':
    lessons.extend(json.loads((ROOT/f'data/grammar-part-{part}.json').read_text()))
lessons.sort(key=lambda l:l['number'])
labs=[]
sources=json.loads((ROOT/'data/grammar-sources.json').read_text())
for part in 'abc':
    file=ROOT/f'data/grammar-linking-{part}.json'
    if file.exists(): labs.extend(json.loads(file.read_text()))
    extra=ROOT/f'data/grammar-linking-sources-{part}.json'
    if extra.exists(): sources.extend(json.loads(extra.read_text()))
image_sources=ROOT/'data/grammar-image-sources-a.json'
if image_sources.exists(): sources.extend(json.loads(image_sources.read_text()))
sources=list({s['id']:s for s in sources}.values())
labs.sort(key=lambda l:l['number'])
by_id={l['id']:l for l in lessons+labs}
for l in by_id.values(): l['coreExampleCount']=len(l['examples'])
seen_extra=set()
for part in 'abc':
    file=ROOT/f'data/grammar-extra-examples-{part}.json'
    if not file.exists(): continue
    for item in json.loads(file.read_text()):
        lesson_id=item['lessonId']
        if lesson_id not in by_id or lesson_id in seen_extra: raise ValueError(f'Invalid or duplicate extra example target: {lesson_id}')
        if len(item['examples']) != 4: raise ValueError(f'Expected four extra examples: {lesson_id}')
        by_id[lesson_id]['examples'].extend(item['examples'])
        seen_extra.add(lesson_id)
data={'version':1,'lessons':lessons,'linkingLessons':labs,'sources':sources}
(ROOT/'data/grammar-course.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
html='''<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#101b20"><meta name="description" content="Writewise Grammar Coach: เรียนแกรมม่า 20 หัวข้อทีละขั้น อธิบายไทย Linking Lab เจาะคำเชื่อม พร้อมตัวอย่างและแบบฝึกแต่งใหม่ พร้อมสมุดข้อผิดและทบทวนเว้นช่วง"><title>Writewise · Grammar Coach</title><style>__CSS__</style></head><body>
<a class="skip" href="#main">ข้ามไปเนื้อหา</a><header class="top"><div class="wrap top-inner"><a class="brand" href="index.html">writewise<span> .</span><small>GRAMMAR COACH</small></a><div class="row"><button id="theme">☀ กลางวัน</button><button id="smaller" aria-label="ลดขนาดตัวอักษร">A−</button><button id="larger" aria-label="เพิ่มขนาดตัวอักษร">A+</button></div></div></header>
<div class="wrap"><nav class="nav" aria-label="เมนู Grammar Coach"><a class="button" href="#home">⌂ เริ่มวันนี้</a><a class="button" href="#lessons">▦ 20 บทเรียน</a><a class="button" href="#linking">↔ Linking Lab</a><a class="button" href="#review">↻ ทบทวน</a><a class="button" href="#mistakes">✓ สมุดข้อผิด</a><a class="button" href="#data">⇅ ข้อมูล / แหล่งอ้างอิง</a></nav>
<div class="card warning" id="storage-warning" role="alert" hidden>อ่านหรือบันทึกข้อมูลในเบราว์เซอร์ไม่ได้ตามปกติ กรุณาส่งออกข้อมูลจากเมนู “ข้อมูล” ก่อนปิด หากข้อมูลเดิมเสียหาย ระบบจะไม่เขียนทับจนกว่าคุณยืนยันนำเข้าไฟล์ที่ถูกต้อง</div>
<div class="card warning" id="stale-warning" role="alert" hidden>ข้อมูลเปลี่ยนจากอีกแท็บ หยุดการบันทึกเพื่อไม่ให้ประวัติทับกัน <button id="reload-data">โหลดข้อมูลล่าสุด</button></div>
<main id="main" tabindex="-1"></main><footer>Writewise · Grammar Coach · ตัวอย่างและแบบฝึกแต่งใหม่เพื่อการเรียนรู้<br>ข้อมูลส่วนตัวอยู่ในเบราว์เซอร์นี้ · ไม่ใช่ระบบตรวจงานเขียนอัตโนมัติหรือการรับรองคะแนน IELTS</footer></div>
<div class="toast" id="toast" role="status" hidden></div><noscript><p>เปิด JavaScript และใช้ลิงก์เว็บใน Safari หรือ Chrome เพื่อทำแบบฝึกและบันทึกความคืบหน้า</p></noscript>
<script type="application/json" id="grammar-data">__DATA__</script><script>__CORE__</script><script>__APP__</script></body></html>'''
for key,path in [('CSS','assets/grammar-coach.css'),('CORE','assets/grammar-coach-core.js'),('APP','assets/grammar-coach.js')]:
    html=html.replace('__'+key+'__',(ROOT/path).read_text())
html=html.replace('__DATA__',json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
(ROOT/'grammar-coach.html').write_text(html)
print(f'Built {len(lessons)} lessons + {len(labs)} labs, {sum(len(l["exercises"]) for l in lessons+labs)} exercises; {len(html.encode()):,} bytes')
