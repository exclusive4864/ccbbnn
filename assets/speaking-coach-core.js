/* Pure scheduling and import validation. All review ratings are self-assessments. */
(function(root){'use strict';
const DAY=86400000, intervals=[1,3,7,14,30,60];
function localDay(t){const d=new Date(t);return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-')}
function schedule(previous,grade,now){
 const p=previous||{}, g=Number(grade);if(![0,1,2].includes(g))throw Error('Invalid rating');
 const r={...p,attempts:(p.attempts||0)+1,lastGrade:g,lastReviewed:now};
 if(g===0){r.stage=0;r.due=now+10*60000;r.streak=0;}
 else if(g===1){r.stage=0;r.due=now+DAY;r.streak=0;}
 else if(p.lastIndependentDay!==localDay(now) && (!p.due||p.due<=now)){
  r.stage=Math.min(6,(p.stage||0)+1);r.due=now+intervals[r.stage-1]*DAY;r.streak=(p.streak||0)+1;r.lastIndependentDay=localDay(now);
 }else {r.due=p.due>now?p.due:now+DAY;}
 return r;
}
function validRecord(x){return x&&typeof x==='object'&&!Array.isArray(x)}
function validateBackup(p,validKeys,validBatches){
 if(!validRecord(p)||p.app!=='writewise-speaking-coach'||p.version!==1||!validRecord(p.progress))throw Error('Wrong backup format');
 const out={progress:{},notes:{},batches:{}};
 for(const [key,v]of Object.entries(p.progress)){if(!validKeys.has(key))continue;if(!validRecord(v))throw Error('Invalid record');
 const r={};for(const n of ['stage','streak','attempts','due','lastReviewed','lastGrade']){if(v[n]!==undefined){if(typeof v[n]!=='number'||!Number.isSafeInteger(v[n])||v[n]<0||v[n]>8640000000000000)throw Error('Invalid number');r[n]=v[n]}}
 if((r.stage||0)>6||(r.lastGrade||0)>2||(r.attempts||0)>1000000000||(r.streak||0)>1000000000)throw Error('Invalid review state');if(typeof v.lastIndependentDay==='string')r.lastIndependentDay=v.lastIndependentDay.slice(0,20);out.progress[key]=r;}
 if(validRecord(p.notes))for(const [k,v]of Object.entries(p.notes)){if((validKeys.has(k)||validBatches.has(k))&&typeof v==='string')out.notes[k]=v.slice(0,20000);}
 if(validRecord(p.batches))for(const [k,v]of Object.entries(p.batches)){if(validBatches.has(k)&&typeof v==='number'&&Number.isFinite(v)&&v>0)out.batches[k]=v;}
 return out;
}
const api={DAY,intervals,localDay,schedule,validateBackup};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpeakingCore=api;
})(typeof window==='undefined'?globalThis:window);
