'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, X } from 'lucide-react';
import { Slider } from './slider';
import { reviews, type Review } from './lib/reviews';
export function Reviews(){
 const [open,setOpen]=useState<Review|null>(null);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null)};window.addEventListener('keydown',close);return ()=>window.removeEventListener('keydown',close)},[open]);
 // Laid out like the Facebook recommendation it was taken from.
 const author=(r:Review)=><span className="rp-review-author"><Image src={`/reviews/${r.photo}.jpg`} alt="" width={80} height={80} unoptimized/><span><span className="rp-review-line"><b>{r.name}</b> <i aria-hidden="true"><Star size={10} strokeWidth={0}/></i> рекомендує <b>Бізнес-клуб підприємців Конс на Бі$</b>.</span><small>{r.date}</small></span></span>;
 return <section className="rp-reviews" aria-labelledby="reviews-title">
  <h2 id="reviews-title">Що підприємці говорять про навчання</h2>
  {/* Slides stretch to the tallest review, so every card has the same height. */}
  <Slider className="rp-review-slider" label="Відгуки" slides={reviews.map(r=>({key:r.photo,node:<button type="button" className="rp-review" aria-label={`Відгук: ${r.name}. Відкрити у вікні`} onClick={()=>setOpen(r)}>
   {author(r)}<span className="rp-review-text">{r.text}</span>
  </button>}))}/>
  {open&&<div className="modal-backdrop" onClick={()=>setOpen(null)}><section className="modal rp-review-modal" role="dialog" aria-modal="true" aria-label={`Відгук: ${open.name}`} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" aria-label="Закрити" onClick={()=>setOpen(null)}><X/></button>{author(open)}<p>{open.text}</p></section></div>}
 </section>
}
