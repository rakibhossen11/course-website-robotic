import { AuthProvider } from '@/components/AuthContext';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { Suspense } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
        <AuthProvider>
          <InvoiceProvider>
          <Navbar />
          {children}
          </InvoiceProvider>
        </AuthProvider>
        <Footer />
        </Suspense>
      </body>
    </html>
  );
}