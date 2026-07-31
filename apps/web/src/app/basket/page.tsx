'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BasketItem {
  productId: string;
  productName: string;
  productNameAmharic?: string;
  quantity: number;
  unit?: string;
  cheapestPrice?: number;
}

interface SingleStoreOption {
  storeId: string;
  storeName: string;
  totalCost: number;
  matchCount: number;
  missingCount: number;
}

interface SplitBreakdownItem {
  productId: string;
  productName: string;
  productNameAmharic?: string;
  quantity: number;
  storeName: string;
  unitPrice: number;
  totalItemCost: number;
}

interface OptimizationResult {
  status: string;
  itemCount: number;
  singleStoreOptions: SingleStoreOption[];
  splitBasketOptimal: {
    totalCost: number;
    cheapestSingleStoreCost: number;
    potentialSavings: number;
    savingsPercentage: number;
    breakdown: SplitBreakdownItem[];
  };
}

const DEFAULT_SAMPLE_ITEMS: BasketItem[] = [
  {
    productId: 'e1111111-1111-4111-8111-111111111111',
    productName: 'White Teff',
    productNameAmharic: 'ነጭ ጤፍ',
    quantity: 2,
    unit: 'Kg',
    cheapestPrice: 110.0,
  },
  {
    productId: 'e8888888-8888-4888-8888-888888888888',
    productName: 'Pasteurized Fresh Milk 1L',
    productNameAmharic: 'ትኩስ ወተት 1L',
    quantity: 3,
    unit: '1L Bottle',
    cheapestPrice: 55.0,
  },
  {
    productId: 'e3333333-3333-4333-8333-333333333333',
    productName: 'Barilla Spaghetti Pasta',
    productNameAmharic: 'ባሪላ ፓስታ',
    quantity: 2,
    unit: '500g Pack',
    cheapestPrice: 85.0,
  },
  {
    productId: 'e9999999-9999-4999-8999-999999999999',
    productName: 'Traditional Shiro Powder',
    productNameAmharic: 'የተፈጨ ሺሮ',
    quantity: 1,
    unit: 'Kg',
    cheapestPrice: 220.0,
  },
];

