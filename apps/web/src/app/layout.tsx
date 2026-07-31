import React from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Smart Cart Ethiopia - Supermarket Price Comparison & Basket Optimizer',
  description: 'Compare grocery prices across local stores in Addis Ababa and optimize your basket total in real-time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-200">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#111622]/90 border-b border-slate-800/80 px-4 py-3.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                SC
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Smart Cart
                </span>
                <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Ethiopia
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Search Products
              </Link>
              <Link
                href="/basket"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all shadow-sm"
              >
                Smart Basket
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>&copy; {new Date().getFullYear()} Smart Cart Ethiopia (Portfolio Edition). Real-time Price Intelligence.</p>
            <div className="flex items-center gap-4 text-slate-400 font-medium">
              <span>Shoa Supermarket</span>
              <span>•</span>
              <span>Merkato</span>
              <span>•</span>
              <span>Bambis</span>
              <span>•</span>
              <span>FreshMart</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
