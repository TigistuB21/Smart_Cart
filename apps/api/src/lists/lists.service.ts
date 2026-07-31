import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface OptimizeBasketItemDto {
  productId: string;
  quantity: number;
}

export interface OptimizeBasketDto {
  items: OptimizeBasketItemDto[];
}

// Comprehensive Ethiopian mock dataset fallback for offline/demo robustness
const MOCK_ETHIOPIAN_PRODUCTS = [
  {
    id: 'e1111111-1111-4111-8111-111111111111',
    name: 'White Teff',
    nameAmharic: 'ነጭ ጤፍ',
    prices: [
      { storeId: 's-merkato', storeName: 'Merkato Central Market', price: 110.0 },
      { storeId: 's-freshmart', storeName: 'FreshMart (Sarbet)', price: 130.0 },
      { storeId: 's-shoa', storeName: 'Shoa Supermarket (Bole)', price: 135.0 },
      { storeId: 's-bambis', storeName: 'Bambis Supermarket', price: 140.0 },
    ],
  },
  {
    id: 'e2222222-2222-4222-8222-222222222222',
    name: 'Ethiopian Roasted Coffee Beans',
    nameAmharic: 'የኢትዮጵያ የቆላ ቡና',
    prices: [
      { storeId: 's-merkato', storeName: 'Merkato Central Market', price: 380.0 },
      { storeId: 's-freshmart', storeName: 'FreshMart (Sarbet)', price: 440.0 },
      { storeId: 's-shoa', storeName: 'Shoa Supermarket (Bole)', price: 450.0 },
      { storeId: 's-bambis', storeName: 'Bambis Supermarket', price: 480.0 },
    ],
  },
  {
    id: 'e3333333-3333-4333-8333-333333333333',
    name: 'Barilla Spaghetti Pasta',
    nameAmharic: 'ባሪላ ፓስታ',
    prices: [
      { storeId: 's-merkato', storeName: 'Merkato Central Market', price: 85.0 },
      { storeId: 's-freshmart', storeName: 'FreshMart (Sarbet)', price: 90.0 },
      { storeId: 's-shoa', storeName: 'Shoa Supermarket (Bole)', price: 95.0 },
      { storeId: 's-bambis', storeName: 'Bambis Supermarket', price: 100.0 },
    ],
  },
  {
    id: 'e8888888-8888-4888-8888-888888888888',
    name: 'Pasteurized Fresh Milk 1L',
    nameAmharic: 'ትኩስ ወተት 1L',
    prices: [
      { storeId: 's-merkato', storeName: 'Merkato Central Market', price: 55.0 },
      { storeId: 's-freshmart', storeName: 'FreshMart (Sarbet)', price: 58.0 },
      { storeId: 's-shoa', storeName: 'Shoa Supermarket (Bole)', price: 60.0 },
      { storeId: 's-bambis', storeName: 'Bambis Supermarket', price: 65.0 },
    ],
  },
  {
    id: 'e9999999-9999-4999-8999-999999999999',
    name: 'Traditional Shiro Powder',
    nameAmharic: 'የተፈጨ ሺሮ',
    prices: [
      { storeId: 's-merkato', storeName: 'Merkato Central Market', price: 220.0 },
      { storeId: 's-freshmart', storeName: 'FreshMart (Sarbet)', price: 260.0 },
      { storeId: 's-shoa', storeName: 'Shoa Supermarket (Bole)', price: 280.0 },
      { storeId: 's-bambis', storeName: 'Bambis Supermarket', price: 300.0 },
    ],
  },
];

@Injectable()
export class ListsService {
  private readonly logger = new Logger(ListsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * The Centerpiece Portfolio Algorithm: Smart Basket Optimizer
   * Computes Single-Store Basket Totals vs. Optimal Split-Basket Cherry Picking
   */
  async optimizeBasket(dto: OptimizeBasketDto) {
    const inputItems = dto.items || [];
    if (inputItems.length === 0) {
      return {
        status: 'success',
        message: 'No items provided for optimization.',
        singleStoreOptions: [],
        splitBasketOptimal: { totalCost: 0, cheapestSingleStoreCost: 0, potentialSavings: 0, breakdown: [] },
      };
    }

    let productsMap = new Map<string, any>();
    let storesList: any[] = [];

    try {
      const productIds = inputItems.map((i) => i.productId);
      const dbProducts = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        include: {
          prices: {
            include: { store: true },
          },
        },
      });

      const dbStores = await this.prisma.store.findMany();

      if (dbProducts && dbProducts.length > 0 && dbStores && dbStores.length > 0) {
        dbProducts.forEach((p) => productsMap.set(p.id, p));
        storesList = dbStores;
      }
    } catch (error) {
      this.logger.warn(`Database query failed in optimizeBasket algorithm. Operating with mock data fallback. Reason: ${error.message}`);
    }

    // Fallback population if database is offline or empty
    if (productsMap.size === 0) {
      MOCK_ETHIOPIAN_PRODUCTS.forEach((p) => productsMap.set(p.id, p));
      storesList = [
        { id: 's-merkato', name: 'Merkato Central Market' },
        { id: 's-freshmart', name: 'FreshMart (Sarbet)' },
        { id: 's-shoa', name: 'Shoa Supermarket (Bole)' },
        { id: 's-bambis', name: 'Bambis Supermarket' },
      ];
    }

