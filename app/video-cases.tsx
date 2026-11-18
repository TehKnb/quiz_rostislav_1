'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Slider } from './slider';
import { bunnyEmbed, bunnyThumb, type CaseSet, type VideoCase } from './lib/video-cases';
export function VideoCases({cases,niche}:{cases:CaseSet;niche:boolean}){
 const [playing,setPlaying]=useState<VideoCase|null>(null);
 useEffect(()=>{if(!playing)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setPlaying(null)};window.addEventListener('keydown',close);return ()=>window.removeEventListener('keydown',close)},[playing]);
 return <section className="rp-cases" aria-labelledby="cases-title">
  <div className="rp-showcase-head"><h2 id="cases-title">{niche?<><span>Результати власників бізнесу</span> <mark>у вашій сфері</mark> <small>після нашого 7-тижневого бізнес-навчання</small></>:<><span>Результати підприємців,</span> <small>які пройшли наше</small> <mark>7-тижневе бізнес-навчання</mark></>}</h2><p>Подивіться, які рішення вони впровадили та яких результатів досягли.</p></div>
  {/* The preview already carries the case design, so the card shows it as is. */}
  <Slider className="rp-case-slider" label="Відеокейси" hint="Гортайте кейси" slides={[...cases.main,...cases.extra].map(c=>({key:c.video,node:<button type="button" className="rp-case-card" aria-label={`Дивитися відео: ${c.title}`} onClick={()=>setPlaying(c)}><Image src={bunnyThumb(c)} alt="" width={1280} height={720} unoptimized/></button>}))}/>
  {playing&&<div className="modal-backdrop" onClick={()=>setPlaying(null)}><div className="rp-video-modal" role="dialog" aria-modal="true" aria-label={playing.title} onClick={e=>e.stopPropagation()}><button type="button" className="rp-video-close" aria-label="Закрити" onClick={()=>setPlaying(null)}><X size={22}/></button><iframe src={bunnyEmbed(playing)} title={playing.title} allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/></div></div>}
 </section>
}
