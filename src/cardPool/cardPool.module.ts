import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UniqueNameOnCardPoolsTableRule } from 'src/validators/uniqueNameOnCardPoolsTable.validator';
import { CardPoolController } from './cardPool.controller';
import { CardPoolService } from './cardPool.service';

@Module({
    controllers: [CardPoolController],
    providers: [PrismaService, CardPoolService, UniqueNameOnCardPoolsTableRule],
    exports: [CardPoolService],
})
export class CardPoolModule {}
