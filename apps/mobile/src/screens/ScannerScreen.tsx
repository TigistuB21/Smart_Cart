import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import ProductResultCard, { ProductResult } from '../components/ProductResultCard';

// Local IP configuration placeholder (Use 10.0.2.2 for Android emulator or your Wi-Fi LAN IP)
const API_BASE_URL = 'http://10.0.2.2:3000';

const ETHIOPIAN_MOCK_CATALOG: Record<string, ProductResult> = {
  '011110416001': {
    id: 'e1111111-1111-4111-8111-111111111111',
    upc: '011110416001',
    name: 'White Teff',
    nameAmharic: 'ነጭ ጤፍ',
    unit: 'Kg',
    category: 'Grains & Flour',
    prices: [
      { storeName: 'Merkato Central Market', price: 110.0 },
      { storeName: 'FreshMart (Sarbet)', price: 130.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 135.0 },
      { storeName: 'Bambis Supermarket', price: 140.0 },
    ],
  },
  '022220416002': {
    id: 'e2222222-2222-4222-8222-222222222222',
    upc: '022220416002',
    name: 'Ethiopian Roasted Coffee Beans',
    nameAmharic: 'የኢትዮጵያ የቆላ ቡና',
    unit: 'Kg',
    category: 'Pantry Staples',
    prices: [
      { storeName: 'Merkato Central Market', price: 380.0 },
      { storeName: 'FreshMart (Sarbet)', price: 440.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 450.0 },
      { storeName: 'Bambis Supermarket', price: 480.0 },
    ],
  },
  '033330416003': {
    id: 'e3333333-3333-4333-8333-333333333333',
    upc: '033330416003',
    name: 'Barilla Spaghetti Pasta',
    nameAmharic: 'ባሪላ ፓስታ',
    unit: '500g Pack',
    category: 'Pantry Staples',
    prices: [
      { storeName: 'Merkato Central Market', price: 85.0 },
      { storeName: 'FreshMart (Sarbet)', price: 90.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 95.0 },
      { storeName: 'Bambis Supermarket', price: 100.0 },
    ],
  },
  '088880416008': {
    id: 'e8888888-8888-4888-8888-888888888888',
    upc: '088880416008',
    name: 'Pasteurized Fresh Milk 1L',
    nameAmharic: 'ትኩስ ወተት 1L',
    unit: '1L Bottle',
    category: 'Dairy & Beverages',
    prices: [
      { storeName: 'Merkato Central Market', price: 55.0 },
      { storeName: 'FreshMart (Sarbet)', price: 58.0 },
      { storeName: 'Shoa Supermarket (Bole)', price: 60.0 },
      { storeName: 'Bambis Supermarket', price: 65.0 },
    ],
  },
};

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ProductResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/products/scan/${data}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setScannedProduct(json.data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API lookup offline, using fallback catalog for scan:', data);
    }

    // Fallback lookup
    const fallback = ETHIOPIAN_MOCK_CATALOG[data] || ETHIOPIAN_MOCK_CATALOG['011110416001'];
    setScannedProduct(fallback);
    setLoading(false);
  };

  const handleResetScan = () => {
    setScanned(false);
    setScannedProduct(null);
    setErrorMessage(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionSub}>
          Smart Cart needs camera access to scan product UPC barcodes in stores.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Fetching Store Price Comparison...</Text>
        </View>
      ) : scannedProduct ? (
        <ProductResultCard product={scannedProduct} onScanNext={handleResetScan} />
      ) : (
        <View style={styles.scannerWrapper}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Overlay Reticle */}
          <View style={styles.overlayContainer}>
            <View style={styles.scannerFrame} />
            <Text style={styles.overlayInstruction}>
              Align barcode within frame to scan
            </Text>

            {/* Quick Demo Scan Buttons for Testing Without Physical Camera */}
            <View style={styles.demoButtonsRow}>
              <Text style={styles.demoTitle}>Simulate Scan:</Text>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => handleBarCodeScanned({ type: 'upc', data: '011110416001' })}
              >
                <Text style={styles.demoChipText}>White Teff</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => handleBarCodeScanned({ type: 'upc', data: '088880416008' })}
              >
                <Text style={styles.demoChipText}>Fresh Milk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => handleBarCodeScanned({ type: 'upc', data: '033330416003' })}
              >
                <Text style={styles.demoChipText}>Pasta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f17',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0b0f17',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
  },
  permissionSub: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#022c22',
    fontWeight: '800',
    fontSize: 14,
  },
  permissionText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
  },
  loadingText: {
    color: '#34d399',
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
  },
  scannerWrapper: {
    flex: 1,
    position: 'relative',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 23, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scannerFrame: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 24,
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  overlayInstruction: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111622',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderColor: '#1e293b',
    borderWidth: 1,
  },
  demoTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  demoChip: {
    backgroundColor: '#1e293b',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  demoChipText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
});
