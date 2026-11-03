import source from './source.json';
export type CustomQuestions={niche:string;solo:boolean;titles:string[]};
export type Profile={answers:(number|null)[];auto:string;other:string;goals?:number[];impacts?:number[];custom?:CustomQuestions};
// Steps whose wording differs per niche: the same ones a custom niche gets from the model.
export const customSteps=[3,4,5,6,7,8,9,10,16];
export const initialProfile=():Profile=>({answers:Array(20).fill(null),auto:'',other:''});
export const isMultiple=(step:number)=>step===2||step===19;
export function selected(p:Profile,step:number):number[]{const values=step===2?p.goals:step===19?p.impacts:undefined;return values??(p.answers[step]===null?[]:[p.answers[step]!]);}
export function toggleSelection(p:Profile,step:number,value:number):Profile{
 if(!isMultiple(step))return {...p,answers:p.answers.map((a,i)=>i===step?value:a)};
 const current=selected(p,step);let values:number[];
 if(current.includes(value))values=current.filter(x=>x!==value);
 else if(step===19&&value===6)values=[6];
 else {const base=step===19?current.filter(x=>x!==6):current;if(base.length>=3)return p;values=[...base,value];}
 return {...p,[step===2?'goals':'impacts']:values,answers:p.answers.map((a,i)=>i===step?(values[0]??null):a)};
}
export const sectors=['Стоматологія / медицина','Б’юті / косметологія','Одяг / взуття / аксесуари','Магазин / інтернет-магазин','Автобізнес','Ресторани / кафе / доставка','Будівництво / ремонт','Виробництво','Інша сфера'];
export const teams=['Самостійно, поки без планів наймати','Самостійно, хочу передавати частину роботи','Зі мною працює 1–5 людей','6–20 людей','21 людина або більше'];
export const goals=['Отримувати більше клієнтів','Частіше доводити звернення до оплати','Залишати більше прибутку','Знайти людей і передати їм роботу','Менше часу витрачати на поточні задачі','Розширити бізнес'];
export const impacts=['Не можу планувати потік клієнтів','Витрачаю час на звернення без оплат','Доробляю за командою','Відкладаю відпочинок через роботу','Не розумію реальний прибуток','Відкладаю розвиток через невизначеність із грошима','Нічого з переліченого — хочу побачити наступний крок розвитку'];
export const groups=['Маркетинг','Продажі','Команда','Аналітика'];
export const autoChoices=[['repair','СТО / ремонт'],['cars','Продаж авто'],['other','Інше']] as const;
export const methodNote='Оцінка організації процесів за вашими відповідями. Результат квіза допомагає визначити напрям перевірки; управлінські рішення уточнюються на реальних даних.';
export const previewDisclaimer='Це попередні орієнтири за вашими відповідями. Конкретні рішення варто робити після розбору показників і внутрішніх процесів вашого бізнесу з КНБ';
export function solo(p:Profile){return p.answers[1]!==null&&p.answers[1]!<2}
export function niche(p:Profile):keyof typeof source.niches{const keys=['medical','beauty','fashion','shop','other','food','construction','production','other'] as const;return p.answers[0]===4?(p.auto==='repair'?'repair':p.auto==='cars'?'cars':'other'):keys[p.answers[0]??8]}
export function sectorName(p:Profile){return p.answers[0]===4?(p.auto==='repair'?'СТО / ремонт':p.auto==='cars'?'Продаж авто':p.other||'Автобізнес'):p.answers[0]===8?p.other||'Інша сфера':sectors[p.answers[0]??8]}
export function names(p:Profile){return ['Маркетинг','Продажі',solo(p)?'Організація роботи':'Команда','Аналітика']}
export function impactOptions(p:Profile){return impacts.map((s,i)=>i===2&&solo(p)?'Уся робота тримається на мені, і я не встигаю заплановане':s)}
export const needsCustomQuestions=(p:Profile)=>niche(p)==='other'&&p.other.trim().length>=2;
export const hasCustomQuestions=(p:Profile)=>needsCustomQuestions(p)&&p.custom?.niche===p.other.trim()&&p.custom.solo===solo(p);
export function validCustomTitle(t:unknown):t is string{
 if(typeof t!=='string'||t.length<10||t.length>220||t!==t.trim()||!t.endsWith('?')||/[\u0000-\u001f<>]|https?:|www\.|[ыэъёЫЭЪЁ]/.test(t))return false;
 const letters=t.match(/\p{L}/gu)??[],cyrillic=t.match(/\p{Script=Cyrillic}/gu)??[];
 return cyrillic.length>=letters.length*.6;
}
function validCustomQuestions(c:CustomQuestions){return !!c&&typeof c==='object'&&typeof c.niche==='string'&&c.niche.length<=100&&typeof c.solo==='boolean'&&Array.isArray(c.titles)&&c.titles.length===customSteps.length&&c.titles.every(validCustomTitle)}
export function question(step:number,p:Profile):{title:string;options:string[];hint:string;group:number}{
 if(step===0)return {title:'У якій сфері працює ваш бізнес?',options:sectors,hint:'Оберіть свою сферу — далі запитання підлаштуються під неї.',group:-1};
 if(step===1)return {title:'Як ви зараз працюєте?',options:teams,hint:'Враховуйте працівників і постійних підрядників.',group:-1};
 if(step===2)return {title:'Що ви хочете змінити у своєму бізнесі?',options:goals,hint:'Оберіть до трьох цілей, які зараз мають найбільше значення.',group:-1};
 if(step===19)return {title:'Що в роботі бізнесу впливає особисто на вас?',options:impactOptions(p),hint:'Оберіть до трьох ситуацій. «Нічого з переліченого» обирається окремо.',group:-1};
 let title='',options:string[]=[],hint='Оцініть останні три місяці або останній активний сезон.';
 const key=niche(p),isSolo=solo(p),group=Math.floor((step-3)/4);
 if(step<11){title=source.niches[key][step-3];options=source.shared[step-3];
 if(isSolo&&key==='medical'&&step===3)title='Чи вистачає записів пацієнтів, щоб забезпечувати ваше заплановане завантаження?';
 if(isSolo&&key==='medical'&&step===4)title='Наскільки передбачувано заповнюється запис до вас на найближчі тижні?';
 if(isSolo&&key==='beauty'&&step===6)title='Коли у вашому записі з’являються вільні вікна, що ви робите?';
 if(isSolo&&key==='repair'&&step===3)title='Чи вистачає записів на ремонт для того обсягу роботи, який ви плануєте?';
 if(step===3)hint='Враховуйте також постійних клієнтів. Для нового бізнесу — наявний досвід.';
 if(step===5)hint='Керована система рекомендацій також може бути перевіреним способом.';
 if(step===9)hint='Якщо повторний контакт недоречний або немає контактів — оберіть «Не застосовується».';
 if(step===10&&['medical','beauty'].includes(key))hint='Наступний візит має відповідати потребі людини; у медицині — рекомендації лікаря.';
 }else if(step<15){const row=(isSolo?source.solo:source.team)[step-11];title=row.title;options=row.options;if(!isSolo&&step<14)hint='Якщо ще не наймали людей, оберіть «Не можу оцінити / не застосовується».';}
 else{const row=source.analytics[step-15];title=step===16?source.margin[key]:row.title;options=row.options;
 if(step===17){const examples={medical:'звернення → запис → візит',beauty:'звернення → запис → візит',repair:'звернення → запис → ремонт',cars:'звернення → перегляд → угода',shop:'відвідування → замовлення → оплата',fashion:'відвідування → замовлення → оплата',food:'звернення → підтвердження → замовлення',construction:'запит → прорахунок → договір',production:'запит → прорахунок → договір',other:'звернення → пропозиція → оплата'};hint='Наприклад: '+examples[key]+'. Враховуйте застосовні для вас етапи.';}}
 if(hasCustomQuestions(p)&&customSteps.includes(step))title=p.custom!.titles[customSteps.indexOf(step)];
 return {title,options:[...options,'Не можу оцінити / не застосовується'],hint,group};
}
export function validStep(step:number,p:Profile){const a=p.answers[step];if(isMultiple(step)){const values=selected(p,step);if(!Array.isArray(values)||values.length<1||values.length>3||new Set(values).size!==values.length||values.some(v=>!Number.isInteger(v)||v<0||v>=question(step,p).options.length)||values[0]!==a||(step===19&&values.includes(6)&&values.length>1))return false;}if(a===null||!Number.isInteger(a)||a!<0||a!>=question(step,p).options.length)return false;if(step===0){if(a===4&&!['repair','cars','other'].includes(p.auto))return false;if((a===8||(a===4&&p.auto==='other'))&&p.other.trim().length<2)return false;}return true}
export function validateProfile(raw:unknown):raw is Profile{if(!raw||typeof raw!=='object')return false;const p=raw as Profile;if(!Array.isArray(p.answers)||p.answers.length!==20||typeof p.auto!=='string'||typeof p.other!=='string'||p.other.length>100||(p.custom!==undefined&&!validCustomQuestions(p.custom)))return false;try{return Array.from({length:20},(_,i)=>validStep(i,p)).every(Boolean)}catch{return false}}
export type Score={group:number;name:string;score:number|null;count:number;status:string;level:string};
export function scores(p:Profile):Score[]{return names(p).map((name,group)=>{const arr=p.answers.slice(3+group*4,7+group*4).filter((a):a is number=>a!==null&&a<4&&a>=0);const score=arr.length>=2?Math.round(arr.reduce((s,a)=>s+3-a,0)/(arr.length*3)*100):null;return {group,name,score,count:arr.length,status:score===null?'Недостатньо даних':score<40?'Потребує уваги':score<70?'Є основа для покращення':'Процеси налагоджені',level:score===null?'unknown':score<40?'low':score<70?'mid':'high'};});}
const goalGroup=[0,1,3,2,2,-1],impactGroup=[0,1,2,2,3,3,-1];
export function priority(p:Profile,ss=scores(p)){const available=ss.filter(s=>s.score!==null);if(!available.length)return [] as number[];const min=Math.min(...available.map(s=>s.score!));const tied=available.filter(s=>s.score===min).map(s=>s.group);for(const preferences of [selected(p,2).map(i=>goalGroup[i]),selected(p,19).map(i=>impactGroup[i])]){const matches=tied.filter(g=>preferences.includes(g));if(matches.length===1)return matches;if(matches.length>1){const impactMatches=matches.filter(g=>selected(p,19).some(i=>impactGroup[i]===g));return (impactMatches.length?impactMatches:matches).slice(0,2);}}return tied.slice(0,2)}
export type Recommendation={q:number;title:string;teaser:string;check:string;collect:string;discussion:string;basis:string};
const advice:[string,string,string,string][]=[
 ['Порівняйте попит із вашим планом','За останні чотири активні тижні зіставте кількість замовлень або записів із потрібним завантаженням.','План, фактичний попит, вільні потужності й сезонні обставини.','Чого бракує для плану: звернень, доступності пропозиції чи можливостей виконання?'],
 ['Побачте, коли змінюється попит','Подивіться, як змінювалися звернення за тижнями та які події збігалися з цими змінами.','Кількість звернень, дати кампаній, сезонні піки й паузи.','Яку частину коливань можна пояснити та врахувати у плануванні?'],
 ['Перевірте джерела клієнтів','Візьміть останні 10 покупок або замовлень і з’ясуйте відомі джерела звернень. Невідоме так і позначте.','Джерело, результат звернення та відомі витрати на залучення.','Який спосіб залучення варто перевірити повторно і за яким показником?'],
 ['Розберіть останнє просідання','Відновіть послідовність дій під час останнього спаду попиту. Відділіть факти від припущень.','Що змінилося, що зробили, які показники були до та після.','Яку причину просідання перевірити перед наступною рекламною дією?'],
 ['Перевірте перший контакт','Перегляньте 10 останніх звернень: коли надійшла відповідь і чи був зрозумілий наступний крок.','Час відповіді, зміст запиту й підсумок діалогу.','На якому етапі людині бракує відповіді або зрозумілої подальшої дії?'],
 ['З’ясуйте, що стоїть за «подумаю»','Перегляньте кілька діалогів після обговорення ціни. Чи була зафіксована причина сумнівів?','Питання клієнта, відповідь, причина відмови або невідомий результат.','Як уточнювати сумніви й погоджувати доречний наступний крок без тиску?'],
 ['Розберіть незавершені звернення','Перегляньте останні 10 діалогів без покупки: відмова, невідповідний товар, невирішене питання чи відкладене рішення.','Причину зупинки; якщо вона невідома — позначте це окремо.','У яких ситуаціях повторний контакт доречний і хто має за нього відповідати?'],
 ['Знайдіть доречний контакт після покупки','Перевірте, як завершується взаємодія з клієнтом і чи потрібен йому супровід після покупки.','Потреби в підтримці, відгуки, запити на наступні послуги або товари.','Який супровід корисний клієнту саме у вашій сфері?'],
 ['Уточніть результат роботи людини','Виберіть одну посаду й запишіть, який результат ви очікуєте від людини та як його побачите.','Основні задачі, межі відповідальності й критерії результату.','Наскільки очікування зрозумілі та реалістичні для цієї ролі?'],
 ['Перегляньте критерії відбору','Візьміть останню вакансію й зіставте запитання на співбесіді з реальними задачами посади.','Критерії, приклади завдань і спосіб оцінки навичок.','Які навички потрібно перевіряти до рішення про найм?'],
 ['Перевірте входження в роботу','Відновіть перші два тижні останнього новачка: які пояснення, матеріали та допомогу він отримав.','План, відповідальний за допомогу, контрольні точки й типові труднощі.','Яких умов бракувало, щоб людина могла виконувати роботу самостійніше?'],
 ['Побачте, які рішення залежать від вас','Протягом кількох робочих днів запишіть питання, з якими команда звертається до вас.','Повторювані питання, причина звернення, доступні повноваження.','Яку повторювану задачу можна підготувати до передачі з чіткими межами?'],
 ['Перевірте розрахунок прибутку','Зіставте доходи й витрати за останній завершений період та позначте відсутні дані.','Доходи, прямі й постійні витрати; окремо рух грошей та особисті вилучення.','Які дані потрібні, щоб відрізнити прибуток від залишку грошей?'],
 ['Порівняйте економіку пропозицій','Виберіть кілька типових товарів, послуг або замовлень і зведіть виручку та прямі витрати.','Закупівля або матеріали, виконання, доставка та інші пов’язані витрати.','Які пропозиції потрібно детальніше порахувати перед рішенням про масштабування?'],
 ['Побачте шлях до оплати в цифрах','Візьміть один завершений період і порахуйте звернення та переходи на відомих вам етапах.','Звернення, наступний крок, покупки й невідомі результати.','На якому етапі бракує даних, щоб оцінити результат роботи?'],
 ['Підготуйте цифри до наступного рішення','Виберіть одне заплановане вкладення й запишіть припущення, на яких воно ґрунтується.','Вартість, строки платежів, очікуваний ефект і спосіб перевірки припущень.','Яких даних бракує для обґрунтованого рішення?'],
];
const soloAdvice:[string,string,string,string][]=[
 ['Знайдіть, куди йде ваш час','Запишіть задачі й фактичний час на них протягом трьох типових робочих днів.','Поточна робота, розвиток, повторні дії та непередбачені задачі.','Що варто впорядкувати або скоротити, щоб звільнити час для розвитку?'],
 ['Упорядкуйте одну повторювану задачу','Оберіть часту задачу та опишіть кроки її виконання. Позначте місця, де виникають переробки.','Частота, витрачений час і причини повторної роботи.','Де достатньо шаблону чи простого порядку дій?'],
 ['Зведіть домовленості в одне місце','Перегляньте активні домовленості з клієнтами та запишіть строки й наступні дії.','Задача, дата, статус і обіцяний результат.','Який зручний спосіб обліку допоможе нічого не пропускати?'],
 ['Підготуйте план на випадок паузи','Перевірте найближчі домовленості: що потрібно зробити, якщо три дні не зможете працювати.','Кого попередити, що перенести, які строки потрібно погодити.','Як зберегти зрозумілі домовленості без постійної доступності?'],
];
const titles=['Перевірте, наскільки керовано ви залучаєте клієнтів','Перевірте шлях від звернення до покупки','Перевірте організацію роботи й відповідальність','Перевірте цифри, на яких ґрунтуються рішення'];
const explanations=['Зіставте ваш план із реальним попитом і джерелами звернень. Це допоможе уточнити, яку частину залучення ви можете планувати.','Важливо побачити, що відбувається з людиною після першого звернення, на якому моменті діалог завершується та чи відома причина.','Варто уточнити, як організовані повторювані задачі, передача відповідальності й робота без постійних уточнень.','Варто зіставити доступні дані про доходи, витрати й етапи продажу, щоб зрозуміти, чого бракує для управлінських рішень.'];
function insight(p:Profile,g:number,q:number){
 const retail=['fashion','shop'].includes(niche(p));
 const headings=[
 'Можливості є. Попиту поки не вистачає для вашого плану.',
 'Складно планувати зростання, коли потік клієнтів непередбачуваний.',
 'Залучення клієнтів поки складно повторити за планом.',
 'Коли попит падає, бізнесу бракує зрозумілого наступного кроку.',
 'Частина звернень не отримує уваги вчасно.',
 'Сумніви клієнтів потребують уваги до наступної рекламної кампанії.',
 'Зацікавлені люди залишаються без продовження діалогу.',
 'Після покупки взаємодія з клієнтом часто переривається.',
 'Найм починається з людини. Але спершу потрібна ясність щодо її результату.',
 'Враження від кандидата поки замінює перевірку його навичок.',
 'Новій людині бракує зрозумілого входження в роботу.',
 'Занадто багато поточних рішень чекають саме на вас.',
 'Продажі видно. Реальний прибуток — поки не повністю.',
 'Виручка ще не показує, які пропозиції вигідніші для бізнесу.',
 'Ви бачите не весь шлях від першого звернення до оплати.',
 'Наступне вкладення потребує чіткіших розрахунків.'
 ];
 const soloHeadings=['Поточна робота забирає час, потрібний для розвитку.','Повторювані задачі щоразу потребують вашої уваги.','Домовленості розпорошені — важливе легко пропустити.','Пауза у вашій роботі потребує завчасного плану.'];
 const weak=p.answers[q]!==null&&p.answers[q]!>=2&&p.answers[q]!<4;
 const title=weak?(solo(p)&&q>=11&&q<=14?soloHeadings[q-11]:headings[q-3]):titles[g];
 const context=weak?'За вашими відповідями, саме цей процес варто перевірити детальніше. Це допоможе зрозуміти, що змінити для руху до ваших цілей.':explanations[g];
 if(g===1&&retail&&[2,3].includes(p.answers[9]??-1)&&[2,3].includes(p.answers[10]??-1))return {title:'Інтерес є. Частина покупок губиться в діалогах.',explanation:'За вашими відповідями, ви нерегулярно повертаєтеся до незавершених замовлень. Після покупки контакт також переважно завершується.',firstStep:'Перша точка уваги — покупці, які вже зацікавилися вашим товаром.'};
 return {title,explanation:context,firstStep:weak?'Почніть з однієї перевірки: '+(solo(p)&&q>=11&&q<=14?soloAdvice[q-11][0]:advice[q-3][0]).toLowerCase()+'.':'Підтвердьте оцінку реальними прикладами й оберіть одну зміну для перевірки.'};
}

