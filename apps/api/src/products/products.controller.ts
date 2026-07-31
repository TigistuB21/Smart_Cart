import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('search')
  async searchProducts(@Query('q') query?: string) {
    return this.productsService.searchProducts(query);
  }

  @Get('scan/:upc')
  async scanBarcode(@Param('upc') upc: string) {
    return this.productsService.getProductByUpc(upc);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}
