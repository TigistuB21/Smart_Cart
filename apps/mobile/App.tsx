import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import ScannerScreen from './src/screens/ScannerScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'basket'>('scanner');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f17" />

      {/* App Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>SC</Text>
          </View>
          <Text style={styles.headerTitle}>Smart Cart</Text>
          <View style={styles.ethiopiaPill}>
            <Text style={styles.ethiopiaPillText}>🇪🇹 ETHIOPIA</Text>
          </View>
        </View>
      </View>

      {/* Screen Body */}
      <View style={styles.body}>
        {activeTab === 'scanner' ? (
          <ScannerScreen />
        ) : (
          <ScrollView style={styles.basketScroll} contentContainerStyle={styles.basketContent}>
            <Text style={styles.sectionHeader}>Addis Ababa Sample Basket</Text>

            <View style={styles.basketCard}>
              <Text style={styles.itemTitle}>White Teff (ነጭ ጤፍ)</Text>
              <Text style={styles.itemSub}>2 Kg • Cheapest at Merkato (110 ETB/Kg)</Text>
              <Text style={styles.itemCost}>220.00 ETB</Text>
            </View>

            <View style={styles.basketCard}>
              <Text style={styles.itemTitle}>Fresh Milk (ትኩስ ወተት)</Text>
              <Text style={styles.itemSub}>3 L • Cheapest at Merkato (55 ETB/L)</Text>
              <Text style={styles.itemCost}>165.00 ETB</Text>
            </View>

            <View style={styles.basketCard}>
              <Text style={styles.itemTitle}>Barilla Spaghetti (ባሪላ ፓስታ)</Text>
              <Text style={styles.itemSub}>2 Packs • Cheapest at Merkato (85 ETB/Pack)</Text>
              <Text style={styles.itemCost}>170.00 ETB</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>SPLIT-BASKET OPTIMAL TOTAL</Text>
              <Text style={styles.summaryAmount}>555.00 ETB</Text>
              <Text style={styles.summarySavings}>Saving 85.00 ETB vs Shoa Supermarket</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'scanner' && styles.activeTabItem]}
          onPress={() => setActiveTab('scanner')}
        >
          <Text style={[styles.tabIcon, activeTab === 'scanner' && styles.activeTabIcon]}>📷</Text>
          <Text style={[styles.tabLabel, activeTab === 'scanner' && styles.activeTabLabel]}>
            Barcode Scanner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'basket' && styles.activeTabItem]}
          onPress={() => setActiveTab('basket')}
        >
          <Text style={[styles.tabIcon, activeTab === 'basket' && styles.activeTabIcon]}>🛒</Text>
          <Text style={[styles.tabLabel, activeTab === 'basket' && styles.activeTabLabel]}>
            Addis Basket
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f17',
  },
  header: {
    backgroundColor: '#111622',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#022c22',
    fontWeight: '900',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  ethiopiaPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  ethiopiaPillText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
  },
  body: {
    flex: 1,
  },
  basketScroll: {
    flex: 1,
  },
  basketContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 16,
  },
  basketCard: {
    backgroundColor: '#111622',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  itemSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  itemCost: {
    fontSize: 16,
    fontWeight: '800',
    color: '#34d399',
    marginTop: 6,
  },
  summaryBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  summaryAmount: {
    color: '#34d399',
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 4,
  },
  summarySavings: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#111622',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    height: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#10b981',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabLabel: {
    color: '#10b981',
    fontWeight: '700',
  },
});
