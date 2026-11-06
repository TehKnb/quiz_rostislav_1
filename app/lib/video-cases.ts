import { typesOwnNiche, type Profile } from './engine';
export type VideoCase={title:string;url:string};
// niche: the set has at least three videos from this sector, which is what lets the heading promise «у вашій сфері».
export type CaseSet={main:VideoCase[];extra:VideoCase[];niche?:boolean};
const shevchuk={title:'Шевчук Людмила — посуд та декор',url:'https://www.youtube.com/watch?v=kQDfhxxUyLQ'};
const kuzma={title:'Юлія Кузьма — ресторан — друге відео',url:'https://youtu.be/1DQ3ZLjThlA?si=XM94VUyktqzZOwUJ'};
const zhuk={title:'Жук Анатолій — техніка Apple',url:'https://youtu.be/iI1UcYcwaaY?si=zlUtMVb70xdD8928'};
const olha={title:'Ольга - нарощування волосся',url:'https://www.youtube.com/watch?v=LodbRxitFmo'};
const driving={title:'Юлія Возняк і Предун Діана — автошкола',url:'https://youtu.be/_uvm6ueqwvw?si=eCljT3M0fRV-oSEO'};
const orynyak={title:'Ориняк Назар - виробництво меблів',url:'https://www.youtube.com/watch?v=M_71STrDdF8'};
const transfer={title:'Михайло і Олена Федьків — індивідуальний трансфер Україна-Європа',url:'https://youtu.be/rVZg9yyRRa8?si=jWm0K36Ey42aUAvT'};
const topCases=[shevchuk,kuzma,zhuk,olha,driving,orynyak,{title:'Корнієнко Сергій — виробництво навісів для авто',url:'https://www.youtube.com/watch?v=5feU_Ihh2iA'},{title:'Альона Киричок — скління будинків',url:'https://youtu.be/Rd6WZAGLyOA?si=o0zZVLmA35YUrgDI'}];
// The quiz has no «Послуги» sector yet, so this list is not shown to visitors.
export const serviceCases:VideoCase[]=[transfer,driving,{title:'Ірина Чернега — дитячий садочок повного та неповного дня від 2х років',url:'https://www.youtube.com/watch?v=nGAjoIFoLcU'},{title:'Володимир Остриков і Гонтарь Денис — тренування з бігу та триатлону для аматорів',url:'https://www.youtube.com/watch?v=YPq8irRh5so'},{title:'Христина Тишик і Григорук Анна — оформлення та переклад особистих документів',url:'https://www.youtube.com/watch?v=3XuaM3JgzWw'},{title:'Анастасія Бідіна — розмовна англійська з нуля',url:'https://www.youtube.com/watch?v=TgAk4OSsdrQ'}];
// Same order as `sectors` in engine.ts.
export const casesBySector:CaseSet[]=[
 // Medicine has no case of its own, so it shows the same set as «Інша сфера».
 {main:[],extra:topCases},
 {main:[{title:'Валерій і Світлана Алексюк — мережа косметологічних центрів',url:'https://youtu.be/SNDHeEBg-IE?si=8BfiCLy14Jy4gGva'}],extra:[shevchuk,kuzma,zhuk,olha,driving]},
 {main:[],extra:[shevchuk,kuzma,zhuk,olha,driving,orynyak]},
 {niche:true,main:[],extra:[shevchuk,{title:'Тетяна Ількевич — опалювальне обладнання (опт)',url:'https://youtu.be/B7iIhFBBv8Y?si=pvsnjFROAhJfFxA2'},{title:'Сергій Курищук — техніка Apple',url:'https://youtu.be/4nreVSZPdwU?si=RcSyoUA-VOJBJYZ4'},zhuk,{title:'Ольга Старощук — волосся для нарощування',url:'https://www.youtube.com/watch?v=LodbRxitFmo&feature=youtu.be'},{title:'Павлюк Тетяна — штори та килими',url:'https://youtu.be/rHjy23KCImc'}]},
 {niche:true,main:[],extra:[driving,{title:'Степан Клюс — Авто з США',url:'https://youtu.be/oAumCOHqVY0?si=kx3DmNlWhw8hG4Gu'},transfer,{title:'Влад і Олег — Авто з США відновлення під ключ',url:'https://youtu.be/iD18JQBDwvw?si=zxHhI9MGN8N0QvxQ'},{title:'Корнієнко Сергій — виробництво навісів для авто',url:'https://www.youtube.com/watch?v=5feU_Ihh2iA'},{title:'Руслан Оданець — авторазборка Мерседес',url:'https://youtu.be/ncC8GhpL0oU?si=CN-Guyxar82tDqXA'}]},
 // Kuzma is listed both as a main and an additional case in the brief; the same video is shown once.
 {niche:true,main:[kuzma,{title:'Віта Новак — кондитерське виробництво, кавʼярні (2)',url:'https://youtu.be/IPVMvuZ8j58?si=_A1IpdC1UaBjGtjH'},{title:'Павло Боднар — доставка їжі з мангалу',url:'https://www.youtube.com/watch?v=Dea8DTnJLI4&t=50s'}],extra:[shevchuk,zhuk]},
 {niche:true,main:[{title:'Герасимов — ремонт квартир під ключ',url:'https://youtu.be/vJqqrRKXlGw?si=DeeLDUe69cmVJZhs'},{title:'Альона Киричок — скління будинків',url:'https://youtu.be/Rd6WZAGLyOA?si=o0zZVLmA35YUrgDI'},{title:'Василь Погорєлов — виробництво сходів під ключ',url:'https://youtu.be/FSwBuPExujw'}],extra:[shevchuk,kuzma,zhuk]},
 {niche:true,main:[],extra:[{title:'Базюки — виробництво заручальних обручок',url:'https://youtu.be/d31VaSipWzk?si=6EZtd0MPZjOz_n24'},{title:'Олексій і Юлія Шатравко — домашні копченості',url:'https://youtu.be/mDatuYM2Jp4?si=TnWImVZNOd23cieQ'},{title:'Галина Мороз і Масляк Богдан — тактичне спорядження від виробника',url:'https://youtu.be/IkpctT2peZk?si=JcdKdIXh52rlZxSq'},{title:'Юлія Онищенко — Корпоративні та персоналізовані подарунки з гравіюванням під ключ',url:'https://youtu.be/pdTjjz72ZUI?si=cjL9avqdI4BSxgdU'},orynyak,{title:'Корнієнко Сергій — виробництво навісів для авто',url:'https://youtu.be/5feU_Ihh2iA'}]},
 {main:[],extra:topCases},
];
export const casesFor=(p:Profile)=>casesBySector[p.answers[0]??8];
export const hasNicheCases=(p:Profile)=>!typesOwnNiche(p)&&!!casesFor(p).niche;
export function youtubeId(url:string){const u=new URL(url);return u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')??''}
export function youtubeEmbed(url:string){const start=parseInt(new URL(url).searchParams.get('t')??'',10);return `https://www.youtube-nocookie.com/embed/${youtubeId(url)}?autoplay=1&rel=0${start?`&start=${start}`:''}`}
export const youtubeThumb=(url:string)=>`https://i.ytimg.com/vi/${youtubeId(url)}/maxresdefault.jpg`;
