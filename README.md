# Writewise — IELTS Practice Studio

เว็บฝึก IELTS แบบไทย–อังกฤษสำหรับผู้มีพื้นฐานและต้องการพัฒนาอย่างเป็นขั้นตอน เปิดบนมือถือหรือ iPad ได้จาก:

**https://exclusive4864.github.io/ccbbnn/**

### Education Master Module

**https://exclusive4864.github.io/ccbbnn/education-master.html**

Education Master ฉบับสมบูรณ์ 18 บท: 9 รูปแบบคำถาม × 2 ตัวอย่าง พร้อม Model Essay 4 ย่อหน้า, คำแปลไทย, Paragraph Analysis, Must-Remember Patterns, Vocabulary/Collocations, Paraphrase & Synonym Bank, Grammar/Linking Words, IELTS TR/CC/LR/GRA Review, Common Mistakes, Active Recall Lab, Teacher Coach, Hint ทีละขั้น และ Transfer Challenge


## เนื้อหา

- Writing Pattern Lab 15 รูปแบบ: Task 2 เก้ากลุ่มคำสั่ง และ Academic Task 1 หกชนิด
- Speaking Mirror: Part 1 จำนวน 15 หัวข้อพร้อมคำตอบสั้น/ขยาย/Band 8–9, Part 2 Cue Card 20 ใบ และโครง Part 3
- Collocation Lab 50 ชุด พร้อมความหมาย ตัวอย่าง Writing/Speaking การเรียกคืน และพื้นที่แต่งประโยค
- บทความเต็มเดิม 9 ชิ้น: 3 โจทย์ × เป้าหมาย Band 7, 8, 9 พร้อมคำอธิบายไทย
- ห้องเขียน ตัวนับคำ ตัวจับเวลา แผน 28 วัน โหมดกลางคืน และตัวอักษรปรับขนาดได้
- ส่งออก/นำเข้าความคืบหน้าเป็น JSON สำหรับย้ายจากคอมไปมือถือ
- หน้า `collocation-mastery.html` มี 10 หมวด หมวดละ 20 collocations และ 50 ข้อ รวม 200 กลุ่มคำ/500 ข้อ พร้อม Learn, Practice, Mistake Review, Quick Recall, Mock Test และ Dashboard

## วิธีฝึก

ใช้วงจร **นึก → ดู → ลอก/พูด → เปลี่ยนหัวข้อ** วันละ 25–40 นาที อย่าท่องบทความเต็ม ให้จำหน้าที่ของภาษาและกลุ่มคำ จากนั้นเปลี่ยนรายละเอียดให้ตรงคำถามจริง

## ข้อมูลและความเป็นส่วนตัว

ข้อมูลฝึกเก็บใน `localStorage` ของเบราว์เซอร์ ไม่มีระบบส่งงานขึ้นเซิร์ฟเวอร์และไม่มีสคริปต์ภายนอก ข้อมูลไม่ซิงก์ข้ามอุปกรณ์อัตโนมัติ ให้ใช้หน้า “ข้อมูลของฉัน” เพื่อส่งออกไฟล์สำรอง แล้วนำเข้าในอีกเครื่อง

## แหล่งและขอบเขต

