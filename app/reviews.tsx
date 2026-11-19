'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, X } from 'lucide-react';
import { Slider } from './slider';
import { reviews, type Review } from './lib/reviews';
// The first reviews set the card height; longer ones are cut and get a button that opens them in full.
const framing=3;
export function Reviews(){
 const [open,setOpen]=useState<Review|null>(null),[clipped,setClipped]=useState<string>('');
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null)};window.addEventListener('keydown',close);return ()=>window.removeEventListener('keydown',close)},[open]);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  // Measure every card at its natural height in one synchronous pass, then fix the height to the tallest framing card.
  const measure=()=>{
   el.classList.add('is-measuring');
   const heights=[...el.querySelectorAll<HTMLElement>('.rp-review')].map(c=>c.offsetHeight);
   el.classList.remove('is-measuring');
   const h=Math.max(...heights.slice(0,framing));
   el.style.setProperty('--rp-review-h',h+'px');
   setClipped(heights.map((x,i)=>x>h+1?i:-1).filter(i=>i>=0).join(','));
  };
  measure();
  const ro=new ResizeObserver(measure);ro.observe(el);
  document.fonts?.ready.then(measure);
  return ()=>ro.disconnect();
 },[]);
 const cut=new Set(clipped.split(',').filter(Boolean).map(Number));
 // Laid out like the Facebook recommendation it was taken from.
 const author=(r:Review)=><span className="rp-review-author"><Image src={`/reviews/${r.photo}.jpg`} alt="" width={80} height={80} unoptimized/><span><span className="rp-review-line"><b>{r.name}</b> <i aria-hidden="true"><Star size={10} strokeWidth={0}/></i> рекомендує <b>Бізнес-клуб підприємців Конс на Бі$</b>.</span><small>{r.date}</small></span></span>;
 return <section className="rp-reviews" aria-labelledby="reviews-title">
  <h2 id="reviews-title">Що підприємці говорять про навчання</h2>
  <div ref={root}><Slider className="rp-review-slider" label="Відгуки" slides={reviews.map((r,i)=>({key:r.photo,node:<article className={'rp-review'+(cut.has(i)?' is-clipped':'')} onClick={()=>setOpen(r)}>
   {author(r)}<span className="rp-review-text">{r.text}</span>
   {cut.has(i)&&<button type="button" className="rp-review-more" aria-label={`Читати відгук повністю: ${r.name}`} onClick={e=>{e.stopPropagation();setOpen(r)}}>Читати відгук повністю</button>}
  </article>}))}/></div>
  {open&&<div className="modal-backdrop" onClick={()=>setOpen(null)}><section className="modal rp-review-modal" role="dialog" aria-modal="true" aria-label={`Відгук: ${open.name}`} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" aria-label="Закрити" onClick={()=>setOpen(null)}><X/></button>{author(open)}<p>{open.text}</p></section></div>}
 </section>
}
