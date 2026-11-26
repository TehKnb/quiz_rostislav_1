import type { BotLink } from './bot-link';
// Server only. Tells the Telegram bot that the person it sent here has left a number.
const BOT_LEAD_URL='https://primary-production-4180.up.railway.app/webhook/kb-quiz-lead';
const TIMEOUT_MS=10000;
// Never throws: the lead is already accepted, so a failure here is only logged, without the phone or name.
// 400 «bad signature» is expected for a hand-made link such as ?tg=123&sig=test.
export async function notifyBot(link:BotLink,phone:string,name:string){
 try{
  const res=await fetch(BOT_LEAD_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tg:link.tg,sig:link.sig,phone,name}),signal:AbortSignal.timeout(TIMEOUT_MS)});
  const data=await res.json().catch(()=>null) as {ok?:boolean;error?:string}|null;
  if(res.ok&&data?.ok)console.info('kb-quiz-lead: ok');
  else console.warn(`kb-quiz-lead: HTTP ${res.status}${data?.error?` (${String(data.error).slice(0,60)})`:''}`);
 }catch(e){console.warn('kb-quiz-lead request failed:',e instanceof Error?e.name:'unknown error')}
}
