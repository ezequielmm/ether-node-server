import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { UniqueNameOnCardPoolsTableRule } from 'src/validators/uniqueNameOnCardPoolsTable.rule';
import { CardPoolController } from './cardpool.controller';
import { CardPoolService } from './cardpool.service';

@Module({
    imports: [PrismaModule],
    controllers: [CardPoolController],
    providers: [CardPoolService, UniqueNameOnCardPoolsTableRule],
    exports: [CardPoolService],
})
export class CardPoolModule {}
