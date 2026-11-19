import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
export const metadata: Metadata = {title:'КНБ — персональна карта бізнесу',description:'21 запитання про ваш бізнес. Маркетинг, продажі, команда й аналітика — побачте, з чого почати зміни.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="uk"><body>{children}{/* AI sales assistant widget from the club's site; loads after the page is interactive, like defer. */}<Script src="https://kons-na-bis.com/wp-content/plugins/ai-sales-assistant/public/embed.js" strategy="afterInteractive"/></body></html>}
