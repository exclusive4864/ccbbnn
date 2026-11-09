/* Pure grammar practice state, grading and backup validation. No network requests. */
(function(root){'use strict';
const DAY=86400000, intervals=[1,3,7,14,30], APP='writewise-grammar-coach', VERSION=1;
function normalize(s){return String(s||'').normalize('NFKC').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').trim().replace(/\s+/g,' ').toLowerCase();}
function grade(q,answer){const clean=s=>/^punctuation-/.test(q.id)?normalize(s):normalize(s).replace(/\.$/,'');const n=clean(answer);return (q.answers||[]).some(a=>clean(a)===n);}
function record(previous,result,now=Date.now()){
 const p=previous||{}, independent=result.correct&&!result.assisted;
 const r={...p,attempts:(p.attempts||0)+1,lastAnswer:String(result.answer||'').slice(0,3000),lastCorrect:!!result.correct,lastAt:now,lastAssisted:!!result.assisted,misses:(p.misses||0)+(result.correct?0:1)};
 const canAdvance=!p.due||p.due<=now;
 if(!result.correct){r.stage=0;r.due=now+600000;r.unresolved=true;r.lastWrong=r.lastAnswer;}
 else if(!independent){r.stage=p.stage||0;r.due=p.due>now?p.due:now+DAY;r.unresolved=!!p.unresolved;}
 else if(canAdvance){r.stage=Math.min(5,(p.stage||0)+1);r.due=now+intervals[r.stage-1]*DAY;r.unresolved=!!p.unresolved&&r.stage<2;}
 else {r.stage=p.stage||0;r.due=p.due;r.unresolved=!!p.unresolved;}
 r.history=[...(p.history||[]),{answer:r.lastAnswer,correct:r.lastCorrect,assisted:r.lastAssisted,at:now}].slice(-8);
 return r;
}
function fresh(){return {version:VERSION,records:{},lessons:{},notes:{},preferences:{theme:'night',font:18},updated:0};}
function isObject(v){return v&&typeof v==='object'&&!Array.isArray(v);}
function safeNumber(v,max=8640000000000000){return typeof v==='number'&&Number.isSafeInteger(v)&&v>=0&&v<=max;}
function validateBackup(input,lessonIds,questionIds){
 if(!isObject(input)||input.app!==APP||input.version!==VERSION||!isObject(input.state))throw Error('ไฟล์นี้ไม่ใช่ข้อมูล Grammar Coach รุ่นที่รองรับ');
 const s=input.state,out=fresh();if(!isObject(s.records)||!isObject(s.lessons)||!isObject(s.notes))throw Error('โครงสร้างข้อมูลไม่ครบ');
 for(const [id,r] of Object.entries(s.records)){
  if(!questionIds.has(id))continue;if(!isObject(r))throw Error('ประวัติแบบฝึกไม่ถูกต้อง');
  const v={};for(const k of ['attempts','misses','stage','due','lastAt'])if(r[k]!==undefined){if(!safeNumber(r[k],k==='stage'?5:k==='attempts'||k==='misses'?1000000:8640000000000000))throw Error('ค่าประวัติแบบฝึกไม่ถูกต้อง');v[k]=r[k];}
  for(const k of ['lastAnswer','lastWrong'])if(typeof r[k]==='string')v[k]=r[k].slice(0,3000);
  for(const k of ['lastCorrect','lastAssisted','unresolved'])v[k]=!!r[k];
  v.history=Array.isArray(r.history)?r.history.slice(-8).filter(x=>isObject(x)&&typeof x.answer==='string'&&safeNumber(x.at)).map(x=>({answer:x.answer.slice(0,3000),correct:!!x.correct,assisted:!!x.assisted,at:x.at})):[];out.records[id]=v;
 }
 for(const [id,v] of Object.entries(s.lessons))if(lessonIds.has(id)&&isObject(v)){
  const l={};for(const k of ['step','guidedAt','soloAt'])if(safeNumber(v[k],k==='step'?4:30))l[k]=v[k];
  for(const k of ['read','guidedDone','soloDone','transferDone'])l[k]=!!v[k];
  if(Array.isArray(v.checks))l.checks=v.checks.slice(0,12).map(Boolean);out.lessons[id]=l;
 }
 for(const [id,n]of Object.entries(s.notes))if(lessonIds.has(id)&&typeof n==='string')out.notes[id]=n.slice(0,15000);
 if(isObject(s.preferences)){if(['night','light'].includes(s.preferences.theme))out.preferences.theme=s.preferences.theme;if(safeNumber(s.preferences.font,24)&&s.preferences.font>=16)out.preferences.font=s.preferences.font;}
 return out;
}
function counts(state,questions,now=Date.now()){const ids=questions.map(q=>q.id);return {tried:ids.filter(id=>state.records[id]).length,due:ids.filter(id=>state.records[id]?.due<=now).length,mistakes:ids.filter(id=>state.records[id]?.unresolved).length,stable:ids.filter(id=>(state.records[id]?.stage||0)>=3).length};}
const api={APP,VERSION,DAY,intervals,normalize,grade,record,fresh,validateBackup,counts};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GrammarCore=api;
})(typeof window==='undefined'?globalThis:window);
