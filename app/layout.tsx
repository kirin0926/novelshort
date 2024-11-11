import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import { ReactNode } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ClientProviders } from './client-providers';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import GoogleAdsense from '@/components/GoogleAdsense';

const title = 'shortnovel';
const description = 'Discover the World of NoverShort Stories';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body>
        <GoogleAnalytics />
        <GoogleAdsense />
        <ClientProviders>
          <Navbar />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
