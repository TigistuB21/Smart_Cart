import { SearchService, ProductDocument } from '@smart-cart/search';

interface ScrapedProduct {
  upc: string;
  name: string;
  brand: string;
  category: string;
  size: string;
  storePrices: {
    storeName: string;
    chainName: string;
    price: number;
  }[];
}

// Simulated data source representing scraped input streams
const MOCK_SCRAPED_DATA: ScrapedProduct[] = [
  {
    upc: '011110416001',
    name: 'Organic Whole Milk',
    brand: 'FreshField',
    category: 'Dairy',
    size: '1 Gallon',
    storePrices: [
      { storeName: 'FreshMart Downtown', chainName: 'FreshMart', price: 4.89 },
      { storeName: 'SuperSave West', chainName: 'SuperSave', price: 4.49 },
    ],
  },
  {
    upc: '022220416002',
    name: 'Spaghetti Pasta 16oz',
    brand: 'Pastafari',
    category: 'Pantry',
    size: '16 oz',
    storePrices: [
      { storeName: 'FreshMart Downtown', chainName: 'FreshMart', price: 1.29 },
      { storeName: 'SuperSave West', chainName: 'SuperSave', price: 0.99 },
    ],
  },
  {
    upc: '033330416003',
    name: 'Creamy Peanut Butter',
    brand: 'NuttyDelight',
    category: 'Pantry',
    size: '18 oz',
    storePrices: [
      { storeName: 'FreshMart Downtown', chainName: 'FreshMart', price: 3.49 },
      { storeName: 'SuperSave West', chainName: 'SuperSave', price: 3.29 },
    ],
  },
];

async function runIngestion() {
  console.log('--- Starting Ingestion Runner ---');
  
  // Set up search service connection pointing to our local configuration
  // The Typesense key and port matches what we configured in docker-compose.yml
  const searchService = new SearchService(
    [{ host: 'localhost', port: 8108, protocol: 'http' }],
    'xyz123typesenseapikey'
  );

  console.log('1. Parsing and normalising scraped feeds...');
  const searchDocs: ProductDocument[] = MOCK_SCRAPED_DATA.map((product, index) => {
    const prices = product.storePrices.map(p => p.price);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);

    return {
      id: `mock-uuid-${index + 1}`,
      upc: product.upc,
      name: product.name,
      brand: product.brand,
      category: product.category,
      sizeVolume: product.size,
      lowestPrice,
      highestPrice,
    };
  });

  console.log('2. Mock database updates...');
  MOCK_SCRAPED_DATA.forEach(product => {
    console.log(`[Database Ingestion] Upserting Product UPC: ${product.upc} (${product.name})`);
    product.storePrices.forEach(sp => {
      console.log(`   -> Price Point: ${sp.chainName} at $${sp.price.toFixed(2)}`);
    });
  });

  console.log('3. Updating Search Engine Index cluster...');
  // We wrap this in a try-catch since Typesense may not be running locally in this dry run/compilation phase.
  try {
    await searchService.initializeSchema();
    await searchService.upsertProducts(searchDocs);
    console.log('Ingestion and search indexing completed successfully.');
  } catch (error) {
    console.warn('[Warning] Ingestion completed locally, but search cluster was not reachable. Ensure Docker containers are active.');
  }
}

// Execute the main script pipeline if run directly
if (require.main === module) {
  runIngestion().catch(err => {
    console.error('Ingestion runner encountered an error:', err);
    process.exit(1);
  });
}
