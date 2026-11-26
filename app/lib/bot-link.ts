// The Telegram bot opens the quiz with ?tg=<Telegram ID>&sig=<signature>. Both are kept as they came for the visit
// and sent with the lead, so the server can tell the bot this person left a number. The bot checks sig; the site does not.
export type BotLink={tg:string;sig:string};
const storageKey='knb-tg';
// Values are never trimmed or changed; anything that does not look like an id and a signature is ignored.
export function readBotLink(v:unknown):BotLink|null{
 const src=(v&&typeof v==='object'?v:{}) as Record<string,unknown>,tg=src.tg,sig=src.sig;
 return typeof tg==='string'&&typeof sig==='string'&&/^\d{1,20}$/.test(tg)&&/^[\w-]{1,128}$/.test(sig)?{tg,sig}:null;
}
// Browser only. A link with both parameters replaces what was saved; a page opened without them keeps it.
export function captureBotLink(){
 try{
  const params=new URLSearchParams(window.location.search),link=readBotLink({tg:params.get('tg'),sig:params.get('sig')});
  if(link)sessionStorage.setItem(storageKey,JSON.stringify(link));
 }catch{}
}
export function storedBotLink():BotLink|null{
 try{return readBotLink(JSON.parse(sessionStorage.getItem(storageKey)||'null'))}catch{return null}
}
