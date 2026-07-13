import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { ListsController } from './lists/lists.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [ProductsController, ListsController],
  providers: [PrismaService],
})
export class AppModule {}
