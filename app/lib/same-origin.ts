// Behind a TLS-terminating proxy the server sees http://, so only the hosts are compared.
export function sameOrigin(req:Request,origin:string|null){
 if(!origin)return false;
 try{return [req.headers.get('x-forwarded-host')?.split(',')[0].trim(),req.headers.get('host')].some(host=>host?.toLowerCase()===new URL(origin).host)}catch{return false}
}
