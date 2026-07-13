import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'list'>('search');

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Cart</Text>
      </View>

      {/* Main content body */}
      {activeTab === 'search' ? (
        <View style={styles.tabContent}>
          {hasPermission === null ? (
            <Text style={styles.text}>Requesting camera permission...</Text>
          ) : hasPermission === false ? (
            <Text style={styles.text}>No access to camera. Enable camera to scan barcodes.</Text>
          ) : (
            <View style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
              {scanned && (
                <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
                  <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <Text style={styles.tipText}>Point camera at a product barcode to compare prices</Text>
        </View>
      ) : (
        <ScrollView style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Active Shopping List</Text>
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>Organic Whole Milk</Text>
              <Text style={styles.itemSubtitle}>FreshField • 1 Gallon</Text>
            </View>
            <Text style={styles.itemPrice}>$4.49</Text>
          </View>
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>Creamy Peanut Butter</Text>
              <Text style={styles.itemSubtitle}>NuttyDelight • 18 oz</Text>
            </View>
            <Text style={styles.itemPrice}>$3.29</Text>
          </View>
        </ScrollView>
      )}

      {/* Navigation tabs */}
      <View style={styles.navTabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>Scanner / Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Shopping List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  header: {
    paddingHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
    backgroundColor: '#161b22',
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#58a6ff',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scannerContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#30363d',
    position: 'relative',
    marginBottom: 20,
  },
  scanButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#238636',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  scanButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    color: '#c9d1d9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  tipText: {
    color: '#8b949e',
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#bc8cff',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c9d1d9',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#8b949e',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#39d353',
  },
  navTabs: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#21262d',
    backgroundColor: '#161b22',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#58a6ff',
  },
  tabText: {
    fontSize: 14,
    color: '#8b949e',
  },
  activeTabText: {
    color: '#58a6ff',
    fontWeight: '600',
  },
});
