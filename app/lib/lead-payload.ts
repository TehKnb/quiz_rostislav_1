import type { FullReport as Report } from './ai-report';
import { autoChoices, directionFallback, directionNames, methodNote, previewDisclaimer, question, selected, type Profile } from './engine';
const divider='━━━━━━━━━━━━━━━━━━━━',thinDivider='────────────────────';
const block=(title:string,parts:string[])=>[divider,title,divider,'',parts.filter(Boolean).join('\n\n')].join('\n');
export function answerText(step:number,p:Profile){
 const q=question(step,p),text=selected(p,step).map(i=>q.options[i]).join('; ');
 if(step!==0)return text;
 const other=p.other.trim();
 if(p.answers[0]===4)return `${text} — ${autoChoices.find(([v])=>v===p.auto)?.[1]}${p.auto==='other'?`: ${other}`:''}`;
 return p.answers[0]===8?`${text}: ${other}`:text;
}
const scoreBar=(score:number)=>'■'.repeat(Math.round(score/10))+'□'.repeat(10-Math.round(score/10));
function scoreText(s:Report['scores'][number]){
 const name=directionNames[s.group],checked=`Оцінено ${s.count} із 4 запитань`;
 if(s.score===null)return `${name} — недостатньо даних\n${checked}`;
 return `${name} — ${s.score}/100\n${scoreBar(s.score)}  ${s.status}\n${checked}${s.count<4?' · попередня оцінка':''}`;
}
const answered=(items:{question:string;answer:string}[])=>items.map(x=>`• ${x.question}\n  «${x.answer}»`).join('\n');
function directionText(rec:Report['directions'][number],i:number){
 const heading=`${String(i+1).padStart(2,'0')}. ${rec.name.toUpperCase()} — ${rec.score===null?'недостатньо даних':`${rec.score}/100`}\nСтатус: ${rec.status}`;
 return [
  `${thinDivider}\n${heading}\n${thinDivider}`,
  // The card's title and teaser are the first step's own texts, so they are not repeated when those steps are shown.
  rec.steps.length&&!rec.aiSteps?'':`${rec.title}\n${rec.teaser}`,
  `Чому це важливо\n${rec.why}`,
  rec.aiSteps?`Наступні кроки\n${rec.aiSteps.map((s,j)=>`${j+1}. ${s.title}\n   ${s.action}`).join('\n')}`:rec.steps.length?`Наступні кроки\n${rec.steps.map((s,j)=>`${j+1}. ${s.title}\n   ${s.action}\n   Зафіксуйте: ${s.collect}`).join('\n')}`:`З чого почати\n${directionFallback}`,
  `Як оцінити зміни\n${rec.metric}`,
  `Що уточнити на бізнес-розборі\n${rec.discussion}`,
  rec.steps.length?`На основі відповідей\n${answered(rec.steps.map(s=>({question:s.question,answer:s.basis})))}`:''
 ].filter(Boolean).join('\n\n');
}
function recommendationText(rec:Report['recommendations'][number],i:number){
 return [`${i+1}. ${rec.title}`,...[rec.teaser,rec.check!==rec.teaser?rec.check:'',`Зафіксуйте: ${rec.collect}`,`Що уточнити на бізнес-розборі: ${rec.discussion}`,`Основа: ${rec.basis}`].filter(Boolean).map(x=>`   ${x}`)].join('\n');
}
// Built only from the report the visitor sees: no scores or advice are derived here.
export function buildAiText(r:Report){
 const priorities=r.priorities.map(g=>directionNames[g]).join(', ');
 return [
  ['РЕЗУЛЬТАТИ БІЗНЕС-РОЗБОРУ','',`Сфера бізнесу: ${r.sector}`,`Цілі: ${r.goal}`,`Ситуація: ${r.impact}`,priorities?`Перший пріоритет: ${priorities}`:''].filter((x,i)=>x||i===1).join('\n'),
  block('ГОЛОВНИЙ ВИСНОВОК',[r.title,r.explanation,`▸ ${r.firstStep}`]),
  block('ОЦІНКИ ЗА НАПРЯМАМИ',[...r.scores.map(scoreText),'Оцінка процесів за вашими відповідями. Пропуски не враховуються. Бал не є відсотком втраченого прибутку.']),
  block('АНАЛІЗ РЕЗУЛЬТАТІВ',[
   ...r.deepDive.map(part=>`${part.title}\n${part.text}`),
   r.evidence.length?`Що у відповідях вказує на це\n${answered(r.evidence)}`:'',
   r.strongSide?`На що вже можна спертися\n${answered([r.strongSide])}`:'',
   r.conflict?`Що уточнити\n${r.conflict}`:''
  ]),
  block('ПРІОРИТЕТНІ РЕКОМЕНДАЦІЇ',r.recommendations.map(recommendationText)),
  block('РЕКОМЕНДАЦІЇ ЗА НАПРЯМАМИ',r.directions.map(directionText)),
  block('ПРИМІТКА',[previewDisclaimer,methodNote])
 ].join('\n\n');
}
export function buildLeadPayload(phone:string,p:Profile,report:Report){
 const payload:Record<string,string>={name:'Кандидат на розбір',phone:phone.replace(/^\+/,''),nameform:'заявка на бізнес-розбір',source:'Заявка на бізнес-розбір (квіз 20 питань)'};
 p.answers.forEach((_,step)=>{payload[`Q${step+1}`]=question(step,p).title;payload[`A${step+1}`]=answerText(step,p)});
 payload['Ai Text']=buildAiText(report);
 return payload;
}
