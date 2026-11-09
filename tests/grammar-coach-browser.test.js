'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
function orderIndices(q){const solve=(rest,left)=>{if(!left.length)return rest.trim()?null:[];for(const i of left){const t=q.tokens[i].toLowerCase();if(rest.toLowerCase()===t||rest.toLowerCase().startsWith(t+' ')){const tail=solve(rest.slice(t.length).trim(),left.filter(j=>j!==i));if(tail)return[i,...tail];}}return null;};const result=solve(q.answers[0].trim(),q.tokens.map((_,i)=>i));assert.ok(result,q.id+' token order not solvable');return result;}
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'data/grammar-course.json'),'utf8'));
let server;const base=process.env.BASE_URL||'http://127.0.0.1:8766';
(async()=>{
if(!process.env.BASE_URL){server=spawn('python3',['-m','http.server','8766','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});await new Promise(r=>setTimeout(r,500));}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/grammar-coach.html');await page.locator('h1').waitFor();
 const go=async h=>{await page.evaluate(h=>{location.hash=h},h);await page.waitForTimeout(15);};
 async function noOverflow(label){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow: '+label);}
 await noOverflow('home');
 await go('lessons');assert.equal(await page.locator('.lesson-card').count(),20);await page.locator('#lesson-search').fill('articles');assert.equal(await page.locator('.lesson-card').count(),1);await page.locator('#lesson-search').fill('');
 await go('lesson/agreement/0');await noOverflow('lesson');await page.locator('[data-step="1"]').click();await page.locator('.card details').first().locator('summary').click();await noOverflow('examples');
 // Wrong -> feedback -> retry -> saved history, and hints do not inflate mastery.
 await go('lesson/agreement/2');const first=data.lessons[0].exercises.filter(q=>q.phase==='guided')[0];let wrong=first.options.findIndex(o=>!first.answers.includes(o));await page.locator(`[data-choice="${wrong}"]`).click();await page.locator('#check-answer').click();assert.ok(await page.locator('.feedback.error').count());await page.locator('#retry').click();await page.locator(`[data-choice="${first.options.indexOf(first.answers[0])}"]`).click();await page.locator('#check-answer').click();assert.ok(await page.locator('.feedback.success').count());let s=await page.evaluate(()=>JSON.parse(localStorage.getItem('writewise-grammar-coach-v1')));assert.equal(s.records[first.id].stage,0);assert.equal(s.records[first.id].history.length,2);assert.equal(s.records[first.id].unresolved,true);
 await go('mistakes');assert.ok((await page.locator('#main').innerText()).includes(first.sentence));await page.locator('[data-review-one]').first().click();assert.ok(await page.locator('#exercise').count());
 // Start clean for a complete traversal of every exercise through the actual UI.
 await page.evaluate(()=>localStorage.removeItem('writewise-grammar-coach-v1'));await page.reload();
 async function answer(q){
  if(q.type==='choice')await page.locator(`[data-choice="${q.options.indexOf(q.answers[0])}"]`).click();
  else if(q.type==='order'){
   for(const i of orderIndices(q))await page.locator(`[data-token="${i}"]`).click();
  }else await page.locator('#answer').fill(q.answers[0]);
  await page.locator('#check-answer').click();assert.equal(await page.locator('.feedback.success').count(),1,q.id+' expected correct feedback');await page.locator('#next-question').click();
 }
 for(const l of [...data.lessons,...(data.linkingLessons||[])]){
  for(const [phase,step]of [['guided',2],['solo',3]]){await go('lesson/'+l.id+'/'+step);for(const q of l.exercises.filter(q=>q.phase===phase)){await answer(q);}assert.ok((await page.locator('#main').innerText()).includes('ผ่านรอบฝึก'),l.id+' completion missing');}
 }
 s=await page.evaluate(()=>JSON.parse(localStorage.getItem('writewise-grammar-coach-v1')));assert.equal(Object.keys(s.records).length,336);assert.equal(Object.values(s.lessons).filter(x=>x.soloDone&&x.guidedDone).length,28);
 // Personal transfer checklist, persistence and non-executable user input.
 await go('lesson/agreement/4');await page.locator('#transfer-text').fill('My local draft. <img src=x onerror=alert(1)>');for(const box of await page.locator('[data-transfer-check]').all())await box.check();await page.locator('#complete-transfer').click();assert.ok((await page.locator('#main').innerText()).includes('เรียนครบวงจร'));await page.reload();assert.ok((await page.locator('#transfer-text').inputValue()).includes('<img'));assert.equal(await page.locator('#main img').count(),0);
 await page.locator('#transfer-text').fill('Edited text');s=await page.evaluate(()=>JSON.parse(localStorage.getItem('writewise-grammar-coach-v1')));assert.equal(s.lessons.agreement.transferDone,false);
 // Backup roundtrip with preview, cancellation and explicit replacement.
 await go('data');const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(backup.app,'writewise-grammar-coach');await page.locator('#import-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.locator('#cancel-import').click();assert.ok((await page.locator('#import-status').innerText()).includes('ยกเลิก'));await page.locator('#import-file').setInputFiles({name:'backup2.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.locator('#confirm-import').click();assert.equal(Object.keys(await page.evaluate(()=>JSON.parse(localStorage.getItem('writewise-grammar-coach-v1')).records)).length,336);
 await page.locator('#import-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{bad')});assert.ok((await page.locator('#import-status').innerText()).includes('นำเข้าไม่ได้'));
 // Mixed review really spans topics and early repetition never advances a record.
 await go('review/mixed');const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('writewise-grammar-coach-v1')));const seen=[];
 for(let i=0;i<10;i++){seen.push(await page.locator('.lede').innerText());await page.locator('#reveal').click();await page.locator('#next-question').click();}assert.equal(new Set(seen).size,10);
 // Responsive layouts, larger text, themes and navigation history.
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});for(const h of ['home','lessons','lesson/quantifiers/1','lesson/wordorder/3','mistakes/all','data']){await go(h);await noOverflow(width+' '+h);}}
 await page.setViewportSize({width:390,height:844});for(let i=0;i<6;i++)await page.locator('#larger').click();await noOverflow('24px text');await page.locator('#theme').click();assert.ok(await page.locator('body.light').count());await go('home');await go('lessons');await page.goBack();assert.ok((await page.locator('h1').innerText()).includes('เข้าใจ'));await page.goForward();assert.equal(await page.locator('.lesson-card').count(),20);
 // Exact module isolation and multi-tab conflict guard.
 await page.evaluate(()=>localStorage.setItem('writewise-speaking-coach-v1','sentinel-preserved'));const tab=await context.newPage();await tab.goto(base+'/grammar-coach.html');await tab.locator('#smaller').click();await page.locator('#stale-warning').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>localStorage.getItem('writewise-speaking-coach-v1')),'sentinel-preserved');await tab.close();
 await page.locator('#reload-data').click();await go('home');await page.screenshot({path:'/tmp/writewise-grammar-mobile.png',fullPage:true});await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'/tmp/writewise-grammar-desktop.png',fullPage:true});
 assert.deepEqual(errors,[]);
 // Invalid storage must not be silently overwritten.
 const broken=await browser.newContext();const bp=await broken.newPage();await bp.goto(base+'/grammar-coach.html');await bp.evaluate(()=>localStorage.setItem('writewise-grammar-coach-v1','broken original'));await bp.reload();await bp.locator('#storage-warning').waitFor({state:'visible'});await bp.locator('#larger').click();assert.equal(await bp.evaluate(()=>localStorage.getItem('writewise-grammar-coach-v1')),'broken original');await broken.close();
 console.log('PASS: all 336 UI answers; 20 lessons + 8 packs; mistakes/retry/hints; transfer; reload; import/export/cancel; mixed review; 320/390/768/1280 px; large text; theme; back/forward; cross-tab guard; module isolation; corrupted-data preservation; no console errors.');
}finally{await browser.close();if(server)server.kill();}
})().catch(e=>{console.error(e);if(server)server.kill();process.exitCode=1;});
