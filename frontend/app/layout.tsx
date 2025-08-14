import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BloodAlert - Real-Time Blood Shortage Alert System',
  description: 'Connecting hospitals, donors, and emergency responders to save lives through intelligent blood shortage alerts and rapid donor mobilization.',
  keywords: 'blood donation, emergency alerts, hospital network, donor mobilization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}