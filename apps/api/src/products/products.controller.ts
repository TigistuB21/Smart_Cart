import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}
  
  @Get('scan/:upc')
  async scanBarcode(@Param('upc') upc: string) {
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

    if (!product) {
      throw new NotFoundException(`Product with UPC ${upc} was not found in our comparison catalog.`);
    }

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

  @Get(':id/prices')
  async getProductPrices(@Param('id') id: string) {
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

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} was not found.`);
    }

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
}
