import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ListsController],
  providers: [ListsService, PrismaService],
  exports: [ListsService],
})
export class ListsModule {}
