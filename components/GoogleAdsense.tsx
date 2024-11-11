'use client';

import Script from 'next/script';

export default function GoogleAdsense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7897104007345492"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
} 