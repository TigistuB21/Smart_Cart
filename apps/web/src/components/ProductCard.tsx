'use client';

import React from 'react';

export interface PriceEntry {
  id?: string;
  storeId?: string;
  storeName: string;
  price: number;
  updated_at?: string;
}

export interface Product {
  id: string;
  upc?: string;
  name: string;
  nameAmharic?: string;
  unit?: string;
  sizeVolume?: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  prices: PriceEntry[];
  cheapestPrice?: number;
  cheapestStore?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToBasket?: (product: Product) => void;
  isAdded?: boolean;
}

export default function ProductCard({ product, onAddToBasket, isAdded }: ProductCardProps) {
  const sortedPrices = [...(product.prices || [])].sort((a, b) => a.price - b.price);
  const cheapest = sortedPrices.length > 0 ? sortedPrices[0] : null;

  return (
    <div className="bg-[#131825] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
            {product.category || 'Grocery'}
          </span>
          {product.unit && (
            <span className="text-[11px] font-medium text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
              {product.unit}
            </span>
          )}
        </div>

        {/* Product Names (Bilingual) */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
            {product.name}
          </h3>
          {product.nameAmharic && (
            <p className="text-sm font-medium text-emerald-400/90 mt-0.5 tracking-wide">
              {product.nameAmharic}
            </p>
          )}
          {product.brand && (
            <p className="text-xs text-slate-400 mt-1">Brand: {product.brand}</p>
          )}
        </div>

        {/* Store Prices List */}
        <div className="space-y-2 mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex justify-between">
            <span>Store Comparisons</span>
            <span>Price (ETB)</span>
          </div>

          {sortedPrices.map((p, idx) => {
            const isCheapest = idx === 0;
            return (
              <div
                key={p.storeId || p.storeName || idx}
                className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg transition-colors ${
                  isCheapest
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'bg-slate-900/40 text-slate-300 border border-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{p.storeName}</span>
                  {isCheapest && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold">
                      Cheapest
                    </span>
                  )}
                </div>
                <span className="font-bold">{p.price.toFixed(2)} ETB</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      {onAddToBasket && (
        <button
          onClick={() => onAddToBasket(product)}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700/60 hover:border-emerald-500/50'
          }`}
        >
          {isAdded ? (
            <>
              <span>✓ Added to Basket</span>
            </>
          ) : (
            <>
              <span>+ Add to Smart Basket</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
