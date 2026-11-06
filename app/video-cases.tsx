'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { youtubeEmbed, youtubeThumb, type CaseSet } from './lib/video-cases';
export function VideoCases({cases,niche}:{cases:CaseSet;niche:boolean}){
 const [playing,setPlaying]=useState<string|null>(null);
 const items=[...cases.main,...cases.extra],lead=cases.main.length===1?1:0,unpaired=(items.length-lead)%2===1;
 return <section className="rp-cases" aria-labelledby="cases-title"><h2 id="cases-title">{niche?<>РЕЗУЛЬТАТИ ВЛАСНИКІВ БІЗНЕСУ У ВАШІЙ СФЕРІ<br/>ПІСЛЯ НАШОГО 7-ТИЖНЕВОГО БІЗНЕС-НАВЧАННЯ</>:<>РЕЗУЛЬТАТИ ПІДПРИЄМЦІВ, ЯКІ ПРОЙШЛИ<br/>НАШЕ 7-ТИЖНЕВЕ БІЗНЕС-НАВЧАННЯ</>}</h2><p className="rp-cases-intro">Подивіться, які рішення змінили їхній бізнес: що вони впровадили, як зріс прибуток і що тепер працює без щоденного контролю власника.</p>
  <div className="rp-case-grid">{items.map((c,i)=>{
   // The only video from the sector leads across both columns; so does a last video left without a pair.
   const wide=i<lead||(unpaired&&i===items.length-1);
   return <article key={c.url} className={wide?'rp-case wide':'rp-case'}>
    <div className="rp-case-player">{playing===c.url?<iframe src={youtubeEmbed(c.url)} title={c.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>:<button type="button" aria-label={`Дивитися відео: ${c.title}`} onClick={()=>setPlaying(c.url)}><Image src={youtubeThumb(c.url)} alt="" width={1280} height={720} unoptimized/><span><Play size={wide?30:22}/></span></button>}</div>
   </article>})}</div>
 </section>
}
