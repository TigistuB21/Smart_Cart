import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ListsModule } from './lists/lists.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ProductsModule, ListsModule],
  providers: [PrismaService],
})
export class AppModule {}
