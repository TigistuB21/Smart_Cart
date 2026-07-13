import React from 'react';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', marginTop: '2rem' }}>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: 800,
          margin: '0 0 1rem 0',
          background: 'linear-gradient(90deg, #58a6ff, #bc8cff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Save on Every Basket
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#8b949e', lineHeight: 1.6 }}>
          Search for products, scan barcodes, and instantly compare grocery pricing across local supermarket stores.
        </p>
      </div>

      {/* Glassmorphic Search Bar */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        background: 'rgba(22, 27, 34, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      }}>
        <form style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Search products (e.g., Organic Whole Milk, Pasta...)"
            style={{
              flex: 1,
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              color: '#c9d1d9',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#238636',
              border: '1px solid rgba(240,246,252,0.1)',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Mock Dashboard Watchlist */}
      <div style={{ width: '100%', maxWidth: '900px', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid #21262d', paddingBottom: '0.5rem', color: '#bc8cff' }}>
          Trending Price Drops
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.2rem' }}>
          
          {/* Card 1 */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '160px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: '#388bfd26', color: '#58a6ff', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Dairy</span>
              <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Organic Whole Milk</h4>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#8b949e' }}>FreshField • 1 Gallon</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>Cheapest</span>
                <div style={{ fontSize: '1.25rem', color: '#39d353', fontWeight: 700 }}>$4.49</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#f85149' }}>Highest: $4.89</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '160px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: '#56347c3d', color: '#d3c6e3', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Pantry</span>
              <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Spaghetti Pasta 16oz</h4>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#8b949e' }}>Pastafari</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>Cheapest</span>
                <div style={{ fontSize: '1.25rem', color: '#39d353', fontWeight: 700 }}>$0.99</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#f85149' }}>Highest: $1.29</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '160px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: '#56347c3d', color: '#d3c6e3', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Pantry</span>
              <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Creamy Peanut Butter</h4>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#8b949e' }}>NuttyDelight • 18 oz</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>Cheapest</span>
                <div style={{ fontSize: '1.25rem', color: '#39d353', fontWeight: 700 }}>$3.29</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#f85149' }}>Highest: $3.49</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
