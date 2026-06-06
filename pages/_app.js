import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>PeopleOS Learning Hub · by TaHien</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style global jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020B18; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #020B18; }
        ::-webkit-scrollbar-thumb { background: #0F3050; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #22D3EE; }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
