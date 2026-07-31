import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export interface StorePrice {
  id?: string;
  storeName: string;
  price: number;
  updated_at?: string;
}

export interface ProductResult {
  id: string;
  upc?: string;
  name: string;
  nameAmharic?: string;
  unit?: string;
  sizeVolume?: string;
  brand?: string;
  category?: string;
  prices: StorePrice[];
}

interface ProductResultCardProps {
  product: ProductResult;
  onScanNext: () => void;
}

export default function ProductResultCard({ product, onScanNext }: ProductResultCardProps) {
  const sortedPrices = [...(product.prices || [])].sort((a, b) => a.price - b.price);
  const cheapest = sortedPrices.length > 0 ? sortedPrices[0] : null;

  return (
    <ScrollView style={styles.cardContainer} contentContainerStyle={styles.cardContent}>
      {/* Success Badge */}
      <View style={styles.successBadge}>
        <Text style={styles.successBadgeText}>✓ Barcode Matched</Text>
      </View>

      {/* Main Title & Bilingual Info */}
      <View style={styles.headerSection}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.nameAmharic && (
          <Text style={styles.productNameAmharic}>{product.nameAmharic}</Text>
        )}
        <View style={styles.metaRow}>
          {product.unit && (
            <View style={styles.unitPill}>
              <Text style={styles.unitText}>Unit: {product.unit}</Text>
            </View>
          )}
          {product.category && (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Best Price Highlight Box */}
      {cheapest && (
        <View style={styles.bestPriceBox}>
          <View>
            <Text style={styles.bestPriceLabel}>CHEAPEST OPTION</Text>
            <Text style={styles.bestPriceStore}>{cheapest.storeName}</Text>
          </View>
          <Text style={styles.bestPriceAmount}>{cheapest.price.toFixed(2)} ETB</Text>
        </View>
      )}

      {/* Store Comparisons List */}
      <View style={styles.pricesSection}>
        <Text style={styles.pricesSectionTitle}>COMPARING STORES (ADDIS ABABA)</Text>

        {sortedPrices.map((item, idx) => {
          const isCheapest = idx === 0;
          return (
            <View
              key={item.storeName || idx}
              style={[styles.priceRow, isCheapest && styles.cheapestRow]}
            >
              <View style={styles.storeNameCol}>
                <Text style={[styles.storeNameText, isCheapest && styles.cheapestStoreText]}>
                  {item.storeName}
                </Text>
                {isCheapest && <Text style={styles.lowestTag}>Lowest</Text>}
              </View>
              <Text style={[styles.priceText, isCheapest && styles.cheapestPriceText]}>
                {item.price.toFixed(2)} ETB
              </Text>
            </View>
          );
        })}
      </View>

      {/* Scan Another Button */}
      <TouchableOpacity style={styles.scanAgainBtn} onPress={onScanNext}>
        <Text style={styles.scanAgainBtnText}>📷 Scan Another Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  successBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  successBadgeText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  headerSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4,
  },
  productNameAmharic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34d399',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitPill: {
    backgroundColor: '#1e293b',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  unitText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryPill: {
    backgroundColor: '#1e293b',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  bestPriceBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bestPriceLabel: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bestPriceStore: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  bestPriceAmount: {
    color: '#34d399',
    fontSize: 22,
    fontWeight: '900',
  },
  pricesSection: {
    marginBottom: 24,
  },
  pricesSectionTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111622',
    borderColor: '#1e293b',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  cheapestRow: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  storeNameCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeNameText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  cheapestStoreText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  lowestTag: {
    backgroundColor: '#10b981',
    color: '#022c22',
    fontSize: 9,
    fontWeight: '800',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
    overflow: 'hidden',
  },
  priceText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '700',
  },
  cheapestPriceText: {
    color: '#34d399',
    fontSize: 15,
    fontWeight: '800',
  },
  scanAgainBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  scanAgainBtnText: {
    color: '#022c22',
    fontSize: 15,
    fontWeight: '800',
  },
});
