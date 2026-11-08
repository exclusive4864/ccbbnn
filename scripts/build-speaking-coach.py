"""Build self-contained mobile lesson page from reviewed teaching data."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'data/speaking-vocabulary.json').read_text())
html='''<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#121b20"><meta name="description" content="Writewise Speaking Vocabulary: ฝึกทีละ 5 วลี เรียกคืนจากสถานการณ์ ใช้กับเรื่องจริง และทบทวนเว้นช่วงบนมือถือ"><title>Writewise · Speaking Vocabulary Coach</title><style>__CSS__</style></head>
<body><a href="#main" class="skip">ข้ามไปบทเรียน</a><header class="top"><div class="wrap top-inner"><a class="brand" href="index.html">writewise<span> .</span><small>SPEAKING VOCABULARY COACH</small></a><div class="row"><button id="theme">☀ Day</button><button id="smaller" aria-label="ลดขนาดตัวอักษร">A−</button><button id="larger" aria-label="เพิ่มขนาดตัวอักษร">A+</button><button id="focus" aria-pressed="false">Focus</button></div></div></header>
<div class="wrap"><nav class="nav" aria-label="เมนู Speaking Vocabulary"><button data-view="home">⌂ เริ่มวันนี้</button><button data-view="batches">▦ ชุดเรียน</button><button data-view="review">↻ ทบทวน</button><button data-view="library">⌕ คลังวลี</button><button data-view="data">⇅ ข้อมูล / วิธีเรียน</button><a class="button" href="index.html">↗ Writewise เดิม</a></nav>
<div id="storage-warning" class="card warning" role="alert" hidden>เบราว์เซอร์ไม่สามารถอ่านหรือบันทึกความคืบหน้าได้ตามปกติ กรุณาส่งออกข้อมูลในเมนู “ข้อมูล / วิธีเรียน” ก่อนปิด</div>
<div id="stale-warning" class="card warning" role="alert" hidden>ข้อมูลเปลี่ยนจากแท็บอื่น หยุดการแก้ไขเพื่อป้องกันประวัติทับกัน <button id="reload-data">โหลดข้อมูลล่าสุด</button></div>
<main id="main" tabindex="-1"></main><footer>Writewise · 16 หัวข้อ · ตัวอย่างเพื่อการฝึก ไม่ใช่การรับรองคะแนน IELTS<br>ข้อมูลส่วนตัวอยู่ในเบราว์เซอร์นี้ · สำรองจากเมนูข้อมูลก่อนย้ายเครื่อง</footer></div><div id="toast" class="toast" role="status" hidden></div><noscript><p>หน้านี้ต้องเปิด JavaScript เพื่อใช้ปุ่มและบันทึกการทบทวน กรุณาเปิดลิงก์เว็บใน Safari หรือ Chrome</p></noscript>
<script type="application/json" id="course-data">__DATA__</script><script>__CORE__</script><script>__APP__</script></body></html>
'''
for k,p in [('CSS','assets/speaking-coach.css'),('CORE','assets/speaking-coach-core.js'),('APP','assets/speaking-coach.js')]:html=html.replace('__'+k+'__',(ROOT/p).read_text())
html=html.replace('__DATA__',json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
(ROOT/'vocabulary-coach.html').write_text(html)
print('Built vocabulary-coach.html:',len(html.encode()),'bytes')
