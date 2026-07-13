import { Controller, Get, Param, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const MOCK_PRODUCTS = [
  {
    id: 'd3f66b5b-21d3-461d-8ee3-8a39e8d19760',
    upc: '011110416001',
    name: 'Organic Whole Milk',
    brand: 'FreshField',
    category: 'Dairy',
    sizeVolume: '1 Gallon',
    prices: [
      { storeName: 'FreshMart Downtown', price: 4.89, updated_at: new Date() },
      { storeName: 'SuperSave West', price: 4.49, updated_at: new Date() },
    ],
  },
  {
    id: 'a8b792e3-2287-43cf-bc9e-64c8c7c919d3',
    upc: '022220416002',
    name: 'Spaghetti Pasta 16oz',
    brand: 'Pastafari',
    category: 'Pantry',
    sizeVolume: '16 oz',
    prices: [
      { storeName: 'FreshMart Downtown', price: 1.29, updated_at: new Date() },
      { storeName: 'SuperSave West', price: 0.99, updated_at: new Date() },
    ],
  },
  {
    id: 'e1d2c3b4-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
    upc: '033330416003',
    name: 'Creamy Peanut Butter',
    brand: 'NuttyDelight',
    category: 'Pantry',
    sizeVolume: '18 oz',
    prices: [
      { storeName: 'FreshMart Downtown', price: 3.49, updated_at: new Date() },
      { storeName: 'SuperSave West', price: 3.29, updated_at: new Date() },
    ],
  },
];

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly prisma: PrismaService) {}
  
  @Get('scan/:upc')
  async scanBarcode(@Param('upc') upc: string) {
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
          },
        },
      });

      if (product) {
        return {
          status: 'success',
          data: {
            id: product.id,
            upc: product.upc,
            name: product.name,
            brand: product.brand?.name || null,
            category: product.category?.name || null,
            sizeVolume: product.sizeVolume,
            prices: product.prices.map(p => ({
              storeName: p.store.name,
              price: Number(p.price),
              updated_at: p.updatedAt,
            })),
          },
        };
      }
    } catch (error) {
      this.logger.warn(`Database query failed for barcode scan. Falling back to mock data. Reason: ${error.message}`);
    }

    // Fallback to mock data
    const mockProduct = MOCK_PRODUCTS.find(p => p.upc === upc);
    if (!mockProduct) {
      throw new NotFoundException(`Product with UPC ${upc} was not found in our comparison catalog.`);
    }
    return {
      status: 'success',
      data: mockProduct,
    };
  }

  @Get(':id/prices')
  async getProductPrices(@Param('id') id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          brand: true,
          prices: {
            include: {
              store: true,
            },
          },
        },
      });

      if (product) {
        return {
          status: 'success',
          data: {
            productId: product.id,
            name: product.name,
            brand: product.brand?.name || null,
            prices: product.prices.map(p => ({
              storeName: p.store.name,
              price: Number(p.price),
              updated_at: p.updatedAt,
            })),
          },
        };
      }
    } catch (error) {
      this.logger.warn(`Database query failed for product prices. Falling back to mock data. Reason: ${error.message}`);
    }

    // Fallback to mock data
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === id);
    if (!mockProduct) {
      throw new NotFoundException(`Product with ID ${id} was not found.`);
    }
    return {
      status: 'success',
      data: {
        productId: mockProduct.id,
        name: mockProduct.name,
        brand: mockProduct.brand,
        prices: mockProduct.prices,
      },
    };
  }
}
