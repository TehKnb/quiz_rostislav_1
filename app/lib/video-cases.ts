import { typesOwnNiche, type Profile } from './engine';
// Videos are hosted on Bunny Stream. thumb is the file name of the designed preview, as Bunny serves it; it changes when a new preview is uploaded.
export type VideoCase={title:string;video:string;thumb:string};
// niche: the set has at least three videos from this sector, which is what lets the heading promise «у вашій сфері».
export type CaseSet={main:VideoCase[];extra:VideoCase[];niche?:boolean};
const library='684628',cdn='https://vz-fc71976a-1a7.b-cdn.net';
const v=(title:string,video:string,thumb:string):VideoCase=>({title,video,thumb});
const driving=v('Юлія Возняк і Предун Діана — автошкола','7ae7ed0c-68ca-4036-9268-2c727c4070c0','thumbnail_9ff25605.jpg');
const klius=v('Степан Клюс — Авто з США','6b606f3b-da86-4bf3-90e5-fc159f559924','thumbnail_5be3187d.jpg');
const transfer=v('Михайло і Олена Федьків — індивідуальний трансфер Україна-Європа','082d4227-8c4c-496c-99c4-3c805521947b','thumbnail_85ba430a.jpg');
const riabovol=v('Владислав Рябовол і Матвійчук Олег — Авто з США відновлення під ключ','651550c4-d06c-4b59-9c1f-ca8560de40ee','thumbnail_136c8d8b.jpg');
const kornienko=v('Корнієнко Сергій — виробництво навісів для авто','cb252eeb-f212-4e7b-9fd6-41c25624b538','thumbnail_52f9c47c.jpg');
const odanets=v('Руслан Оданець — авторазборка Мерседес','0eb79dff-2486-4328-967f-4de65cb6e48b','thumbnail_bb32b839.jpg');
const gerasymov=v('Герасимов — ремонт квартир під ключ','acccf1ce-0ce5-4dda-a661-bc29f9549088','thumbnail_a7879cda.jpg');
const kyrychok=v('Альона Киричок — скління будинків','8ac9a8e0-ff6b-4d8a-80c5-db462b72503d','thumbnail_faf5a394.jpg');
const pogorelov=v('Василь Погорєлов — виробництво сходів під ключ','c483a7c0-6248-415c-aa16-416dfc1bfe80','thumbnail_e00c3cb0.jpg');
const shevchuk=v('Шевчук Людмила — посуд та декор','86cb5f69-21b5-4463-b002-647d9b847584','thumbnail_82880c5a.jpg');
const kuzma=v('Юлія Кузьма — ресторан','c65348c9-1680-478a-a6a0-3eb81ec3d73f','thumbnail_9ba7a043.jpg');
const zhuk=v('Жук Анатолій — техніка Apple','7da29ae3-d6bc-4066-8666-5edc24ef03d5','thumbnail_abc49564.jpg');
const baziuky=v('Базюки — виробництво заручальних обручок','4ab89f52-3fa8-41b4-8507-2ad86fc3a2a9','thumbnail_e9a854fc.jpg');
const shatravko=v('Олексій і Юлія Шатравко — домашні копченості','b112a9cc-4fe9-4fb2-ba9a-5881cb249213','thumbnail_f9b73e8b.jpg');
const moroz=v('Галина Мороз і Масляк Богдан — тактичне спорядження від виробника','9339f6f3-7b0c-4dfb-8c52-30ec93867923','thumbnail_bdc71c4d.jpg');
const onyshchenko=v('Юлія Онищенко — корпоративні та персоналізовані подарунки з гравіюванням під ключ','bd1b5d95-9aba-41b0-a8c3-b195a6b1a793','thumbnail_236db980.jpg');
const orynyak=v('Ориняк Назар — виробництво меблів','0a89c565-a234-4e86-b8cc-8ae5b5555bc0','thumbnail_bf165d7a.jpg');
const ilkevych=v('Тетяна Ількевич — опалювальне обладнання (опт)','9e4f4895-0985-4183-afa0-7d49c394eabe','thumbnail_dc38b916.jpg');
const kuryshchuk=v('Сергій Курищук — техніка Apple','54dae08e-418e-4416-82a0-7a023eaba034','thumbnail_306cf563.jpg');
const olha=v('Ольга Старощук — волосся для нарощування','c5dfd97c-04a7-4a7f-9a07-4a6021e64da6','thumbnail_41199a4a.jpg');
const pavliuk=v('Павлюк Тетяна — штори та килими','5c12d58c-c0dc-4bc7-b374-6504eaf25f99','thumbnail_c304a7f8.jpg');
const chernega=v('Ірина Чернега — дитячий садочок повного та неповного дня від 2х років','1c043052-ac5c-4417-a017-1043039f13ec','thumbnail_9b2fbbd6.jpg');
const ostrykov=v('Володимир Остриков і Гонтарь Денис — тренування з бігу та триатлону для аматорів','64b776c9-4f16-4744-8ddd-b9af14c85276','thumbnail_5b89197f.jpg');
const tyshyk=v('Христина Тишик і Григорук Анна — оформлення та переклад особистих документів','8f9f6b81-0213-42a3-8b72-d5d4c503876c','thumbnail_c9e6b4d1.jpg');
const bidina=v('Анастасія Бідіна — розмовна англійська з нуля','76d204e2-306f-488e-acbf-bd496b9992ce','thumbnail_68b09ed8.jpg');
const novak=v('Віта Новак — кондитерське виробництво, кавʼярні','bd8a6461-918d-4e1c-8268-98bbcdf9fd6b','thumbnail_b9f3e200.jpg');
const bodnar=v('Павло Боднар — доставка їжі з мангалу','a1b293cd-e0dd-46d4-a1bb-2573cbc4b2a6','thumbnail_113eee46.jpg');
const aleksiuk=v('Валерій і Світлана Алексюк — мережа косметологічних центрів','e1f64876-fc51-4712-a64f-ea7f32b0b3af','thumbnail_72efbff8.jpg');
const barabash=v('Барабаш Анна — івент-агенція','4d4002e8-d043-4045-89d5-1c97dfa62245','thumbnail.jpg');
const kalaidzhy=v('Калайджи — міжкімнатні двері під ключ','ffd1788c-64a1-4a2d-87ed-ad2cd8d9a041','thumbnail.jpg');
const yanchuk=v('Янчук — будівництво','6fdfe988-4441-4192-8810-496a8abfd7d5','thumbnail.jpg');
const topCases=[shevchuk,kuzma,zhuk,olha,driving,orynyak,kornienko,kyrychok,barabash,kalaidzhy,yanchuk];
// The quiz has no «Послуги» sector yet, so this list is not shown to visitors.
export const serviceCases:VideoCase[]=[transfer,driving,chernega,ostrykov,tyshyk,bidina];
// Same order as `sectors` in engine.ts.
export const casesBySector:CaseSet[]=[
 // Medicine has no case of its own, so it shows the same set as «Інша сфера».
 {main:[],extra:topCases},
 {main:[aleksiuk],extra:[shevchuk,kuzma,zhuk,olha,driving]},
 {main:[],extra:[shevchuk,kuzma,zhuk,olha,driving,orynyak]},
 {niche:true,main:[],extra:[shevchuk,ilkevych,kuryshchuk,zhuk,olha,pavliuk]},
 {niche:true,main:[],extra:[driving,klius,transfer,riabovol,kornienko,odanets]},
 {niche:true,main:[kuzma,novak,bodnar],extra:[shevchuk,olha,zhuk]},
 {niche:true,main:[gerasymov,kyrychok,pogorelov],extra:[shevchuk,kuzma,zhuk]},
 {niche:true,main:[],extra:[baziuky,shatravko,moroz,onyshchenko,orynyak,kornienko]},
 {main:[],extra:topCases},
];
export const casesFor=(p:Profile)=>casesBySector[p.answers[0]??8];
export const hasNicheCases=(p:Profile)=>!typesOwnNiche(p)&&!!casesFor(p).niche;
export const bunnyEmbed=(c:VideoCase)=>`https://iframe.mediadelivery.net/embed/${library}/${c.video}?autoplay=true&responsive=true`;
export const bunnyThumb=(c:VideoCase)=>`${cdn}/${c.video}/${c.thumb}`;
