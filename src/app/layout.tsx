import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import localFont from 'next/font/local';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cake Panier',
  description:
    'Streamline your business with Dealio ERP: integrated invoicing, accounting, POS, warehouse, and supplier management.',
  keywords: [
    'Dealio',
    'Pastry',
    'Restaurant',
    'Bakery',
    'Cakes'
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
