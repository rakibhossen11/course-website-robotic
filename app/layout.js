import './globals.css';
import FirebaseAuthProvider from '@/components/FirebaseAuthProvider';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FirebaseAuthProvider>
          <Navbar />
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}

// import { Inter } from 'next/font/google';
// import './globals.css';
// import Navbar from '@/components/Navbar';
// import { AuthProvider } from '@/components/AuthProvider';
// import Footer from '@/components/Footer';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'LearnHub - Video Course Platform',
//   description: 'Learn skills with expert video courses',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           <Navbar />
//           <main className="min-h-screen bg-gray-50">
//             {children}
//           </main>
//           <Footer />
//           <footer className="bg-gray-800 text-white py-8">
//             <div className="container mx-auto px-4">
//               <p>&copy; 2024 LearnHub. All rights reserved.</p>
//             </div>
//           </footer>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }