'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Play } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { youtubeEmbed, youtubeThumb, type CaseSet, type VideoCase } from './lib/video-cases';
function CaseSlider({items,label,featured,playing,onPlay}:{items:VideoCase[];label:string;featured?:boolean;playing:string|null;onPlay:(url:string|null)=>void}){
 const [api,setApi]=useState<CarouselApi>();
 useEffect(()=>{if(!api)return;const stop=()=>onPlay(null);api.on('select',stop);return ()=>{api.off('select',stop)}},[api,onPlay]);
 return <Carousel opts={{align:'start'}} setApi={setApi} aria-label={label} className={featured?'rp-case-slider featured':'rp-case-slider'}>
  <CarouselContent>{items.map(c=><CarouselItem key={c.url} className="rp-case-item"><article className="rp-case">
   <div className="rp-case-player">{playing===c.url?<iframe src={youtubeEmbed(c.url)} title={c.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>:<button type="button" aria-label={`Дивитися відео: ${c.title}`} onClick={()=>onPlay(c.url)}><Image src={youtubeThumb(c.url)} alt="" width={1280} height={720} unoptimized/><span><Play size={featured?30:22}/></span></button>}</div>
   <h3>{c.title}</h3><a href={c.url} target="_blank" rel="noopener noreferrer">Дивитися на YouTube<ExternalLink size={13}/></a>
  </article></CarouselItem>)}</CarouselContent>
  <div className="rp-case-nav"><CarouselPrevious className="rp-case-arrow" aria-label="Попереднє відео"/><CarouselNext className="rp-case-arrow" aria-label="Наступне відео"/></div>
 </Carousel>
}
export function VideoCases({cases}:{cases:CaseSet}){
 const [playing,setPlaying]=useState<string|null>(null);
 return <section className="rp-cases" aria-labelledby="cases-title"><div className="rp-section-heading"><h2 id="cases-title">ВІДЕОКЕЙСИ ПІДПРИЄМЦІВ</h2></div><p className="rp-cases-intro">Поки очікуєте на зв’язок із фахівцем КНБ, перегляньте розбори інших власників бізнесу.</p>
  {cases.main.length>0&&<CaseSlider featured items={cases.main} label="Основні відеокейси" playing={playing} onPlay={setPlaying}/>}
  {cases.extra.length>0&&<CaseSlider items={cases.extra} label={cases.main.length?'Інші відеокейси':'Відеокейси'} playing={playing} onPlay={setPlaying}/>}
 </section>
}
