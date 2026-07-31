'use client';

import React, { useState, useEffect } from 'react';
import ProductCard, { Product } from '../components/ProductCard';

const FALLBACK_ETHIOPIAN_PRODUCTS: Product[] = [
  {
    id: 'e1111111-1111-4111-8111-111111111111',
    upc: '011110416001',
    name: 'White Teff',
    nameAmharic: 'ነጭ ጤፍ',
    unit: 'Kg',
    category: 'Grains & Flour',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 110.0 },
      { storeName: 'FreshMart (Sarbet)', price: 130.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 135.0 },
      { storeName: 'Bambis Supermarket', price: 140.0 },
    ],
  },
  {
    id: 'e2222222-2222-4222-8222-222222222222',
    upc: '022220416002',
    name: 'Ethiopian Roasted Coffee Beans',
    nameAmharic: 'የኢትዮጵያ የቆላ ቡና',
    unit: 'Kg',
    category: 'Pantry Staples',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 380.0 },
      { storeName: 'FreshMart (Sarbet)', price: 440.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 450.0 },
      { storeName: 'Bambis Supermarket', price: 480.0 },
    ],
  },
  {
    id: 'e3333333-3333-4333-8333-333333333333',
    upc: '033330416003',
    name: 'Barilla Spaghetti Pasta',
    nameAmharic: 'ባሪላ ፓስታ',
    unit: '500g Pack',
    category: 'Pantry Staples',
    brand: 'Barilla',
    prices: [
      { storeName: 'Merkato Central Market', price: 85.0 },
      { storeName: 'FreshMart (Sarbet)', price: 90.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 95.0 },
      { storeName: 'Bambis Supermarket', price: 100.0 },
    ],
  },
  {
    id: 'e4444444-4444-4444-8444-444444444444',
    upc: '044440416004',
    name: 'Sunflower Cooking Oil 5L',
    nameAmharic: 'የሱፍ የምግብ ዘይት 5L',
    unit: '5L Bottle',
    category: 'Pantry Staples',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 850.0 },
      { storeName: 'FreshMart (Sarbet)', price: 900.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 920.0 },
      { storeName: 'Bambis Supermarket', price: 960.0 },
    ],
  },
  {
    id: 'e8888888-8888-4888-8888-888888888888',
    upc: '088880416008',
    name: 'Pasteurized Fresh Milk 1L',
    nameAmharic: 'ትኩስ ወተት 1L',
    unit: '1L Bottle',
    category: 'Dairy & Beverages',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 55.0 },
      { storeName: 'FreshMart (Sarbet)', price: 58.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 60.0 },
      { storeName: 'Bambis Supermarket', price: 65.0 },
    ],
  },
  {
    id: 'e9999999-9999-4999-8999-999999999999',
    upc: '099990416009',
    name: 'Traditional Shiro Powder',
    nameAmharic: 'የተፈጨ ሺሮ',
    unit: 'Kg',
    category: 'Pantry Staples',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 220.0 },
      { storeName: 'FreshMart (Sarbet)', price: 260.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 280.0 },
      { storeName: 'Bambis Supermarket', price: 300.0 },
    ],
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const fetchProducts = async (searchQuery: string = '') => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/products/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setProducts(json.data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API connection pending, operating with client fallback.', err);
    }

    // Client-side fallback filter
    const clean = searchQuery.toLowerCase().trim();
    if (!clean) {
      setProducts(FALLBACK_ETHIOPIAN_PRODUCTS);
    } else {
      const filtered = FALLBACK_ETHIOPIAN_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(clean) ||
          (p.nameAmharic && p.nameAmharic.includes(clean)) ||
          (p.category && p.category.toLowerCase().includes(clean)),
      );
      setProducts(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts('');
    // Load existing basket selections from localStorage
    const savedBasket = localStorage.getItem('smart_cart_basket');
    if (savedBasket) {
      try {
        const items = JSON.parse(savedBasket);
        const set = new Set<string>(items.map((i: any) => i.productId));
        setAddedIds(set);
      } catch (e) {
        // Ignore JSON error
      }
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(query);
  };

  const handleQuickTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    fetchProducts(tagQuery);
  };

  const handleAddToBasket = (product: Product) => {
    const savedBasket = localStorage.getItem('smart_cart_basket');
    let items: any[] = savedBasket ? JSON.parse(savedBasket) : [];

    const existingIdx = items.findIndex((i) => i.productId === product.id);
    if (existingIdx >= 0) {
      items[existingIdx].quantity += 1;
    } else {
      items.push({
        productId: product.id,
        productName: product.name,
        productNameAmharic: product.nameAmharic,
        quantity: 1,
        unit: product.unit || 'Kg',
        cheapestPrice: product.prices?.[0]?.price || 0,
      });
    }

    localStorage.setItem('smart_cart_basket', JSON.stringify(items));
    setAddedIds((prev) => new Set(prev).add(product.id));
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto pt-4 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span>🇪🇹 Real-time Addis Ababa Supermarket Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Compare Prices Across <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Ethiopian Stores</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Search bilingual product listings (English & Amharic), find live prices across <strong className="text-slate-200">Shoa, Merkato, Bambis, & FreshMart</strong>, and optimize your weekly shopping spend.
        </p>
      </div>

      {/* Glassmorphic Search Bar */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items in English or Amharic (e.g. White Teff, ጤፍ, Coffee, ወተት)..."
            className="w-full bg-[#131825] border border-slate-700/80 focus:border-emerald-500/80 rounded-2xl px-5 py-4 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-xl transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-slate-400 font-medium mr-1">Popular:</span>
          {['Teff / ጤፍ', 'Coffee / ቡና', 'Pasta / ፓስታ', 'Milk / ወተት', 'Shiro / ሺሮ'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleQuickTagClick(tag.split(' / ')[0])}
              className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>Catalog Comparison</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {products.length} Items Found
          </span>
        </h2>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              fetchProducts('');
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Clear Search Filter ✕
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm animate-pulse">
          Searching Ethiopian grocery catalogs...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-[#131825]/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <p className="text-slate-300 font-semibold text-base">No products matched "{query}"</p>
          <p className="text-slate-400 text-xs">Try searching for staple items like Teff, Coffee, Pasta, or Shiro.</p>
          <button
            onClick={() => {
              setQuery('');
              fetchProducts('');
            }}
            className="mt-2 text-xs font-bold text-emerald-400 hover:underline"
          >
            Reset Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToBasket={handleAddToBasket}
              isAdded={addedIds.has(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
