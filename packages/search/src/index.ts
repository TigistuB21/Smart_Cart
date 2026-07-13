import { Client } from 'typesense';

export interface ProductDocument {
  id: string;
  upc: string;
  name: string;
  brand: string;
  category: string;
  sizeVolume: string;
  lowestPrice: number;
  highestPrice: number;
}

export class SearchService {
  private client: Client;
  private readonly collectionName = 'products';

  constructor(nodes: { host: string; port: number; protocol: string }[], apiKey: string) {
    this.client = new Client({
      nodes,
      apiKey,
      connectionTimeoutSeconds: 5,
    });
  }

  /**
   * Initializes the Products index collection in Typesense if it does not already exist.
   */
  async initializeSchema(): Promise<void> {
    const schema = {
      name: this.collectionName,
      fields: [
        { name: 'id', type: 'string' as const },
        { name: 'upc', type: 'string' as const, index: true },
        { name: 'name', type: 'string' as const, index: true },
        { name: 'brand', type: 'string' as const, index: true, facet: true },
        { name: 'category', type: 'string' as const, index: true, facet: true },
        { name: 'sizeVolume', type: 'string' as const, index: false },
        { name: 'lowestPrice', type: 'float' as const, sort: true },
        { name: 'highestPrice', type: 'float' as const, sort: true },
      ],
      default_sorting_field: 'lowestPrice',
    };

    try {
      await this.client.collections(this.collectionName).retrieve();
      console.log(`Collection "${this.collectionName}" already exists.`);
    } catch (error) {
      // Collection does not exist, create it
      console.log(`Creating collection "${this.collectionName}"...`);
      await this.client.collections().create(schema);
      console.log(`Collection "${this.collectionName}" created successfully.`);
    }
  }

  /**
   * Upsert a batch of product search documents.
   */
  async upsertProducts(products: ProductDocument[]): Promise<void> {
    try {
      const results = await this.client
        .collections<ProductDocument>(this.collectionName)
        .documents()
        .import(products, { action: 'upsert' });
      
      console.log(`Successfully indexed ${products.length} products in Typesense.`);
    } catch (error) {
      console.error('Error importing documents to Typesense:', error);
      throw error;
    }
  }

  /**
   * Perform a text search against the products collection.
   */
  async searchProducts(query: string, filterBy?: string, page = 1, perPage = 10) {
    return this.client
      .collections(this.collectionName)
      .documents()
      .search({
        q: query,
        query_by: 'name,brand,category,upc',
        filter_by: filterBy,
        page,
        per_page: perPage,
        prioritize_exact_match: true,
      });
  }
}
