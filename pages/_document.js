import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="description" content="PeopleOS Learning Hub — Học để dẫn đầu. Từ HR Manager đến CHRO. Miễn phí, gamified, dành cho HR professionals Việt Nam." />
        <meta property="og:title" content="PeopleOS Learning Hub · by TaHien" />
        <meta property="og:description" content="35 khóa học HR miễn phí. AI-powered. Human-centered." />
        <meta name="theme-color" content="#020B18" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
