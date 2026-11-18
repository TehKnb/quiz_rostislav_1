'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
// Shared by the case and review sliders: red square arrows, dots per page and an optional hint under them.
export function Slider({label,slides,className,hint}:{label:string;slides:{key:string;node:ReactNode}[];className:string;hint?:string}){
 const [api,setApi]=useState<CarouselApi>(),[pages,setPages]=useState(0),[page,setPage]=useState(0),[edges,setEdges]=useState({prev:false,next:false});
 useEffect(()=>{if(!api)return;const sync=()=>{setPages(api.scrollSnapList().length);setPage(api.selectedScrollSnap());setEdges({prev:api.canScrollPrev(),next:api.canScrollNext()})};api.on('init',sync).on('reInit',sync).on('select',sync);queueMicrotask(sync);return ()=>{api.off('init',sync).off('reInit',sync).off('select',sync)}},[api]);
 return <div className={'rp-slider '+className}>
  <Carousel setApi={setApi} opts={{align:'start',slidesToScroll:'auto'}} aria-label={label}>
   <CarouselContent>{slides.map(s=><CarouselItem key={s.key} className="rp-slide">{s.node}</CarouselItem>)}</CarouselContent>
   {pages>1&&<><button type="button" className="rp-slider-arrow prev" aria-label="Назад" disabled={!edges.prev} onClick={()=>api?.scrollPrev()}><ChevronLeft size={22} strokeWidth={3}/></button><button type="button" className="rp-slider-arrow next" aria-label="Далі" disabled={!edges.next} onClick={()=>api?.scrollNext()}><ChevronRight size={22} strokeWidth={3}/></button></>}
  </Carousel>
  {pages>1&&<div className="rp-slider-dots">{Array.from({length:pages},(_,i)=><button type="button" key={i} aria-label={`Сторінка ${i+1} з ${pages}`} aria-current={i===page} onClick={()=>api?.scrollTo(i)}/>)}</div>}
  {hint&&pages>1&&<p className="rp-slider-hint"><span>{hint}</span></p>}
 </div>
}