โครงประเมินอ้างอิง [IELTS Writing Band Descriptors](https://ielts.org/cdn/ielts-guides/ielts-writing-band-descriptors.pdf) และ [IELTS Academic Writing format](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing) ส่วนหนังสือที่ผู้ใช้ให้มาใช้เพื่อวิเคราะห์แนวสอนและบริบทของคำเท่านั้น ตัวอย่างในเว็บแต่งใหม่ ไม่คัดลอกบทหรือเฉลยยาว

ป้าย Band เป็นเป้าหมายเพื่อการเรียน ไม่ใช่คะแนนรับรอง โปรแกรมไม่ใช่ผลิตภัณฑ์ทางการของ IELTS และไม่ตรวจภาษาอัตโนมัติ

## ไฟล์

`index.html` เป็นไฟล์เดียว เปิดแบบออฟไลน์ได้ในเบราว์เซอร์ที่อนุญาต JavaScript บน iPad แนะนำใช้ลิงก์ GitHub Pages ใน Safari เพราะ Quick Look ของแอป Files อาจไม่รันปุ่ม



### Transportation Master Module — 18 Lessons

**https://exclusive4864.github.io/ccbbnn/transportation-master.html**

Transportation ฉบับสมบูรณ์ 18 บท: 9 รูปแบบคำถาม × 2 ตัวอย่าง พร้อม Model Essay 4 ย่อหน้า, คำแปลไทย, Paragraph Analysis, Must-Remember Patterns, Vocabulary/Collocations, Paraphrase & Synonym Bank, Grammar/Linking Words, IELTS TR/CC/LR/GRA Review, Common Mistakes, Active Recall Lab, Teacher Coach, Hint ทีละขั้น และ Transfer Challenge



## Speaking Vocabulary Coach — mobile step-by-step

**https://exclusive4864.github.io/ccbbnn/vocabulary-coach.html**

444 definition entries from 16 speaking topics in 95 small batches (up to five per batch). Original Thai explanations, usage frames, examples, situation-based recall prompts, and personal transfer questions. Duplicate canonical phrases share a review record. Self-rated spaced review uses 10 minutes for misses, one day for cued recall, and 1/3/7/14/30/60 days for successful due reviews on different days. This is learning support, not automated language scoring or guaranteed mastery.

Progress and personal answers stay in this browser in the separate `writewise-speaking-coach-v1` storage key. Use this module's own JSON backup/import screen. No server upload, microphone request, account sync or automatic reminder. Optional audio uses the device speech-synthesis API. The main Writing and other existing modules remain unchanged except for links into the new module.

The deployed HTML is self-contained. Source data is in `data/speaking-vocabulary.json`; source UI files are `assets/speaking-coach*`. Rebuild with `python scripts/build-speaking-coach.py`, then run `node tests/speaking-coach.test.js`. On mobile use the hosted link in Safari/Chrome rather than an HTML preview in Files.

## Grammar Coach — 20 original step-by-step lessons

**https://exclusive4864.github.io/ccbbnn/grammar-coach.html**

20 Thai-led grammar topics plus 8 deep Linking Lab packs, 328 original worked examples, 336 targeted exercises (multiple choice, fill, constrained rewrite and word ordering), and 28 personal transfer-writing tasks. Each lesson follows understand → notice → guided practice → independent practice → transfer. Tricky cases distinguish meaning, register and British/American variation and link to primary grammar references.

The mistake notebook preserves the submitted answer, explanation and last eight attempts. Successful due reviews advance through 1/3/7/14/30-day intervals; early repeats and hinted answers do not advance the level. These are practice signals, not IELTS scores or guarantees of mastery. Free writing uses a self-checklist, not automated grammar grading. Exact-answer exercises accept listed variants and normalize case/spacing; final periods are optional except in the punctuation lesson.

All progress stays in the independent `writewise-grammar-coach-v1` localStorage key. Its JSON backup/import flow is separate from older modules and requires confirmation before replacing local progress. No account, upload, automatic sync or notifications. The public teaching material contains no personal learner submissions or source-book excerpts.

Source files: `data/grammar-part-{a,b,c}.json`, `data/grammar-linking-{a,b,c}.json`, `data/grammar-sources.json` and its linking supplements, `assets/grammar-coach*`. Build: `python scripts/build-grammar-coach.py`. Validate: `node tests/grammar-coach.test.js`; DOM regression: `node tests/grammar-coach-dom.test.js` and `node tests/grammar-coach-edge.test.js` (JSDOM; set `JSDOM_PATH` if outside normal module resolution); browser regression: `node tests/grammar-coach-browser.test.js` (requires Playwright and Chromium; set `BASE_URL` for a live target). The generated page is self-contained; use the hosted URL on mobile instead of a Files preview.

The Linking Lab includes a same-idea sentence transformation selector and a comparison guide. It separates meaning, grammatical slot, punctuation and register, rather than treating short/common words as inferior or teaching a list of automatic “advanced” substitutions.

Each main lesson now has 10 worked examples and each Linking Lab pack has 16. The additional four examples sit in an expandable section to keep mobile reading manageable. A plain-Thai grammar glossary explains terminology beside the teaching steps.
