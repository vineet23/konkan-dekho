// components/GtmLoader.js
'use client'

import Script from 'next/script'

const GTM_ID = 'GTM-P5CZZSGX' // <-- ⚠️ Replace this with your GTM ID

export default function GtmLoader() {
  return (
    <>
      {/* GTM main script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive" // Loads after the page is interactive
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
        }}
      />
      {/* GTM noscript (for browsers with JavaScript disabled) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
    </>
  )
}