export default function BasketPage() {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('smart_cart_basket');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBasketItems(parsed);
          return;
        }
      } catch (e) {
        // Fallback below
      }
    }
    setBasketItems(DEFAULT_SAMPLE_ITEMS);
  }, []);

  const saveBasket = (updated: BasketItem[]) => {
    setBasketItems(updated);
    localStorage.setItem('smart_cart_basket', JSON.stringify(updated));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const updated = basketItems
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as BasketItem[];

    saveBasket(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = basketItems.filter((i) => i.productId !== productId);
    saveBasket(updated);
  };

  const handleCalculateSavings = async () => {
    if (basketItems.length === 0) return;
    setLoading(true);

    const payload = {
      items: basketItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch('http://localhost:3000/lists/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setResult(json);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend API offline or starting up. Simulating optimization algorithm locally.', err);
    }

    // Local simulation fallback matching backend algorithm output
    simulateLocalOptimization(basketItems);
    setLoading(false);
  };

  const simulateLocalOptimization = (items: BasketItem[]) => {
    const pricesMap: Record<string, Record<string, number>> = {
      'e1111111-1111-4111-8111-111111111111': { 'Merkato Central Market': 110, 'FreshMart (Sarbet)': 130, 'Shoa Supermarket (Bole)': 135, 'Bambis Supermarket': 140 },
      'e2222222-2222-4222-8222-222222222222': { 'Merkato Central Market': 380, 'FreshMart (Sarbet)': 440, 'Shoa Supermarket (Bole)': 450, 'Bambis Supermarket': 480 },
      'e3333333-3333-4333-8333-333333333333': { 'Merkato Central Market': 85, 'FreshMart (Sarbet)': 90, 'Shoa Supermarket (Bole)': 95, 'Bambis Supermarket': 100 },
      'e4444444-4444-4444-8444-444444444444': { 'Merkato Central Market': 850, 'FreshMart (Sarbet)': 900, 'Shoa Supermarket (Bole)': 920, 'Bambis Supermarket': 960 },
      'e8888888-8888-4888-8888-888888888888': { 'Merkato Central Market': 55, 'FreshMart (Sarbet)': 58, 'Shoa Supermarket (Bole)': 60, 'Bambis Supermarket': 65 },
      'e9999999-9999-4999-8999-999999999999': { 'Merkato Central Market': 220, 'FreshMart (Sarbet)': 260, 'Shoa Supermarket (Bole)': 280, 'Bambis Supermarket': 300 },
    };

    const stores = ['Merkato Central Market', 'FreshMart (Sarbet)', 'Shoa Supermarket (Bole)', 'Bambis Supermarket'];

    const singleStoreOptions = stores
      .map((storeName) => {
        let totalCost = 0;
        let matchCount = 0;
        for (const item of items) {
          const storePrice = pricesMap[item.productId]?.[storeName] || 100;
          totalCost += storePrice * item.quantity;
          matchCount++;
        }
        return {
          storeId: storeName,
          storeName,
          totalCost,
          matchCount,
          missingCount: 0,
        };
      })
      .sort((a, b) => a.totalCost - b.totalCost);

    let splitTotal = 0;
    const splitBreakdown: SplitBreakdownItem[] = [];

    for (const item of items) {
      const pPrices = pricesMap[item.productId] || { 'Merkato Central Market': 100 };
      const sortedStores = Object.entries(pPrices).sort((a, b) => a[1] - b[1]);
      const [bestStore, unitPrice] = sortedStores[0];
      const totalItemCost = unitPrice * item.quantity;
      splitTotal += totalItemCost;

      splitBreakdown.push({
        productId: item.productId,
        productName: item.productName,
        productNameAmharic: item.productNameAmharic,
        quantity: item.quantity,
        storeName: bestStore,
        unitPrice,
        totalItemCost,
      });
    }

    const cheapestSingle = singleStoreOptions[0]?.totalCost || 0;
    const savings = Math.max(0, cheapestSingle - splitTotal);

    setResult({
      status: 'success',
      itemCount: items.length,
      singleStoreOptions,
      splitBasketOptimal: {
        totalCost: splitTotal,
        cheapestSingleStoreCost: cheapestSingle,
        potentialSavings: savings,
        savingsPercentage: cheapestSingle > 0 ? Number(((savings / cheapestSingle) * 100).toFixed(1)) : 0,
        breakdown: splitBreakdown,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
            <span>✨ Smart Basket Optimization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Shopping Basket Planner
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Build your grocery list, adjust quantities, and let our algorithm find the cheapest store options.
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
        >
          + Add More Items
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List Items Table & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#131825] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h2 className="text-base font-bold text-slate-100 mb-4 flex items-center justify-between">
              <span>Your Shopping List</span>
              <span className="text-xs text-slate-400 font-medium">({basketItems.length} items)</span>
            </h2>

            {basketItems.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs space-y-3">
                <p>Your basket is currently empty.</p>
                <Link href="/" className="inline-block text-emerald-400 font-bold hover:underline">
                  Browse Catalog to Add Products
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {basketItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-200">{item.productName}</h4>
                      {item.productNameAmharic && (
                        <p className="text-emerald-400/90 font-medium text-[11px]">{item.productNameAmharic}</p>
                      )}
                      <p className="text-slate-400 text-[10px]">{item.unit || 'Kg'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700/60 overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, -1)}
                          className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2.5 font-bold text-slate-100 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, 1)}
                          className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleCalculateSavings}
                  disabled={loading}
                  className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Running Smart Optimizer...' : '🚀 Calculate Best Basket Savings'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Optimization Results Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-[#131825]/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto font-bold text-xl">
                📊
              </div>
              <h3 className="font-bold text-slate-200 text-base">Ready for Basket Comparison</h3>
              <p className="max-w-md mx-auto text-xs text-slate-400">
                Click <strong>"Calculate Best Basket Savings"</strong> to run our algorithm. We will compare buying all items at a single supermarket versus split-basket cherry picking.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Highlight 1: Split-Basket Optimal Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/60 via-[#131825] to-teal-950/60 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-md">
                      Recommended Optimal Option
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">Split-Basket Cherry Picking</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {result.splitBasketOptimal.totalCost.toFixed(2)} ETB
                    </div>
                    {result.splitBasketOptimal.potentialSavings > 0 && (
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Save {result.splitBasketOptimal.potentialSavings.toFixed(2)} ETB ({result.splitBasketOptimal.savingsPercentage}%)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 border-t border-slate-800/80 pt-3">
                  Buying each item at its absolute cheapest store yields the lowest possible spend across Addis Ababa markets.
                </p>

                {/* Split Breakdown Items */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                    <span>Item & Best Store</span>
                    <span>Item Total</span>
                  </div>

                  {result.splitBasketOptimal.breakdown.map((item, idx) => (
                    <div
                      key={item.productId || idx}
                      className="flex items-center justify-between text-xs bg-slate-900/80 border border-slate-800/80 px-3.5 py-2.5 rounded-xl"
                    >
                      <div>
                        <span className="font-bold text-slate-200">{item.productName}</span>
                        {item.productNameAmharic && (
                          <span className="text-emerald-400 font-medium ml-1 text-[11px]">({item.productNameAmharic})</span>
                        )}
                        <span className="text-slate-400 text-[11px] ml-2">x{item.quantity}</span>
                        <div className="text-[11px] text-teal-300 font-semibold mt-0.5">
                          📍 Buy at: <strong className="text-white">{item.storeName}</strong> ({item.unitPrice.toFixed(2)} ETB/unit)
                        </div>
                      </div>

                      <div className="font-extrabold text-emerald-400 text-sm">
                        {item.totalItemCost.toFixed(2)} ETB
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Single Store Comparison Options */}
              <div className="bg-[#131825] border border-slate-800/80 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-100 flex items-center justify-between">
                  <span>Single Supermarket Options</span>
                  <span className="text-xs text-slate-400 font-normal">(If buying everything in one trip)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.singleStoreOptions.map((opt, rank) => {
                    const isBestSingle = rank === 0;
                    return (
                      <div
                        key={opt.storeId || opt.storeName}
                        className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                          isBestSingle
                            ? 'bg-slate-900/90 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                            : 'bg-slate-900/40 border-slate-800/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Rank #{rank + 1}
                            </span>
                            <h4 className="font-bold text-sm text-slate-100">{opt.storeName}</h4>
                          </div>
                          {isBestSingle && (
                            <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                              Best Single
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline justify-between border-t border-slate-800/60 pt-2">
                          <span className="text-xs text-slate-400">Total Basket:</span>
                          <span className="text-lg font-black text-slate-100">{opt.totalCost.toFixed(2)} ETB</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
