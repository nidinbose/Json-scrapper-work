import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lead Extractor | Professional No-Website Finder',
  description: 'Upload a Google Places JSON dataset and extract businesses with no website in a clean, responsive workspace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
