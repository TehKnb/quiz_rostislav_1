// Meta Pixel. The base code in layout.tsx sends PageView on load; Lead is sent here once the lead is accepted.
type Fbq=(...args:unknown[])=>void;
// Only digits are accepted, because the id is written into an inline script.
export const pixelId=(value:string|undefined)=>value&&/^\d{5,20}$/.test(value.trim())?value.trim():'';
export const pixelScript=(id:string)=>`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`;
// eventID is the lead id, so a server-side Lead with the same id would be counted once.
export function trackLead(leadId:string){
 try{(window as unknown as {fbq?:Fbq}).fbq?.('track','Lead',{},{eventID:leadId})}catch{}
}
