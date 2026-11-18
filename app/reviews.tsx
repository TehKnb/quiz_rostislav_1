'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import { Slider } from './slider';
import { reviews, type Review } from './lib/reviews';
export function Reviews(){
 const [open,setOpen]=useState<Review|null>(null);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null)};window.addEventListener('keydown',close);return ()=>window.removeEventListener('keydown',close)},[open]);
 const author=(r:Review)=><div className="rp-review-author"><Image src={`/reviews/${r.photo}.jpg`} alt="" width={56} height={56} unoptimized/><b>{r.name}</b></div>;
 return <section className="rp-reviews" aria-labelledby="reviews-title">
  <h2 id="reviews-title">Що підприємці говорять про навчання</h2>
  <Slider className="rp-review-slider" label="Відгуки" slides={reviews.map(r=>({key:r.photo,node:<article className="rp-review">
   <span className="rp-review-mark" aria-hidden="true">“</span><p>{r.text}</p>{author(r)}
   {r.full?<button type="button" className="rp-review-more" onClick={()=>setOpen(r)}>Читати відгук повністю<ArrowUpRight size={15}/></button>:<span className="rp-review-more" aria-hidden="true"/>}
  </article>}))}/>
  {open&&<div className="modal-backdrop" onClick={()=>setOpen(null)}><section className="modal rp-review-modal" role="dialog" aria-modal="true" aria-label={`Відгук: ${open.name}`} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" aria-label="Закрити" onClick={()=>setOpen(null)}><X/></button>{author(open)}<p>{open.full}</p></section></div>}
 </section>
}
