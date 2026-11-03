import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'КНБ — персональна карта бізнесу',description:'20 запитань про ваш бізнес. Маркетинг, продажі, команда й аналітика — побачте, з чого почати зміни.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="uk"><body>{children}</body></html>}
