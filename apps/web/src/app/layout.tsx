import React from 'react';

export const metadata = {
  title: 'Smart Cart - Supermarket Price Comparison',
  description: 'Compare grocery prices across multiple local stores in real-time.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            background-color: #0d1117;
            color: #c9d1d9;
          }
        `}</style>
      </head>
      <body>
        <header style={{ borderBottom: '1px solid #21262d', padding: '1rem', backgroundColor: '#161b22' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#58a6ff' }}>Smart Cart</h1>
            <nav>
              <a href="/" style={{ color: '#c9d1d9', textDecoration: 'none', marginRight: '1rem' }}>Search</a>
              <a href="/lists" style={{ color: '#c9d1d9', textDecoration: 'none' }}>My Lists</a>
            </nav>
          </div>
        </header>
        <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid #21262d', padding: '1rem', textAlign: 'center', marginTop: '4rem', fontSize: '0.9rem', color: '#8b949e' }}>
          &copy; {new Date().getFullYear()} Smart Cart Platform. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
