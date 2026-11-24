// UTM tags from the landing URL; utm_source also names the channel in the CRM source.
export const utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const;
export type Utm=Record<(typeof utmKeys)[number],string>;
const storageKey='knb-utm';
const clean=(v:unknown)=>typeof v==='string'?v.trim().slice(0,200):'';
// Accepts anything (a request body, stored JSON) and keeps only the five tags as short strings.
export function readUtm(v:unknown):Utm{
 const src=(v&&typeof v==='object'?v:{}) as Record<string,unknown>;
 return Object.fromEntries(utmKeys.map(k=>[k,clean(src[k])])) as Utm;
}
// Usual channels keep their own spelling; anything else gets a capital first letter (telegram → Telegram).
const channelNames:Record<string,string>={facebook:'Facebook',fb:'Facebook',instagram:'Instagram',ig:'Instagram',telegram:'Telegram',tg:'Telegram',tiktok:'TikTok',youtube:'YouTube',yt:'YouTube',google:'Google',viber:'Viber',linkedin:'LinkedIn',email:'Email'};
export function channelName(u:Utm){
 const raw=u.utm_source.replace(/\s+/g,' ').trim();
 return raw?channelNames[raw.toLowerCase()]??raw[0].toUpperCase()+raw.slice(1):'';
}
// Browser only. Tags are kept for the visit, so a reload or a later submit still knows where the visitor came from.
export function captureUtm(){
 try{
  const params=new URLSearchParams(window.location.search),fromUrl=readUtm(Object.fromEntries(params));
  if(utmKeys.some(k=>fromUrl[k]))sessionStorage.setItem(storageKey,JSON.stringify(fromUrl));
 }catch{}
}
export function storedUtm():Utm{
 try{return readUtm(JSON.parse(sessionStorage.getItem(storageKey)||'{}'))}catch{return readUtm(Object.fromEntries(new URLSearchParams(window.location.search)))}
}
