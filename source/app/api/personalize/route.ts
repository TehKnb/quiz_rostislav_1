import { buildCompletionRequest, parseTitles } from '../../lib/custom-questions';
import { sameOrigin } from '../../lib/same-origin';
const OPENAI_TIMEOUT_MS=8000;
const unavailable=()=>Response.json({error:'Не вдалося персоналізувати запитання.'},{status:503});
export async function POST(req:Request){
 try{
  // Each call spends the OpenAI budget, so unlike /api/leads the Origin header is required here.
  if(!sameOrigin(req,req.headers.get('origin')))return Response.json({error:'Недозволене джерело запиту.'},{status:403});
  const text=await req.text();if(text.length>1000)return Response.json({error:'Запит завеликий.'},{status:413});
  let body;try{body=JSON.parse(text)}catch{return Response.json({error:'Не вдалося прочитати запит.'},{status:400})}
  const niche=typeof body?.niche==='string'?body.niche.trim():'';
  if(niche.length<2||niche.length>100||typeof body.solo!=='boolean')return Response.json({error:'Перевірте назву сфери.'},{status:400});
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey){console.error('OPENAI_API_KEY is not configured');return unavailable()}
  const res=await fetch(`${process.env.OPENAI_BASE_URL||'https://api.openai.com/v1'}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`},body:JSON.stringify(buildCompletionRequest(process.env.OPENAI_MODEL||'gpt-4o-mini',niche,body.solo)),signal:AbortSignal.timeout(OPENAI_TIMEOUT_MS)});
  if(!res.ok){await res.body?.cancel();console.error(`OpenAI responded with HTTP ${res.status}`);return unavailable()}
  const data=await res.json() as {choices?:{message?:{content?:unknown}}[]};
  const titles=parseTitles(data.choices?.[0]?.message?.content);
  if(!titles){console.error('OpenAI response did not pass validation');return unavailable()}
  return Response.json({titles},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('OpenAI request failed:',e instanceof Error?e.name:'unknown error');return unavailable()}
}
