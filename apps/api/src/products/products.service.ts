import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const MOCK_ETHIOPIAN_PRODUCTS = [
  {
    id: 'e1111111-1111-4111-8111-111111111111',
    upc: '011110416001',
    name: 'White Teff',
    nameAmharic: 'ነጭ ጤፍ',
    unit: 'Kg',
    sizeVolume: '1 Kg',
    category: 'Grains & Flour',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 110.0, updated_at: new Date() },
      { storeName: 'FreshMart (Sarbet)', price: 130.0, updated_at: new Date() },
      { storeName: 'Shoa Supermarket (Bole)', price: 135.0, updated_at: new Date() },
      { storeName: 'Bambis Supermarket', price: 140.0, updated_at: new Date() },
    ],
  },
  {
    id: 'e2222222-2222-4222-8222-222222222222',
    upc: '022220416002',
    name: 'Ethiopian Roasted Coffee Beans',
    nameAmharic: 'የኢትዮጵያ የቆላ ቡና',
    unit: 'Kg',
    sizeVolume: '1 Kg',
    category: 'Pantry Staples',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 380.0, updated_at: new Date() },
      { storeName: 'FreshMart (Sarbet)', price: 440.0, updated_at: new Date() },
      { storeName: 'Shoa Supermarket (Bole)', price: 450.0, updated_at: new Date() },
      { storeName: 'Bambis Supermarket', price: 480.0, updated_at: new Date() },
    ],
  },
  {
    id: 'e3333333-3333-4333-8333-333333333333',
    upc: '033330416003',
    name: 'Barilla Spaghetti Pasta',
    nameAmharic: 'ባሪላ ፓስታ',
    unit: '500g Pack',
    sizeVolume: '500 g',
    category: 'Pantry Staples',
    brand: 'Barilla',
    prices: [
      { storeName: 'Merkato Central Market', price: 85.0, updated_at: new Date() },
      { storeName: 'FreshMart (Sarbet)', price: 90.0, updated_at: new Date() },
      { storeName: 'Shoa Supermarket (Bole)', price: 95.0, updated_at: new Date() },
      { storeName: 'Bambis Supermarket', price: 100.0, updated_at: new Date() },
    ],
  },
  {
    id: 'e8888888-8888-4888-8888-888888888888',
    upc: '088880416008',
    name: 'Pasteurized Fresh Milk 1L',
    nameAmharic: 'ትኩስ ወተት 1L',
    unit: '1L Bottle',
    sizeVolume: '1 L',
    category: 'Dairy & Beverages',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 55.0, updated_at: new Date() },
      { storeName: 'FreshMart (Sarbet)', price: 58.0, updated_at: new Date() },
      { storeName: 'Shoa Supermarket (Bole)', price: 60.0, updated_at: new Date() },
      { storeName: 'Bambis Supermarket', price: 65.0, updated_at: new Date() },
    ],
  },
  {
    id: 'e9999999-9999-4999-8999-999999999999',
    upc: '099990416009',
    name: 'Traditional Shiro Powder',
    nameAmharic: 'የተፈጨ ሺሮ',
    unit: 'Kg',
    sizeVolume: '1 Kg',
    category: 'Pantry Staples',
    brand: 'Ethiopian Local Produce',
    prices: [
      { storeName: 'Merkato Central Market', price: 220.0, updated_at: new Date() },
      { storeName: 'FreshMart (Sarbet)', price: 260.0, updated_at: new Date() },
      { storeName: 'Shoa Supermarket (Bole)', price: 280.0, updated_at: new Date() },
      { storeName: 'Bambis Supermarket', price: 300.0, updated_at: new Date() },
    ],
  },
];

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private formatProduct(product: any) {
    const sortedPrices = (product.prices || [])
      .map((p: any) => ({
        id: p.id,
        storeId: p.storeId || p.store?.id,
        storeName: p.store?.name || p.storeName || 'Local Store',
        price: Number(p.price),
        updated_at: p.updatedAt || p.updated_at,
      }))
      .sort((a: any, b: any) => a.price - b.price);

    return {
      id: product.id,
      upc: product.upc,
      name: product.name,
      nameAmharic: product.nameAmharic || null,
      unit: product.unit || 'Unit',
      sizeVolume: product.sizeVolume || null,
      brand: product.brand?.name || product.brand || null,
      category: product.category?.name || product.category || null,
      imageUrl: product.imageUrl || null,
      prices: sortedPrices,
      cheapestPrice: sortedPrices.length > 0 ? sortedPrices[0].price : null,
      cheapestStore: sortedPrices.length > 0 ? sortedPrices[0].storeName : null,
    };
  }

  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          brand: true,
          category: true,
          prices: {
            include: {
              store: true,
            },
            orderBy: {
              price: 'asc',
            },
          },
        },
      });

      if (products && products.length > 0) {
        return {
          status: 'success',
          count: products.length,
          data: products.map((p) => this.formatProduct(p)),
        };
      }
    } catch (error) {
      this.logger.warn(`Database query failed for getAllProducts. Using mock fallback. Reason: ${error.message}`);
    }

    return {
      status: 'success',
      count: MOCK_ETHIOPIAN_PRODUCTS.length,
      data: MOCK_ETHIOPIAN_PRODUCTS.map((p) => this.formatProduct(p)),
    };
  }

  async searchProducts(query?: string) {
    if (!query || query.trim() === '') {
      return this.getAllProducts();
    }

    const cleanQuery = query.trim();

    try {
      const products = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery, mode: 'insensitive' } },
            { nameAmharic: { contains: cleanQuery, mode: 'insensitive' } },
          ],
        },
        include: {
          brand: true,
          category: true,
          prices: {
            include: {
              store: true,
            },
            orderBy: {
              price: 'asc',
            },
          },
        },
      });

      if (products) {
        return {
          status: 'success',
          query: cleanQuery,
          count: products.length,
          data: products.map((p) => this.formatProduct(p)),
        };
      }
    } catch (error) {
      this.logger.warn(`Database query failed for searchProducts. Using mock filter. Reason: ${error.message}`);
    }

    const filtered = MOCK_ETHIOPIAN_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        (p.nameAmharic && p.nameAmharic.includes(cleanQuery)),
    );

    return {
      status: 'success',
      query: cleanQuery,
      count: filtered.length,
      data: filtered.map((p) => this.formatProduct(p)),
    };
  }

  async getProductByUpc(upc: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { upc },
        include: {
          brand: true,
          category: true,
          prices: {
            include: {
              store: true,
            },
            orderBy: {
              price: 'asc',
            },
          },
        },
      });

      if (product) {
        return {
          status: 'success',
          data: this.formatProduct(product),
        };
      }
    } catch (error) {
      this.logger.warn(`Database query failed for scan barcode. Using mock fallback. Reason: ${error.message}`);
    }

    const mockProduct = MOCK_ETHIOPIAN_PRODUCTS.find((p) => p.upc === upc);
    if (!mockProduct) {
      throw new NotFoundException(`Product with barcode/UPC ${upc} was not found in the catalog.`);
    }

    return {
      status: 'success',
      data: this.formatProduct(mockProduct),
    };
  }

  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          brand: true,
          category: true,
          prices: {
            include: {
              store: true,
            },
            orderBy: {
              price: 'asc',
            },
          },
        },
      });

      if (product) {
        return {
          status: 'success',
          data: this.formatProduct(product),
        };
      }
    } catch (error) {
      this.logger.warn(`Database query failed for getProductById. Using mock fallback. Reason: ${error.message}`);
    }

    const mockProduct = MOCK_ETHIOPIAN_PRODUCTS.find((p) => p.id === id);
    if (!mockProduct) {
      throw new NotFoundException(`Product with ID ${id} was not found.`);
    }

    return {
      status: 'success',
      data: this.formatProduct(mockProduct),
    };
  }
}
