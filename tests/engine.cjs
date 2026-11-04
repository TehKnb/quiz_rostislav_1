const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const localRequire=require('node:module').createRequire(path.resolve('app/lib/engine.ts'));
const js=ts.transpileModule(fs.readFileSync('app/lib/engine.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};new Function('require','module','exports',js)(localRequire,mod,mod.exports);const e=mod.exports;
let cases=0;
function sample(sector=0,team=2){const p=e.initialProfile();p.answers=Array(20).fill(0);p.answers[0]=sector;p.answers[1]=team;p.answers[2]=5;p.answers[19]=6;p.other='Тестова сфера';p.auto=sector===5?'restaurant':'repair';return p;}
for(let sector=0;sector<9;sector++)for(let team=0;team<5;team++){const p=sample(sector,team);assert(e.validateProfile(p));for(let step=0;step<20;step++){const q=e.question(step,p);assert(q.title?.length>5);assert(q.options.length>=4);assert(q.options.every(x=>typeof x==='string'&&x.length>1));}assert(e.scores(p).every(s=>s.score===100));assert(e.result(p).high);assert.equal(e.result(p).recommendations.length,3);cases++;}
let p=sample();for(let i=3;i<19;i++)p.answers[i]=4;assert(e.scores(p).every(s=>s.score===null));assert(e.result(p).insufficient);assert.equal(e.result(p).recommendations.length,3);cases++;
p.answers[3]=0;p.answers[4]=3;assert.equal(e.scores(p)[0].score,50);assert.equal(e.scores(p)[0].count,2);p.answers[4]=4;assert.equal(e.scores(p)[0].score,null);cases++;
p=sample();p.answers[2]=1;for(let i=3;i<19;i++)p.answers[i]=3;assert.deepEqual(e.priority(p),[1]);assert.equal(e.result(p).recommendations[0].q,7);assert(e.scores(p).every(s=>s.score===0));cases++;
p=sample(1,0);assert(e.question(6,p).title.includes('у вашому записі'));assert.equal(e.names(p)[2],'Організація роботи');assert(!e.question(11,p).title.includes('людину'));cases++;
p=sample(4);p.auto='cars';assert(e.question(3,p).title.includes('автомобілів'));p.auto='other';assert(e.question(6,p).title.includes('нових звернень'));p.other='';assert(!e.validateProfile(p));cases++;
p=sample();p.answers[8]=3;p.answers[9]=3;const r=e.result(p);assert.equal(r.scores[1].score,50);assert.equal(r.recommendations[0].q,8);assert.equal(r.recommendations[1].q,9);cases++;
assert.equal(e.normalizePhone('067 123 45 67'),'+380671234567');assert.equal(e.normalizePhone('no'),null);assert.equal(e.normalizePhone('123'),null);assert(!e.validateProfile({...sample(),answers:[]}));assert(!e.validateProfile({...sample(),answers:[99,...sample().answers.slice(1)]}));cases++;
// Food sub-choices: restaurants and delivery keep the old wording, cafes get their own, «Інше» goes to the model.
p=sample(5);const steps=[3,4,5,6,7,8,9,10,16],foodTitles=steps.map(i=>e.question(i,p).title);assert(foodTitles[0].includes('доставки'));assert.equal(e.sectorName(p),'Ресторани');
p.auto='delivery';assert.deepEqual(steps.map(i=>e.question(i,p).title),foodTitles);assert.equal(e.sectorName(p),'Доставка');
p.auto='cafe';const cafeTitles=steps.map(i=>e.question(i,p).title);assert.equal(e.sectorName(p),'Кафе');assert(e.validateProfile(p));assert(!e.needsCustomQuestions(p));cafeTitles.forEach((t,i)=>{assert.notEqual(t,foodTitles[i]);assert(!t.includes('доставк'))});assert.equal(e.question(3,p).options.length,e.question(3,sample(0)).options.length);
p.auto='other';assert(e.needsCustomQuestions(p));assert.equal(e.sectorName(p),'Тестова сфера');assert.equal(e.question(3,p).title,e.question(3,sample(8)).title);p.other='';assert(!e.validateProfile(p));
for(const bad of ['','repair','cars']){p=sample(5);p.auto=bad;assert(!e.validateProfile(p),bad);}
cases++;
assert.equal(e.normalizeName('  Олена   Петрівна '),'Олена Петрівна');for(const bad of ['','  ','О','123','<b>Олена</b>','Олена😀','я'.repeat(81)])assert.equal(e.normalizeName(bad),null,bad);cases++;
console.log(`${cases} scenario checks passed: branches, scores, missing data, priorities, personalized recommendations and input validation.`);
// Multiple-choice context must not inflate process scores or depend on click order.
p=sample(2,2);const baseline=e.scores(p);p=e.toggleSelection(p,2,0);p=e.toggleSelection(p,2,1);assert.deepEqual(e.selected(p,2),[5,0,1]);assert.equal(e.toggleSelection(p,2,2),p);assert(e.validateProfile(p));assert.deepEqual(e.scores(p),baseline);assert(e.result(p).goal.includes('Отримувати більше клієнтів'));assert(e.result(p).goal.includes('Частіше доводити'));
p=e.toggleSelection(p,19,0);assert.deepEqual(e.selected(p,19),[0]);p=e.toggleSelection(p,19,2);assert.deepEqual(e.selected(p,19),[0,2]);p=e.toggleSelection(p,19,6);assert.deepEqual(e.selected(p,19),[6]);p=e.toggleSelection(p,19,6);assert(!e.validStep(19,p));p=e.toggleSelection(p,19,1);assert(e.validStep(19,p));
for(const invalid of [[0,0],[0,1,2,3],[9],[-1],['0']])assert(!e.validateProfile({...sample(),goals:invalid}));
assert(!e.validateProfile({...sample(),impacts:[6,1]}));assert(!e.validateProfile({...sample(),goals:[0]}));assert(!e.validateProfile({...sample(),goals:'bad'}));
p=sample();p.answers.fill(3,3,19);p.answers[2]=0;p.goals=[0,1];p.answers[19]=6;const orderA=e.priority(p);p.goals=[1,0];p.answers[2]=1;assert.deepEqual(e.priority(p),orderA);
p=sample(2);p.answers[9]=3;p.answers[10]=3;assert(e.result(p).title.includes('губиться в діалогах'));p.answers[10]=0;assert(!e.result(p).title.includes('губиться в діалогах'));
p=sample(0,0);p.answers[11]=3;assert(!e.result(p).title.includes('Найм'));assert(e.result(p).firstStep.length>10);
const sparse=sample();sparse.answers=Array(20);assert(!e.validateProfile(sparse));
console.log('Multiple-choice checks passed: limits, exclusivity, deselection, validation, order-independent priority and unchanged scores.');
// Every business direction retains its own evidence and actions, including missing-data cases.
p=sample(2,2);p.answers[6]=3;p.answers[9]=3;p.answers[14]=3;p.answers[16]=3;
let detailed=e.result(p);assert.deepEqual(detailed.directions.map(d=>d.steps[0].q),[6,9,14,16]);assert.deepEqual(detailed.directions.map(d=>d.name),['Маркетинг','Продажі','Організація роботи','Аналітика']);
p=sample(1,0);p.answers[11]=3;detailed=e.result(p);assert.equal(detailed.directions[2].steps[0].title,'Знайдіть, куди йде ваш час');assert(!detailed.directions[2].steps.some(s=>s.title.includes('відбору')));
p=sample();p.answers.fill(4,3,19);detailed=e.result(p);assert(detailed.directions.every(d=>!d.enough&&d.steps.length===0&&d.score===null));assert(detailed.deepDive[0].text.includes('недостатньо'));
p=sample();p.answers.fill(0,3,19);assert(e.result(p).deepDive[0].text.includes('налагоджені процеси'));
console.log('Four-direction report checked: relevant evidence, solo actions, unknown processes and strong results.');
