// Behind a TLS-terminating proxy the server sees http://, so only the hosts are compared.
// The public address of the site, as the visitor opened it; behind Railway the host and scheme come from the proxy headers.
export function siteAddress(req:Request){
 try{
  const url=new URL(req.url),host=(req.headers.get('x-forwarded-host')?.split(',')[0]||req.headers.get('host')||url.host).trim().toLowerCase();
  const proto=req.headers.get('x-forwarded-proto')?.split(',')[0].trim()||url.protocol.replace(':','');
  return /^[a-z0-9.-]+(:\d{1,5})?$/.test(host)&&/^https?$/.test(proto)?`${proto}://${host}`:'';
 }catch{return ''}
}
export function sameOrigin(req:Request,origin:string|null){
 if(!origin)return false;
 try{return [req.headers.get('x-forwarded-host')?.split(',')[0].trim(),req.headers.get('host')].some(host=>host?.toLowerCase()===new URL(origin).host)}catch{return false}
}
