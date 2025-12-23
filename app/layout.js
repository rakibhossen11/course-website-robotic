import { AuthProvider } from '@/components/AuthContext';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { InvoiceProvider } from './contexts/InvoiceContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <InvoiceProvider>
          <Navbar />
          {children}
          </InvoiceProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}