export const directionNames=['Маркетинг','Продажі','Організація роботи','Аналітика'];
export const directionFallback='Уточніть, які з чотирьох процесів цього напряму є у вашому бізнесі. Для одного з них зберіть приклад із останнього активного періоду: що відбулося, які дії виконали та який отримали результат.';
const directionWhy=[
 'Потік звернень задає можливості для продажів. Щоб обрати наступну дію, важливо розуміти, звідки приходять клієнти, як змінюється попит і чи вистачить бізнесу ресурсів виконати нові замовлення.',
 'Більше звернень не завжди означає більше оплат. Розбір реальних діалогів допоможе побачити, на якому кроці покупцю бракує інформації, відповіді чи узгодженого продовження.',
 'Зростання додає задач. Зрозумілі домовленості, відповідальність і порядок виконання допомагають перевірити, чи зможе бізнес витримати більше замовлень без постійного втручання власника.',
 'Виручка, прибуток і гроші на рахунку відповідають на різні питання. Їх варто розглядати разом, перш ніж збільшувати витрати, наймати людей або масштабувати продажі.'
];
const directionMetrics=[
 'За однакові періоди порівнюйте кількість звернень, їхні джерела, відомі витрати на залучення та кількість оплат. Окремо відзначайте сезонність і зміни пропозиції.',
 'Зафіксуйте кількість звернень, оплат і незавершених діалогів. Порівнюйте частку звернень, що завершилися оплатою, для одного каналу та однакового періоду.',
 'Відстежуйте виконання домовленостей у строк, повторні виправлення й час власника на поточні задачі. Почніть з одного процесу, щоб зміни можна було оцінити.',
 'Зведіть виручку, прямі та постійні витрати за завершений період. Окремо перевірте майбутні платежі й залишок грошей; позначте суми, які ще треба уточнити.'
];
function directionReport(p:Profile,ss:ReturnType<typeof scores>,priorities:number[]){
 return directionNames.map((name,group)=>{
  const known=Array.from({length:4},(_,i)=>({q:3+group*4+i,answer:p.answers[3+group*4+i]})).filter((x):x is {q:number;answer:number}=>x.answer!==null&&x.answer<4).sort((a,b)=>b.answer-a.answer||a.q-b.q);
  const enough=ss[group].score!==null;
  const focus=known.slice(0,2);
  const steps=focus.map(({q,answer})=>{const a=solo(p)&&group===2?soloAdvice[q-11]:advice[q-3];return {q,title:a[0],action:a[1],collect:a[2],discussion:a[3],basis:question(q,p).options[answer],question:question(q,p).title};});
  const status=!enough?'Спершу уточнити дані':priorities.includes(group)?'Перший пріоритет':ss[group].score!>=70?'Підтримати сильну сторону':'Наступний напрям уваги';
  return {group,name,score:ss[group].score,status,enough,title:!enough?'Зберіть основу для висновку':steps[0].title,teaser:!enough?'У цьому напрямі поки замало відповідей для оцінки. Почніть з уточнення процесів, які застосовні до вашого бізнесу.':steps[0].action,why:directionWhy[group],steps,metric:directionMetrics[group],discussion:steps[0]?.discussion??'Які процеси в цьому напрямі застосовні до вашого бізнесу та яких даних бракує для їх оцінки?'};
 });
}

