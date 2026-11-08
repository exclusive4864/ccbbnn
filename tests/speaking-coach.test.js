'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),Core=require('../assets/speaking-coach-core.js');
const data=JSON.parse(fs.readFileSync('data/speaking-vocabulary.json','utf8'));
const rows=data.topics.flatMap(t=>t.entries),ids=new Set(rows.map(e=>e.id)),keys=new Set(rows.map(e=>e.key)),batches=new Set(data.batches.map(b=>b.id));
assert.equal(rows.length,444);assert.equal(data.topics.length,16);assert.equal(ids.size,444);assert.equal(data.batches.length,95);
assert.equal(data.batches.flatMap(b=>b.entries).length,444);assert.equal(new Set(data.batches.flatMap(b=>b.entries)).size,444);
for(const b of data.batches){assert(b.entries.length>0&&b.entries.length<=5);assert(b.entries.every(id=>ids.has(id)));assert(b.transfer.length>10);}
for(const e of rows){for(const k of ['phrase','meaningTh','definition','pattern','example','recallPrompt','personalPrompt'])assert.equal(typeof e[k],'string',e.id+' '+k);assert(!e.recallPrompt.toLowerCase().includes(e.phrase.toLowerCase()),e.id+' leaks full phrase');}
const t=new Date(2026,10,8,12).getTime(),D=Core.DAY;
let p=Core.schedule({},2,t);assert.equal(p.stage,1);assert.equal(p.due,t+D);assert.equal(p.streak,1);
p=Core.schedule(p,2,t+60000);assert.equal(p.stage,1);assert.equal(p.streak,1);assert.equal(p.due,t+D);
p=Core.schedule(p,2,t+D);assert.equal(p.stage,2);assert.equal(p.due,t+4*D);assert.equal(p.streak,2);
p=Core.schedule(p,2,t+2*D);assert.equal(p.stage,2);assert.equal(p.due,t+4*D);assert.equal(p.streak,2);
p=Core.schedule(p,0,t+2*D+1);assert.equal(p.stage,0);assert.equal(p.streak,0);assert.equal(p.due,t+2*D+1+600000);
p=Core.schedule(p,1,t+2*D+2);assert.equal(p.due,t+3*D+2);
p=Core.schedule({},2,t);for(let n=0;n<10;n++)p=Core.schedule(p,2,p.due);assert.equal(p.stage,6);assert.equal(p.due-p.lastReviewed,60*D);
const key=rows[0].key,wrap=x=>({app:'writewise-speaking-coach',version:1,progress:{[key]:x}});
assert.throws(()=>Core.validateBackup(wrap({stage:1.5}),keys,batches));
assert.throws(()=>Core.validateBackup(wrap({due:null}),keys,batches));
assert.throws(()=>Core.validateBackup(wrap({lastGrade:3}),keys,batches));
assert.throws(()=>Core.validateBackup(wrap({due:1e30}),keys,batches));
assert.throws(()=>Core.validateBackup({app:'other'},keys,batches));
const clean=Core.validateBackup({...wrap({stage:2,due:t}),notes:{[key]:'<script>alert(1)</script>',__proto__:'bad',unknown:'skip'}},keys,batches);assert.equal(clean.notes[key],'<script>alert(1)</script>');assert.equal(clean.notes.unknown,undefined);
const html=fs.readFileSync('vocabulary-coach.html','utf8');const scripts=[...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(m=>m[1]);assert.equal(scripts.length,3);JSON.parse(scripts[0]);for(const s of scripts.slice(1))new vm.Script(s);
const old=fs.readFileSync('index.html','utf8');for(const m of old.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
assert(!/docs\.google\.com|exclusive4864@gmail|drive\.google\.com/.test(html));
assert(!/<script[^>]*src=|<link[^>]*stylesheet/.test(html));assert(old.includes('vocabulary-coach.html'));
console.log('PASS: 444 entries, 16 topics, 95 batches, complete coverage, nonleaking prompts, scheduler transitions, same-day/early-repeat safeguards, backup validation, script syntax, private-source exclusion, self-contained output.');
