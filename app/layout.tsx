import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import { ReactNode } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ClientProviders } from './client-providers';

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
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7897104007345492"
     crossorigin="anonymous"></script> 
      <head />
      <body>
        <ClientProviders>
          <Navbar />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