export function result(p:Profile){const ss=scores(p),priorities=priority(p,ss),g=priorities[0]??0,insufficient=priorities.length===0;const high=!insufficient&&ss[g].score!>=70;
 const items=p.answers.map((answer,q)=>({answer,q})).filter((x):x is {answer:number;q:number}=>x.q>=3&&x.q<=18&&x.answer!==null&&x.answer<4);
 const evidence=items.filter(x=>Math.floor((x.q-3)/4)===g).sort((a,b)=>b.answer-a.answer).slice(0,2).map(x=>({q:x.q,question:question(x.q,p).title,answer:question(x.q,p).options[x.answer]}));
 const weak=items.filter(x=>x.answer>=2).sort((a,b)=>Number(Math.floor((b.q-3)/4)===g)-Number(Math.floor((a.q-3)/4)===g)||b.answer-a.answer||a.q-b.q);
 const candidate=weak.length?weak:[...items].sort((a,b)=>Number(Math.floor((b.q-3)/4)===g)-Number(Math.floor((a.q-3)/4)===g)||b.answer-a.answer||a.q-b.q);
 const picked=candidate.slice(0,3);const recommendations:Recommendation[]=picked.map(({q,answer})=>{const a=solo(p)&&q>=11&&q<=14?soloAdvice[q-11]:advice[q-3];return {q,title:high?'Перевірка стійкості: '+a[0].charAt(0).toLowerCase()+a[0].slice(1):a[0],teaser:a[1],check:a[1],collect:a[2],discussion:a[3],basis:question(q,p).options[answer]};});
 if(recommendations.length<3){const used=new Set(recommendations.map(r=>r.q));for(const x of [...items].sort((a,b)=>Number(Math.floor((b.q-3)/4)===g)-Number(Math.floor((a.q-3)/4)===g)||b.answer-a.answer||a.q-b.q)){if(recommendations.length===3)break;if(used.has(x.q))continue;const a=solo(p)&&x.q>=11&&x.q<=14?soloAdvice[x.q-11]:advice[x.q-3];recommendations.push({q:x.q,title:a[0],teaser:a[1],check:a[1],collect:a[2],discussion:a[3],basis:question(x.q,p).options[x.answer]});}}
 if(recommendations.length<3){const missing=p.answers.map((a,q)=>({a,q})).filter(x=>x.q>=3&&x.q<=18&&x.a===4);for(const {q} of missing){if(recommendations.length===3)break;recommendations.push({q,title:'Зберіть дані: '+names(p)[Math.floor((q-3)/4)].toLowerCase(),teaser:'Уточніть ситуацію, яку поки не вдалося оцінити.',basis:'Ви обрали «Не можу оцінити / не застосовується».',check:'Поверніться до питання: '+question(q,p).title,collect:'Уточніть, чи застосовується процес до вашого формату. Якщо так — зафіксуйте кілька реальних прикладів.',discussion:'Чи варто оцінювати цей процес у вашому бізнесі та яких даних для цього бракує?'});}}
 const strong=items.find(x=>x.answer===0&&Math.floor((x.q-3)/4)!==g)??items.find(x=>x.answer===0);
 const strongSide=strong?{question:question(strong.q,p).title,answer:question(strong.q,p).options[0]}:null;
 const conflict=p.answers[16]===0&&p.answers[15]!==null&&p.answers[15]!>=2&&p.answers[15]!<4?'Ви рахуєте результат окремих пропозицій, але загальний прибуток оцінюєте інакше. На розборі варто уточнити, як ці розрахунки пов’язані між собою.':null;
 const conclusion=insight(p,g,evidence[0]?.q??3);
 const directions=directionReport(p,ss,priorities);
 const deepDive=[
 {title:'Чому почати саме звідси',text:insufficient?'Відповідей поки недостатньо для порівняння напрямів. Позначте процеси, які справді є у вашому бізнесі, та зберіть приклади їхньої роботи. Після цього можна буде обрати першу зміну.':high?'В оцінених напрямах ви відзначили налагоджені процеси. Перед розширенням перевірте, чи збережуться якість, строки й економіка за більшого навантаження. Сильні відповіді варто підтвердити прикладами з останнього робочого періоду.':`Найнижча з доступних оцінок — у напрямі «${directionNames[g]}»: ${ss[g].score} зі 100. Це підстава почати перевірку тут, а не доказ єдиної причини недоотриманого прибутку. ${directions[g].why}`},
 {title:'Як пов’язані чотири напрями',text:'Маркетинг приводить потенційних клієнтів, продажі допомагають довести звернення до оплати, організація роботи — виконати обіцяне, а аналітика — оцінити економічний результат. Зміни в одному напрямі варто перевіряти разом з іншими: чи вистачить часу та людей на новий попит і чи залишатиметься більше прибутку.'},
 {title:'Послідовність перших дій',text:insufficient?'Почніть із даних, яких бракує. Далі оберіть один процес, опишіть його поточний стан і підготуйте конкретний приклад для бізнес-розбору. Не потрібно змінювати всі напрями одночасно.':`Ваші цілі: ${selected(p,2).map(i=>goals[i].toLowerCase()).join('; ')}. Для першого кроку перевірте напрям «${directionNames[g]}» на реальних прикладах. Зафіксуйте поточний показник, оберіть одну зміну й період перевірки. На розборі уточніть, чи відповідає ця послідовність вашим ресурсам і ситуації всередині бізнесу.`}
 ];
 return {scores:ss,priorities,high,insufficient,evidence,strongSide,conflict,recommendations,directions,deepDive,firstStep:insufficient?'Спершу уточніть, які процеси застосовні до вашого бізнесу.':high?'Наступний крок — перевірити готовність процесів до вашої наступної цілі.':conclusion.firstStep,title:insufficient?'Почніть із даних, які допоможуть побачити вашу ситуацію':high?'За вашими відповідями, в оцінених напрямах є налагоджені процеси':conclusion.title,explanation:insufficient?'У жодному напрямі поки недостатньо оцінених відповідей. Це не низький результат: спершу потрібно уточнити, які процеси застосовні до вашого бізнесу.':high?'Наступне питання — наскільки ці процеси стійкі за більшого навантаження. Оберіть напрям перевірки відповідно до своєї цілі й підтвердьте оцінку реальними прикладами.':conclusion.explanation,goal:selected(p,2).map(i=>goals[i]).join(' · '),impact:selected(p,19).map(i=>impactOptions(p)[i]).join(' · '),sector:sectorName(p)};
}
export function normalizePhone(value:string){let s=value.replace(/[\s().-]/g,'');if(/^0\d{9}$/.test(s))s='+38'+s;if(/^380\d{9}$/.test(s))s='+'+s;return /^\+[1-9]\d{9,14}$/.test(s)&&!/^\+(\d)\1+$/.test(s)?s:null}
