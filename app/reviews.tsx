'use client';
import Image from 'next/image';
import { Slider } from './slider';
import { reviews, type Review } from './lib/reviews';
export function Reviews(){
 const author=(r:Review)=><div className="rp-review-author"><Image src={`/reviews/${r.photo}.jpg`} alt="" width={56} height={56} unoptimized/><b>{r.name}</b></div>;
 return <section className="rp-reviews" aria-labelledby="reviews-title">
  <h2 id="reviews-title">Що підприємці говорять про навчання</h2>
  <Slider className="rp-review-slider" label="Відгуки" slides={reviews.map(r=>({key:r.photo,node:<article className="rp-review">
   <span className="rp-review-mark" aria-hidden="true">“</span><p>{r.text}</p>{author(r)}
  </article>}))}/>
 </section>
}