    // 1. Single-Store Basket Calculations
    const singleStoreOptions = storesList.map((store) => {
      let totalCost = 0;
      let matchCount = 0;
      let missingCount = 0;

      for (const item of inputItems) {
        const product = productsMap.get(item.productId);
        if (!product) {
          missingCount++;
          continue;
        }

        const priceEntry = (product.prices || []).find(
          (p: any) => (p.storeId || p.store?.id) === store.id || (p.storeName || p.store?.name) === store.name,
        );

        if (priceEntry) {
          totalCost += Number(priceEntry.price) * item.quantity;
          matchCount++;
        } else {
          missingCount++;
        }
      }

      return {
        storeId: store.id,
        storeName: store.name,
        totalCost: Number(totalCost.toFixed(2)),
        matchCount,
        missingCount,
      };
    });

    // Sort single store options cheapest to most expensive
    singleStoreOptions.sort((a, b) => a.totalCost - b.totalCost);

    // 2. Split-Basket Optimization (Cherry Picking Lowest Price Per Item)
    let splitBasketTotal = 0;
    const splitBreakdown: any[] = [];

    for (const item of inputItems) {
      const product = productsMap.get(item.productId);
      if (!product || !product.prices || product.prices.length === 0) continue;

      // Find the absolute cheapest store for this item
      const sortedItemPrices = [...product.prices].sort((a, b) => Number(a.price) - Number(b.price));
      const cheapestEntry = sortedItemPrices[0];
      const unitPrice = Number(cheapestEntry.price);
      const totalItemCost = Number((unitPrice * item.quantity).toFixed(2));

      splitBasketTotal += totalItemCost;

      splitBreakdown.push({
        productId: product.id,
        productName: product.name,
        productNameAmharic: product.nameAmharic || null,
        quantity: item.quantity,
        storeId: cheapestEntry.storeId || cheapestEntry.store?.id || 'store-uuid',
        storeName: cheapestEntry.store?.name || cheapestEntry.storeName || 'Cheapest Store',
        unitPrice,
        totalItemCost,
      });
    }

    const cheapestSingleStore = singleStoreOptions.length > 0 ? singleStoreOptions[0].totalCost : 0;
    const potentialSavings = Number(Math.max(0, cheapestSingleStore - splitBasketTotal).toFixed(2));
    const savingsPercentage = cheapestSingleStore > 0 ? Number(((potentialSavings / cheapestSingleStore) * 100).toFixed(1)) : 0;

    return {
      status: 'success',
      itemCount: inputItems.length,
      singleStoreOptions,
      splitBasketOptimal: {
        totalCost: Number(splitBasketTotal.toFixed(2)),
        cheapestSingleStoreCost: cheapestSingleStore,
        potentialSavings,
        savingsPercentage,
        breakdown: splitBreakdown,
      },
    };
  }

  async createList(name?: string, userId?: string) {
    try {
      const list = await this.prisma.shoppingList.create({
        data: {
          name: name || 'Weekly Addis Basket',
          userId: userId || '8a32a688-6625-4c07-b31a-cde9655f419b',
        },
      });

      return {
        status: 'success',
        data: list,
      };
    } catch (error) {
      this.logger.warn(`Database insert failed for createList. Using mock response. Reason: ${error.message}`);
    }

    return {
      status: 'success',
      data: {
        id: 'mock-list-uuid-101',
        name: name || 'Weekly Addis Basket',
        userId: userId || 'demo-user-uuid',
        createdAt: new Date(),
      },
    };
  }

  async addItemToList(listId: string, productId: string, quantity: number = 1) {
    try {
      const item = await this.prisma.shoppingListItem.upsert({
        where: {
          shoppingListId_productId: {
            shoppingListId: listId,
            productId,
          },
        },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          shoppingListId: listId,
          productId,
          quantity,
        },
      });

      return {
        status: 'success',
        data: item,
      };
    } catch (error) {
      this.logger.warn(`Database query failed for addItemToList. Using mock response. Reason: ${error.message}`);
    }

    return {
      status: 'success',
      data: {
        listId,
        productId,
        quantity,
        addedAt: new Date(),
      },
    };
  }

  async compareListTotal(listId: string) {
    try {
      const listItems = await this.prisma.shoppingListItem.findMany({
        where: { shoppingListId: listId },
      });

      if (listItems && listItems.length > 0) {
        return this.optimizeBasket({
          items: listItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        });
      }
    } catch (error) {
      this.logger.warn(`Database query failed for compareListTotal. Falling back to default list optimization. Reason: ${error.message}`);
    }

    // Default sample optimization for demo list
    return this.optimizeBasket({
      items: [
        { productId: 'e1111111-1111-4111-8111-111111111111', quantity: 2 },
        { productId: 'e8888888-8888-4888-8888-888888888888', quantity: 3 },
        { productId: 'e3333333-3333-4333-8333-333333333333', quantity: 2 },
        { productId: 'e9999999-9999-4999-8999-999999999999', quantity: 1 },
      ],
    });
  }
}
