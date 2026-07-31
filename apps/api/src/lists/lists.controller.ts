import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ListsService, OptimizeBasketDto } from './lists.service';

interface CreateListBody {
  name?: string;
  userId?: string;
}

interface AddItemBody {
  productId: string;
  quantity?: number;
}

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post('optimize')
  async optimizeBasket(@Body() dto: OptimizeBasketDto) {
    return this.listsService.optimizeBasket(dto);
  }

  @Post()
  async createList(@Body() body: CreateListBody) {
    return this.listsService.createList(body.name, body.userId);
  }

  @Post(':id/items')
  async addItemToList(@Param('id') id: string, @Body() body: AddItemBody) {
    return this.listsService.addItemToList(id, body.productId, body.quantity || 1);
  }

  @Get(':id/compare')
  async compareListTotal(@Param('id') id: string) {
    return this.listsService.compareListTotal(id);
  }
}
