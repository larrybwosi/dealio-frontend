import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import localFont from 'next/font/local';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Dealio ERP - Invoicing, Accounting, POS',
  description:
    'Streamline your business with Dealio ERP: integrated invoicing, accounting, POS, warehouse, and supplier management.',
  keywords: [
    'Dealio',
  ],
  openGraph: {
    title: 'Dealio ERP - Streamline Your Business',
    description: 'Manage invoicing, accounting, POS, and more with Dealio ERP’s integrated solution.',
    images: [
      {
        url: 'https://cdn.sanity.io/images/7rkl59hi/production/a5412e38b9ce18b4a7ce1a9711854cd8bbf11911-1024x1024.webp?q=75&auto=format',
        width: 1200,
        height: 630,
        alt: 'Dealio ERP Software',
      },
    ],
    url: 'https://dealio.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dealio ERP - Invoicing, Accounting, POS',
    description: 'Streamline your business with Dealio ERP’s all-in-one solution for invoicing, accounting, and more.',
    images: [
      'https://cdn.sanity.io/images/7rkl59hi/production/a5412e38b9ce18b4a7ce1a9711854cd8bbf11911-1024x1024.webp?q=75&auto=format',
    ],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-8VZWK7XRJX" />
      <body className={`antialiased font-sans bg-gray-50 `}>
        <>{children}</>
        <Footer />
      </body>
    </html>
  );
}
