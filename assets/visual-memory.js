(()=>{
'use strict';
let prefs={theme:'day',pattern:true,collocation:true,vocabulary:true,recall:false,focus:false};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function moduleKey(){return (DATA?.module||'writewise').toLowerCase().includes('transportation')?'transportation':'education'}
function prefKey(){return 'writewise-visual-memory-'+moduleKey()}
function loadPrefs(){try{prefs={...prefs,...JSON.parse(localStorage.getItem(prefKey())||'{}')}}catch(e){}}
function savePrefs(){try{localStorage.setItem(prefKey(),JSON.stringify(prefs))}catch(e){}}
function current(){const id=location.hash.slice(1);return DATA?.lessons?.find(x=>x.id===id)||DATA?.lessons?.[0]}
function applyPrefs(){
 document.body.dataset.theme=prefs.theme;
 document.body.classList.toggle('hide-pattern',!prefs.pattern);
 document.body.classList.toggle('hide-collocation',!prefs.collocation);
 document.body.classList.toggle('hide-vocabulary',!prefs.vocabulary);
 document.body.classList.toggle('recall-mode',!!prefs.recall);
 document.body.classList.toggle('focus',!!prefs.focus);
 const set=(id,on)=>{const e=$(id);if(e){e.classList.toggle('active',!!on);e.setAttribute('aria-pressed',String(!!on))}};
 set('#dayMode',prefs.theme==='day');set('#nightMode',prefs.theme==='night');set('#memoryFocus',prefs.focus);
 set('#togglePattern',prefs.pattern);set('#toggleCollocation',prefs.collocation);set('#toggleVocabulary',prefs.vocabulary);set('#recallMode',prefs.recall);
 const old=$('#focus');if(old)old.textContent=prefs.focus?'Show study notes':'Focus mode';
}
function toolbar(){
 if($('#memoryToolbar'))return;
 const bar=document.createElement('div');bar.id='memoryToolbar';bar.className='memory-toolbar no-print';
 bar.innerHTML='<div class="memory-inner"><button id="dayMode">☀️ Day</button><button id="nightMode">🌙 Night</button><button id="memoryFocus">🎯 Focus</button><button id="togglePattern">⭐ Patterns</button><button id="toggleCollocation">🔗 Collocations</button><button id="toggleVocabulary">📘 Vocabulary</button><button id="clearHighlights">Clear highlights</button><button id="showHighlights">Show all</button><button id="recallMode">🧠 Recall</button><button id="revealMemory">Reveal</button><span class="memory-legend">⭐ Pattern · 🔗 Collocation · 📘 Vocabulary</span></div>';
 document.querySelector('.top')?.insertAdjacentElement('afterend',bar);
 $('#dayMode').onclick=()=>{prefs.theme='day';savePrefs();applyPrefs()};
 $('#nightMode').onclick=()=>{prefs.theme='night';savePrefs();applyPrefs()};
 $('#memoryFocus').onclick=()=>{prefs.focus=!prefs.focus;savePrefs();applyPrefs()};
 $('#togglePattern').onclick=()=>{prefs.pattern=!prefs.pattern;savePrefs();applyPrefs()};
 $('#toggleCollocation').onclick=()=>{prefs.collocation=!prefs.collocation;savePrefs();applyPrefs()};
 $('#toggleVocabulary').onclick=()=>{prefs.vocabulary=!prefs.vocabulary;savePrefs();applyPrefs()};
 $('#clearHighlights').onclick=()=>{prefs.pattern=prefs.collocation=prefs.vocabulary=false;savePrefs();applyPrefs()};
 $('#showHighlights').onclick=()=>{prefs.pattern=prefs.collocation=prefs.vocabulary=true;savePrefs();applyPrefs()};
 $('#recallMode').onclick=()=>{prefs.recall=!prefs.recall;document.querySelectorAll('.memory-mark').forEach(x=>x.classList.remove('revealed'));savePrefs();applyPrefs()};
 $('#revealMemory').onclick=()=>document.querySelectorAll('.memory-mark').forEach(x=>x.classList.add('revealed'));
}
function coachShell(){
 if($('#memoryCoach'))return;
 const d=document.createElement('aside');d.id='memoryCoach';d.className='coach-pop';d.setAttribute('aria-live','polite');
 d.innerHTML='<button class="close-coach" aria-label="Close">×</button><div id="coachBody"></div>';
 document.body.appendChild(d);d.querySelector('.close-coach').onclick=()=>d.classList.remove('open');
}
function sentence(text,needle){return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text]).find(s=>s.toLowerCase().includes(needle.toLowerCase()))?.trim()||text}
function reviewKey(word){return prefKey()+'-review-'+word.toLowerCase()}
function reviewButton(word){
 let on=false;try{on=localStorage.getItem(reviewKey(word))==='1'}catch(e){}
 return '<button class="review-star '+(on?'active':'')+'" data-review="'+esc(word)+'">⭐ '+(on?'Saved':'Review later')+'</button>'
}
function openVocab(word){
 const l=current(),base=DATA.lexicon?.[word],extra=DATA.vocabCoach?.[word]||{};
 if(!base)return;
 const chunks=[...new Set(DATA.lessons.flatMap(x=>x.collocations||[]).map(c=>c[0]).filter(c=>c.toLowerCase().includes(word.toLowerCase())))].slice(0,5);
 const body=$('#coachBody');body.innerHTML='<div class="coach-label">📘 Vocabulary Coach</div><h3>'+esc(word)+'</h3>'+
 '<p><b>'+esc(base[0])+'</b> · '+esc(base[1])+'</p>'+
 '<div class="coach-block"><b>Simple English</b><br>'+esc(extra.definition||'A useful academic term; study its meaning through the example and usage note below.')+'</div>'+
 '<div class="coach-block"><b>Useful collocations</b><br>'+(chunks.length?chunks.map(x=>'• '+esc(x)).join('<br>'):'• Use the word in the fixed combinations shown in this lesson.')+'</div>'+
 '<div class="coach-block"><b>Natural example</b><br><i>'+esc(base[2])+'</i></div>'+
 '<div class="coach-block"><b>Word family / related form</b><br>'+esc(extra.family||'Check the form used in the model sentence before changing it.')+'</div>'+
 '<div class="coach-block"><b>Usage note / common error</b><br>'+esc(base[3])+'</div>'+
 '<div class="coach-actions"><button data-speak="'+esc(word)+'">🔊 Listen</button>'+reviewButton(word)+'</div>';
 bindCoachButtons();$('#memoryCoach').classList.add('open');
}
function openCollocation(phrase){
 const l=current(),row=(l.collocations||[]).find(c=>c[0].toLowerCase()===phrase.toLowerCase());
 const all=l.essay.join(' '),ex=sentence(all,phrase);
 const first=phrase.split(' ')[0].toLowerCase(),verbs=['develop','gain','provide','manage','integrate','verify','adapt','build','seek','share','review','remain','carry','reduce','ease','reinvest','mitigate','restrict','retain','replace','release','coordinate','fill','grant','enter','spread'];
 const frame=verbs.includes(first)?first+' + '+phrase.split(' ').slice(1).join(' '):'fixed noun phrase / chunk: '+phrase;
 $('#coachBody').innerHTML='<div class="coach-label">🔗 Collocation Coach</div><h3>'+esc(phrase)+'</h3>'+
 '<p><b>Thai:</b> '+esc(row?.[1]||'ดูความหมายจากบริบทของประโยค')+'</p>'+
 '<div class="coach-block"><b>Grammatical frame</b><br>'+esc(frame)+'</div>'+
 '<div class="coach-block"><b>Essay example</b><br><i>'+esc(ex)+'</i></div>'+
 '<div class="coach-block"><b>New-use prompt</b><br>ลองแต่งประโยคใหม่โดยคง chunk <b>'+esc(phrase)+'</b> ไว้ แล้วเปลี่ยนผู้กระทำหรือสถานการณ์ อย่าแปลคำทีละคำจากภาษาไทย</div>'+
 '<div class="coach-block"><b>Common warning</b><br>รักษาลำดับคำของ collocation นี้ก่อน แล้วค่อยเปลี่ยน tense, article หรือรายละเอียดตาม grammar ของประโยค</div>'+
 '<div class="coach-actions">'+reviewButton(phrase)+'</div>';
 bindCoachButtons();$('#memoryCoach').classList.add('open');
}
function openPattern(text){
 const l=current(),g=DATA.typeGuides[l.type],p=g.patterns?.[0]||[],all=l.essay.join(' ');
 $('#coachBody').innerHTML='<div class="coach-label">⭐ Pattern Coach</div><h3>'+esc(text)+'</h3>'+
 '<p><b>Function:</b> '+esc(p[1]||g.thinking)+'</p>'+
 '<div class="coach-block"><b>Grammar structure</b><br>'+esc(p[2]||p[0]||g.thinking)+'</div>'+
 '<div class="coach-block"><b>When to use</b><br>'+esc((g.asks||[]).join(' · '))+'</div>'+
 '<div class="coach-block"><b>Current essay</b><br><i>'+esc(sentence(all,text))+'</i></div>'+
 '<div class="coach-block"><b>Reusable frame</b><br>'+esc(p[0]||text)+'</div>'+
 '<div class="coach-block"><b>Same-topic example</b><br>'+esc(g.patternExamples?.[0]||'Adapt the frame to the exact claim.')+'</div>'+
 '<div class="coach-block"><b>Different-topic transfer</b><br>'+esc(l.transfer?.[2]||l.transfer?.[0]||'Change the topic but keep the reasoning function.')+'</div>'+
 '<p class="micro">จำหน้าที่ของโครงสร้าง ไม่ใช่ท่องทั้ง essay.</p>';$('#memoryCoach').classList.add('open');
}
function bindCoachButtons(){
 document.querySelectorAll('#memoryCoach [data-speak]').forEach(b=>b.onclick=()=>{if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(b.dataset.speak))}});
 document.querySelectorAll('#memoryCoach [data-review]').forEach(b=>b.onclick=()=>{const k=reviewKey(b.dataset.review),on=localStorage.getItem(k)==='1';localStorage.setItem(k,on?'0':'1');b.classList.toggle('active',!on);b.textContent='⭐ '+(!on?'Saved':'Review later')});
}
function annotateElement(el,annotations){
 const text=el.textContent||'';if(!text||!annotations?.length)return;
 const hits=[];
 for(const a of annotations){let start=0,low=text.toLowerCase(),needle=String(a.text).toLowerCase();if(!needle)continue;while((start=low.indexOf(needle,start))>=0){hits.push({start,end:start+needle.length,a});start+=needle.length}}
 hits.sort((x,y)=>x.start-y.start||(y.end-y.start)-(x.end-x.start));
 const chosen=[];let end=-1;for(const h of hits){if(h.start>=end){chosen.push(h);end=h.end}}
 if(!chosen.length)return;
 let out='',pos=0;for(const h of chosen){out+=esc(text.slice(pos,h.start));const actual=text.slice(h.start,h.end),kind=h.a.type;out+='<span class="memory-mark hl-'+kind+'" data-kind="'+esc(kind)+'" data-key="'+esc(h.a.text)+'" data-priority="'+esc(h.a.priority||'useful')+'" tabindex="0" role="button">'+esc(actual)+'</span>';pos=h.end}out+=esc(text.slice(pos));el.innerHTML=out;
}
function applyAnnotations(){
 const l=current();if(!l)return;
 document.querySelectorAll('.para .en').forEach(el=>annotateElement(el,l.annotations||[]));
 document.querySelectorAll('.star .p').forEach(el=>{el.style.cursor='pointer';el.title='Tap for Pattern Coach'});
 document.querySelectorAll('.collo').forEach(el=>{el.style.cursor='pointer';el.title='Tap for Collocation Coach'});
 applyPrefs();
}
function events(){
 document.addEventListener('click',e=>{
   const mark=e.target.closest('.memory-mark');if(mark){if(prefs.recall&&!mark.classList.contains('revealed')){mark.classList.add('revealed');return}const k=mark.dataset.kind;if(k==='vocabulary')openVocab(mark.dataset.key);else if(k==='collocation')openCollocation(mark.dataset.key);else openPattern(mark.dataset.key);return}
   const star=e.target.closest('.star .p');if(star){openPattern(star.textContent.trim());return}
   const col=e.target.closest('.collo');if(col){openCollocation(col.textContent.split(' · ')[0].trim());return}
 });
 document.addEventListener('dblclick',e=>{const mark=e.target.closest('.hl-vocabulary');if(mark){e.preventDefault();openVocab(mark.dataset.key)}});
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList?.contains('memory-mark')){e.preventDefault();e.target.click()}});
 const main=$('#main');if(main)new MutationObserver(()=>requestAnimationFrame(applyAnnotations)).observe(main,{childList:true,subtree:true});
}
function initMemory(){
 loadPrefs();toolbar();coachShell();events();
 const old=$('#focus');if(old)old.onclick=()=>{prefs.focus=!prefs.focus;savePrefs();applyPrefs()};
 applyPrefs();applyAnnotations();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMemory);else initMemory();
})();