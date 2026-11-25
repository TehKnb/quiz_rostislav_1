// Meta Pixel. The base code in layout.tsx sends PageView on load; QuizStart, Question1–Question21 and Lead are sent from here.
type Fbq=(...args:unknown[])=>void;
// Only digits are accepted, because the id is written into an inline script.
export const pixelId=(value:string|undefined)=>value&&/^\d{5,20}$/.test(value.trim())?value.trim():'';
export const pixelScript=(id:string)=>`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('set','autoConfig',false,'${id}');fbq('init','${id}');fbq('track','PageView');`;
// autoConfig is off, so the pixel no longer sends its own SubscribedButtonClick on every button click.
const fbq:Fbq=(...args)=>{try{(window as unknown as {fbq?:Fbq}).fbq?.(...args)}catch{}};
// QuestionN: once per page load for each question, when an answer moves the quiz on from it.
const answered=new Set<number>();
export function trackQuestion(n:number){
 if(answered.has(n))return;
 answered.add(n);fbq('trackCustom',`Question${n}`);
}
// Once per page load, on the «Почати тест» button.
let quizStarted=false;
export function trackQuizStart(){
 if(quizStarted)return;
 quizStarted=true;fbq('trackCustom','QuizStart');
}
// eventID is the lead id, so a server-side Lead with the same id would be counted once.
export function trackLead(leadId:string){
 fbq('track','Lead',{},{eventID:leadId});
}
