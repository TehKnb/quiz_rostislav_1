import { applyAi, buildConclusionRequest, buildDirectionRequest, parseConclusion, parseDirection, type FullReport } from './ai-report';
import { result, solo, type Profile } from './engine';
const OPENAI_TIMEOUT_MS=25000;
async function complete<T>(apiKey:string,body:unknown,parse:(content:unknown)=>T|null):Promise<T|null>{
 try{
  const signal=AbortSignal.timeout(OPENAI_TIMEOUT_MS);
  // One more try only for text that failed validation: the shared signal keeps the total within the timeout.
  for(let attempt=0;attempt<2;attempt++){
   const res=await fetch(`${process.env.OPENAI_BASE_URL||'https://api.openai.com/v1'}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`},body:JSON.stringify(body),signal});
   if(!res.ok){await res.body?.cancel();console.error(`OpenAI responded with HTTP ${res.status}`);return null}
   const data=await res.json() as {choices?:{message?:{content?:unknown}}[]};
   const parsed=parse(data.choices?.[0]?.message?.content);
   if(parsed)return parsed;
   console.error('OpenAI report section did not pass validation');
  }
  return null;
 }catch(e){console.error('OpenAI request failed:',e instanceof Error?e.name:'unknown error');return null}
}
// A section that fails keeps its prepared text, so a lead is never lost because of the model.
export async function withAi(p:Profile):Promise<FullReport>{
 const r=result(p),apiKey=process.env.OPENAI_API_KEY,alone=solo(p);
 if(!apiKey){console.error('OPENAI_API_KEY is not configured');return r}
 const model=process.env.OPENAI_MODEL||'gpt-4o-mini';
 // Sections run in parallel because one long completion would keep the visitor waiting for too long.
 const [conclusion,...directions]=await Promise.all([
  r.insufficient?Promise.resolve(null):complete(apiKey,buildConclusionRequest(model,p,r),content=>parseConclusion(content,alone)),
  ...r.directions.map(d=>d.enough?complete(apiKey,buildDirectionRequest(model,p,r,d.group),content=>parseDirection(content,alone)):Promise.resolve(null))
 ]);
 return applyAi(r,{conclusion:conclusion as ReturnType<typeof parseConclusion>,directions:directions as ReturnType<typeof parseDirection>[]});
}
