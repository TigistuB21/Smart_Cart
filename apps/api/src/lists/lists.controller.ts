import { Controller, Post, Body, Param, Get } from '@nestjs/common';

interface CreateListDto {
  name: string;
  userId: string;
}

interface AddItemDto {
  productId: string;
  quantity: number;
}

@Controller('lists')
export class ListsController {
  
  @Post()
  async createList(@Body() body: CreateListDto) {
    return {
      status: 'success',
      data: {
        id: 'mock-list-uuid-101',
        name: body.name || 'My Grocery List',
        userId: body.userId || 'mock-user-uuid',
        createdAt: new Date(),
      },
    };
  }

  @Post(':id/items')
  async addItemToList(@Param('id') listId: string, @Body() body: AddItemDto) {
    return {
      status: 'success',
      data: {
        listId,
        productId: body.productId,
        quantity: body.quantity || 1,
        addedAt: new Date(),
      },
    };
  }

  @Get(':id/compare')
  async compareBasketTotal(@Param('id') listId: string) {
    // Computes comparison mocks showing store basket totals
    return {
      status: 'success',
      data: {
        listId,
        comparisons: [
          { storeName: 'FreshMart', totalBasketCost: 6.18, matchCount: 2, missingCount: 0 },
          { storeName: 'SuperSave', totalBasketCost: 5.48, matchCount: 2, missingCount: 0 },
        ],
      },
    };
  }
}
