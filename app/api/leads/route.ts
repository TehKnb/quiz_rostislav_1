import { withAi } from '../../lib/ai-generate';
import { normalizePhone, validateProfile } from '../../lib/engine';
import { buildLeadPayload } from '../../lib/lead-payload';
import { sameOrigin } from '../../lib/same-origin';
const WEBHOOK_TIMEOUT_MS=15000;
const unavailable=()=>Response.json({error:'Не вдалося надіслати заявку. Спробуйте ще раз — ваші відповіді залишилися на сторінці.'},{status:503});
export async function POST(req:Request){
 try{
  const origin=req.headers.get('origin');if(origin&&!sameOrigin(req,origin))return Response.json({error:'Недозволене джерело запиту.'},{status:403});
  const text=await req.text();if(text.length>16000)return Response.json({error:'Запит завеликий.'},{status:413});
  let body;try{body=JSON.parse(text)}catch{return Response.json({error:'Не вдалося прочитати заявку.'},{status:400})}
  const phone=typeof body?.phone==='string'?normalizePhone(body.phone):null;
  if(!phone||!validateProfile(body.profile))return Response.json({error:'Перевірте номер та відповіді на всі 20 запитань.'},{status:400});
  const id=typeof body.id==='string'&&/^[0-9a-f-]{36}$/.test(body.id)?body.id:crypto.randomUUID();
  const webhookUrl=process.env.BUSINESS_REVIEW_WEBHOOK_URL;
  if(!webhookUrl){console.error('BUSINESS_REVIEW_WEBHOOK_URL is not configured');return unavailable()}
  // Generated before the webhook because Ai Text must carry what the visitor sees.
  const report=await withAi(body.profile);
  // Redirects are not followed: a POST redirected to GET would look successful while the lead is lost.
  const res=await fetch(webhookUrl,{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8','Idempotency-Key':id},body:JSON.stringify(buildLeadPayload(phone,body.profile,report)),redirect:'manual',signal:AbortSignal.timeout(WEBHOOK_TIMEOUT_MS)});
  await res.body?.cancel();
  if(!res.ok){console.error(`Lead webhook responded with HTTP ${res.status}`);return unavailable()}
  return Response.json({id,report},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Lead webhook request failed:',e instanceof Error?e.name:'unknown error');return unavailable()}
}
