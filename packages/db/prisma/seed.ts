import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Enable PostGIS extension (required for location)
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);

  // 2. Clear existing records to ensure idempotency
  await prisma.priceHistory.deleteMany();
  await prisma.price.deleteMany();
  await prisma.shoppingListItem.deleteMany();
  await prisma.shoppingList.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.priceAlert.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();

  // 3. Create Brands
  const freshField = await prisma.brand.create({ data: { name: 'FreshField' } });
  const pastafari = await prisma.brand.create({ data: { name: 'Pastafari' } });
  const nuttyDelight = await prisma.brand.create({ data: { name: 'NuttyDelight' } });

  // 4. Create Categories
  const dairy = await prisma.category.create({ data: { name: 'Dairy' } });
  const pantry = await prisma.category.create({ data: { name: 'Pantry' } });

  // 5. Create Products
  const milk = await prisma.product.create({
    data: {
      id: 'd3f66b5b-21d3-461d-8ee3-8a39e8d19760',
      upc: '011110416001',
      name: 'Organic Whole Milk',
      sizeVolume: '1 Gallon',
      brandId: freshField.id,
      categoryId: dairy.id,
    },
  });

  const pasta = await prisma.product.create({
    data: {
      id: 'a8b792e3-2287-43cf-bc9e-64c8c7c919d3',
      upc: '022220416002',
      name: 'Spaghetti Pasta 16oz',
      sizeVolume: '16 oz',
      brandId: pastafari.id,
      categoryId: pantry.id,
    },
  });

  const peanutButter = await prisma.product.create({
    data: {
      id: 'e1d2c3b4-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
      upc: '033330416003',
      name: 'Creamy Peanut Butter',
      sizeVolume: '18 oz',
      brandId: nuttyDelight.id,
      categoryId: pantry.id,
    },
  });

  // 6. Create Stores (using raw SQL for location column)
  const store1Id = 'c1a96756-11f4-411a-8bb7-08bb39a16f9f';
  const store2Id = 'd8204620-3b47-4a0b-93ff-183e20decfd2';

  await prisma.$executeRawUnsafe(`
    INSERT INTO stores (id, name, chain_name, address, zip_code, location)
    VALUES (
      '${store1Id}', 
      'FreshMart Downtown', 
      'FreshMart', 
      '123 Main St, Metro City', 
      '10001', 
      ST_GeomFromText('POINT(-73.935242 40.730610)', 4326)::geography
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO stores (id, name, chain_name, address, zip_code, location)
    VALUES (
      '${store2Id}', 
      'SuperSave West', 
      'SuperSave', 
      '456 Broad St, Metro City', 
      '10002', 
      ST_GeomFromText('POINT(-73.998242 40.750610)', 4326)::geography
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  // 7. Create Prices
  await prisma.price.createMany({
    data: [
      { storeId: store1Id, productId: milk.id, price: 4.89 },
      { storeId: store1Id, productId: pasta.id, price: 1.29 },
      { storeId: store1Id, productId: peanutButter.id, price: 3.49 },
      { storeId: store2Id, productId: milk.id, price: 4.49 },
      { storeId: store2Id, productId: pasta.id, price: 0.99 },
      { storeId: store2Id, productId: peanutButter.id, price: 3.29 },
    ],
  });

  // 8. Create Price History
  await prisma.priceHistory.createMany({
    data: [
      { time: new Date(), storeId: store1Id, productId: milk.id, price: 4.89 },
      { time: new Date(), storeId: store1Id, productId: pasta.id, price: 1.29 },
      { time: new Date(), storeId: store1Id, productId: peanutButter.id, price: 3.49 },
      { time: new Date(), storeId: store2Id, productId: milk.id, price: 4.49 },
      { time: new Date(), storeId: store2Id, productId: pasta.id, price: 0.99 },
      { time: new Date(), storeId: store2Id, productId: peanutButter.id, price: 3.29 },
    ],
  });

  // 9. Create Default User
  const userId = '8a32a688-6625-4c07-b31a-cde9655f419b';
  await prisma.user.create({
    data: {
      id: userId,
      email: 'user@example.com',
      displayName: 'Jane Doe',
    },
  });

  // 10. Create Default Shopping List
  const list = await prisma.shoppingList.create({
    data: {
      id: '99ee4a4c-1e24-4f81-a67b-232cc22904c0',
      userId: userId,
      name: 'My Grocery List',
    },
  });

  // 11. Add Items to Shopping List
  await prisma.shoppingListItem.createMany({
    data: [
      { shoppingListId: list.id, productId: milk.id, quantity: 1 },
      { shoppingListId: list.id, productId: pasta.id, quantity: 2 },
    ],
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
