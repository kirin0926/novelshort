'use client';

import Script from 'next/script';

export default function GoogleAdsense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7897104007345492"
      strategy="lazyOnload"
      crossOrigin="anonymous"
      onError={(e) => {
        console.error('AdSense script failed to load:', e);
      }}
      onLoad={() => {
        console.log('AdSense script loaded successfully');
      }}
    />
  );
} 