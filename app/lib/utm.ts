// UTM tags from the landing URL. One tag or none means organic traffic; two or more mean an ad campaign.
export const utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const;
export type Utm=Record<(typeof utmKeys)[number],string>;
const storageKey='knb-utm';
const clean=(v:unknown)=>typeof v==='string'?v.trim().slice(0,200):'';
// Accepts anything (a request body, stored JSON) and keeps only the five tags as short strings.
export function readUtm(v:unknown):Utm{
 const src=(v&&typeof v==='object'?v:{}) as Record<string,unknown>;
 return Object.fromEntries(utmKeys.map(k=>[k,clean(src[k])])) as Utm;
}
export const isPaidTraffic=(u:Utm)=>utmKeys.filter(k=>u[k]).length>1;
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
