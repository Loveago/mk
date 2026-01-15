import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'MyGhanaMarketplace',
  description: 'Marketplace for Ghana / West Africa'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}


