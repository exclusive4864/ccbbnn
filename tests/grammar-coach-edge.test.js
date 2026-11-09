'use strict';
// Run with JSDOM_PATH=/path/to/node_modules/jsdom node tests/grammar-coach-edge.test.js.
// Uses the generated HTML, so rebuild after changing source assets.
const {JSDOM,VirtualConsole}=require(process.env.JSDOM_PATH||'jsdom');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'grammar-coach.html'),'utf8');
const course=JSON.parse(fs.readFileSync(path.join(root,'data/grammar-course.json'),'utf8'));
const lessons=[...course.lessons,...(course.linkingLessons||[])],KEY='writewise-grammar-coach-v1';
const tick=()=>new Promise(resolve=>setTimeout(resolve,5));
function setup(initial){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://writewise.test/grammar-coach.html',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){w.lastScrolled=this;};if(initial!==undefined)w.localStorage.setItem(KEY,initial);}});
 const w=dom.window,d=w.document,$=s=>d.querySelector(s);
 const click=s=>{const el=$(s);assert.ok(el,'Missing '+s);el.focus();el.click();};
 const go=async hash=>{w.location.hash=hash;await tick();};
 const file=text=>{Object.defineProperty($('#import-file'),'files',{configurable:true,value:[{size:100,text:typeof text==='function'?text:async()=>text}]});$('#import-file').dispatchEvent(new w.Event('change',{bubbles:true}));};
 return {dom,w,d,$,click,go,file,errors};
}
function backup(note){return JSON.stringify({app:'writewise-grammar-coach',version:1,state:{records:{},lessons:{},notes:{[lessons[0].id]:note},preferences:{theme:'night',font:18}}});}
async function quotaRecovery(){
 const t=setup(),{w,$,click}=t;
 try {const original=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(){throw Error('Simulated quota');};click('#larger');assert.equal($('#storage-warning').hidden,false);assert.equal($('#stale-warning').hidden,true);w.Storage.prototype.setItem=original;click('#larger');assert.equal($('#stale-warning').hidden,true);assert.equal($('#storage-warning').hidden,true);assert.equal(JSON.parse(w.localStorage.getItem(KEY)).preferences.font,20);assert.deepEqual(t.errors,[]);}finally{t.dom.window.close();}
}
async function importFailures(initial){
 const t=setup(initial),{w,$,click,go,file}=t;
 try {await go('data');const before=w.localStorage.getItem(KEY);file(backup('Imported draft'));await tick();const original=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(){throw Error('Simulated quota');};click('#confirm-import');assert.equal(w.localStorage.getItem(KEY),before);assert.ok($('#confirm-import'),'Failed import remains retryable');assert.ok($('#import-status').textContent.includes('ยังนำเข้าไม่สำเร็จ'));assert.notEqual($('#toast').textContent,'นำเข้าข้อมูลแล้ว');assert.equal($('#stale-warning').hidden,true);
 // Original corrupt data remains protected after a failed import.
 if(initial!==undefined){w.Storage.prototype.setItem=original;click('#larger');assert.equal(w.localStorage.getItem(KEY),before);}
 w.Storage.prototype.setItem=original;click('#confirm-import');assert.equal(JSON.parse(w.localStorage.getItem(KEY)).notes[lessons[0].id],'Imported draft');assert.equal($('#toast').textContent,'นำเข้าข้อมูลแล้ว');assert.deepEqual(t.errors,[]);
 }finally{t.dom.window.close();}
}
async function delayedImports(){
 const t=setup(),{w,$,go,file,click}=t;
 try {await go('data');let resolve;file(()=>new Promise(r=>resolve=r));await go('home');resolve(backup('Abandoned'));await tick();assert.ok($('h1').textContent.includes('เข้าใจ'));await go('data');assert.equal($('#confirm-import'),null);
 // A rejected parse after navigation must also exit without a null-element exception.
 file(()=>new Promise(r=>resolve=r));await go('home');resolve('{bad');await tick();await go('data');assert.equal($('#confirm-import'),null);
 // Later selection wins even when the earlier file read finishes last.
 file(()=>new Promise(r=>resolve=r));file(backup('Latest selected file'));await tick();resolve(backup('Older selected file'));await tick();click('#confirm-import');assert.equal(JSON.parse(w.localStorage.getItem(KEY)).notes[lessons[0].id],'Latest selected file');assert.deepEqual(t.errors,[]);
 }finally{t.dom.window.close();}
}
async function keyboardAndRoutes(){
 const t=setup(),{w,d,$,go,click}=t;
 try {await go('lesson/constructor/2');assert.equal($('#exercise'),null);assert.ok($('h1').textContent.includes('ไม่พบบทนี้'));await go('lesson/__proto__/2');assert.equal($('#exercise'),null);
 const l=lessons.find(l=>l.exercises.filter(q=>q.phase==='solo').some(q=>q.type==='choice')&&l.exercises.filter(q=>q.phase==='solo').some(q=>q.type==='order'));
 assert.ok(l,'Fixture requires solo choice and order questions');await go('lesson/'+l.id+'/3');
 for(const q of l.exercises.filter(q=>q.phase==='solo')){
  if(q.type==='choice'){const sel='[data-choice="'+q.options.indexOf(q.answers[0])+'"]';click(sel);assert.equal(d.activeElement,$(sel));}
  if(q.type==='order'){while($('.tokens button:not([disabled])')){click('.tokens button:not([disabled])');assert.ok(d.activeElement!==d.body,'Token selection must retain focus');assert.ok(!d.activeElement.disabled);}assert.equal(d.activeElement,$('#check-answer'));click('[data-untoken]');assert.ok(d.activeElement!==d.body);assert.ok(!d.activeElement.disabled);}
  click('#hint');assert.equal(d.activeElement,$('#hint'));while(!$('#hint').disabled)click('#hint');assert.ok(d.activeElement!==d.body,'Exhausted hint must retain focus');assert.ok(!d.activeElement.disabled);
  click('#reveal');assert.equal(d.activeElement,$('.feedback'));click('#next-question');assert.equal(d.activeElement,$('#question-title')||$('#main'));assert.equal(w.lastScrolled,d.activeElement);
 }
 assert.equal(d.activeElement,$('#main'),'Completed lesson phase focuses main');
 await go('review/mixed');for(let i=0;i<10;i++){click('#reveal');click('#next-question');assert.equal(d.activeElement,$('#question-title')||$('#main'));assert.equal(w.lastScrolled,d.activeElement);}assert.equal(d.activeElement,$('#main'),'Completed review focuses main');assert.deepEqual(t.errors,[]);
 }finally{t.dom.window.close();}
}
(async()=>{await quotaRecovery();await importFailures();await importFailures('corrupt original data');await delayedImports();await keyboardAndRoutes();console.log('PASS edge regressions: quota recovery; failed import rollback/retry; corrupt-data protection; delayed/stale file reads; inherited-key routes; choice/token/hint focus; Next question and completion focus.');})().catch(e=>{console.error(e);process.exitCode=1;});
