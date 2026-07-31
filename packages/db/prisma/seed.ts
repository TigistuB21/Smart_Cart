import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Smart Cart Ethiopia database seed...');

  // 1. Clear existing records to ensure idempotency
  await prisma.priceHistory.deleteMany();
  await prisma.price.deleteMany();
  await prisma.shoppingListItem.deleteMany();
  await prisma.shoppingList.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();

  // 2. Create Categories
  const grainsCategory = await prisma.category.create({ data: { name: 'Grains & Flour' } });
  const pantryCategory = await prisma.category.create({ data: { name: 'Pantry Staples' } });
  const produceCategory = await prisma.category.create({ data: { name: 'Fresh Produce' } });
  const dairyCategory = await prisma.category.create({ data: { name: 'Dairy & Beverages' } });

  // 3. Create Brands
  const localBrand = await prisma.brand.create({ data: { name: 'Ethiopian Local Produce' } });
  const barillaBrand = await prisma.brand.create({ data: { name: 'Barilla' } });
  const abyssiniaBrand = await prisma.brand.create({ data: { name: 'Abyssinia' } });

  // 4. Create Stores (Simulated Ethiopian Supermarkets and Local Markets)
  const shoaStore = await prisma.store.create({
    data: {
      name: 'Shoa Supermarket (Bole)',
      chainName: 'Shoa Supermarket',
      city: 'Addis Ababa',
      address: 'Bole Road, near Atlas',
      latitude: 8.9984,
      longitude: 38.7865,
    },
  });

  const merkatoStore = await prisma.store.create({
    data: {
      name: 'Merkato Central Market',
      chainName: 'Traditional Market',
      city: 'Addis Ababa',
      address: 'Addis Ketema, Merkato',
      latitude: 9.0305,
      longitude: 38.7400,
    },
  });

  const bambisStore = await prisma.store.create({
    data: {
      name: 'Bambis Supermarket',
      chainName: 'Bambis Supermarket',
      city: 'Addis Ababa',
      address: 'Kazanchis, Jomo Kenyatta St',
      latitude: 9.0150,
      longitude: 38.7670,
    },
  });

  const freshmartStore = await prisma.store.create({
    data: {
      name: 'FreshMart (Sarbet)',
      chainName: 'FreshMart',
      city: 'Addis Ababa',
      address: 'Sarbet, South Africa St',
      latitude: 8.9910,
      longitude: 38.7480,
    },
  });

  // 5. Create Ethiopian Products
  const productsData = [
    {
      id: 'e1111111-1111-4111-8111-111111111111',
      upc: '011110416001',
      name: 'White Teff',
      nameAmharic: 'ነጭ ጤፍ',
      unit: 'Kg',
      sizeVolume: '1 Kg',
      categoryId: grainsCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 135.00 },
        { storeId: merkatoStore.id, price: 110.00 },
        { storeId: bambisStore.id, price: 140.00 },
        { storeId: freshmartStore.id, price: 130.00 },
      ],
    },
    {
      id: 'e2222222-2222-4222-8222-222222222222',
      upc: '022220416002',
      name: 'Ethiopian Roasted Coffee Beans',
      nameAmharic: 'የኢትዮጵያ የቆላ ቡና',
      unit: 'Kg',
      sizeVolume: '1 Kg',
      categoryId: pantryCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 450.00 },
        { storeId: merkatoStore.id, price: 380.00 },
        { storeId: bambisStore.id, price: 480.00 },
        { storeId: freshmartStore.id, price: 440.00 },
      ],
    },
    {
      id: 'e3333333-3333-4333-8333-333333333333',
      upc: '033330416003',
      name: 'Barilla Spaghetti Pasta',
      nameAmharic: 'ባሪላ ፓስታ',
      unit: '500g Pack',
      sizeVolume: '500 g',
      categoryId: pantryCategory.id,
      brandId: barillaBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 95.00 },
        { storeId: merkatoStore.id, price: 85.00 },
        { storeId: bambisStore.id, price: 100.00 },
        { storeId: freshmartStore.id, price: 90.00 },
      ],
    },
    {
      id: 'e4444444-4444-4444-8444-444444444444',
      upc: '044440416004',
      name: 'Sunflower Cooking Oil 5L',
      nameAmharic: 'የሱፍ የምግብ ዘይት 5L',
      unit: '5L Bottle',
      sizeVolume: '5 L',
      categoryId: pantryCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 920.00 },
        { storeId: merkatoStore.id, price: 850.00 },
        { storeId: bambisStore.id, price: 960.00 },
        { storeId: freshmartStore.id, price: 900.00 },
      ],
    },
    {
      id: 'e5555555-5555-4555-8555-555555555555',
      upc: '055550416005',
      name: 'Red Onions',
      nameAmharic: 'ቀይ ሽንኩርት',
      unit: 'Kg',
      sizeVolume: '1 Kg',
      categoryId: produceCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 65.00 },
        { storeId: merkatoStore.id, price: 45.00 },
        { storeId: bambisStore.id, price: 70.00 },
        { storeId: freshmartStore.id, price: 60.00 },
      ],
    },
    {
      id: 'e6666666-6666-4666-8666-666666666666',
      upc: '066660416006',
      name: 'White Sugar',
      nameAmharic: 'ስኳር',
      unit: '2Kg Pack',
      sizeVolume: '2 Kg',
      categoryId: pantryCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 180.00 },
        { storeId: merkatoStore.id, price: 160.00 },
        { storeId: bambisStore.id, price: 190.00 },
        { storeId: freshmartStore.id, price: 175.00 },
      ],
    },
    {
      id: 'e7777777-7777-4777-8777-777777777777',
      upc: '077770416007',
      name: 'Ethiopian Berbere Spice Blend',
      nameAmharic: 'የሃበሻ በርበሬ',
      unit: '500g Pack',
      sizeVolume: '500 g',
      categoryId: pantryCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 220.00 },
        { storeId: merkatoStore.id, price: 180.00 },
        { storeId: bambisStore.id, price: 240.00 },
        { storeId: freshmartStore.id, price: 210.00 },
      ],
    },
    {
      id: 'e8888888-8888-4888-8888-888888888888',
      upc: '088880416008',
      name: 'Pasteurized Fresh Milk 1L',
      nameAmharic: 'ትኩስ ወተት 1L',
      unit: '1L Bottle',
      sizeVolume: '1 L',
      categoryId: dairyCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 60.00 },
        { storeId: merkatoStore.id, price: 55.00 },
        { storeId: bambisStore.id, price: 65.00 },
        { storeId: freshmartStore.id, price: 58.00 },
      ],
    },
    {
      id: 'e9999999-9999-4999-8999-999999999999',
      upc: '099990416009',
      name: 'Traditional Shiro Powder',
      nameAmharic: 'የተፈጨ ሺሮ',
      unit: 'Kg',
      sizeVolume: '1 Kg',
      categoryId: pantryCategory.id,
      brandId: localBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 280.00 },
        { storeId: merkatoStore.id, price: 220.00 },
        { storeId: bambisStore.id, price: 300.00 },
        { storeId: freshmartStore.id, price: 260.00 },
      ],
    },
    {
      id: 'ea101010-1010-4010-8010-101010101010',
      upc: '101010416010',
      name: 'Abyssinia Natural Mineral Water (6x1.5L)',
      nameAmharic: 'አቢሲንያ የሜታ ውሀ (6x1.5L)',
      unit: '6 Pack',
      sizeVolume: '9 L',
      categoryId: dairyCategory.id,
      brandId: abyssiniaBrand.id,
      prices: [
        { storeId: shoaStore.id, price: 150.00 },
        { storeId: merkatoStore.id, price: 130.00 },
        { storeId: bambisStore.id, price: 160.00 },
        { storeId: freshmartStore.id, price: 145.00 },
      ],
    },
  ];

  for (const item of productsData) {
    const { prices, ...productInfo } = item;
    const product = await prisma.product.create({
      data: productInfo,
    });

    for (const p of prices) {
      await prisma.price.create({
        data: {
          storeId: p.storeId,
          productId: product.id,
          price: p.price,
        },
      });

      await prisma.priceHistory.create({
        data: {
          time: new Date(),
          storeId: p.storeId,
          productId: product.id,
          price: p.price,
        },
      });
    }
  }

  // 6. Create Demo User
  const demoUserId = '8a32a688-6625-4c07-b31a-cde9655f419b';
  const demoUser = await prisma.user.create({
    data: {
      id: demoUserId,
      email: 'demo@smartcart.et',
      displayName: 'Abebe Bikila',
    },
  });

  // 7. Create Sample Shopping List for Demo User
  const demoList = await prisma.shoppingList.create({
    data: {
      id: '99ee4a4c-1e24-4f81-a67b-232cc22904c0',
      userId: demoUser.id,
      name: 'Weekly Addis Ababa Basket',
    },
  });

  // Add 1x Teff (Kg), 2x Milk (1L), 1x Spaghetti, 1x Shiro
  await prisma.shoppingListItem.createMany({
    data: [
      { shoppingListId: demoList.id, productId: 'e1111111-1111-4111-8111-111111111111', quantity: 2 },
      { shoppingListId: demoList.id, productId: 'e8888888-8888-4888-8888-888888888888', quantity: 3 },
      { shoppingListId: demoList.id, productId: 'e3333333-3333-4333-8333-333333333333', quantity: 2 },
      { shoppingListId: demoList.id, productId: 'e9999999-9999-4999-8999-999999999999', quantity: 1 },
    ],
  });

  console.log('Smart Cart Ethiopia database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
