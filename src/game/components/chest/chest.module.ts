import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chest, ChestSchema } from './chest.schema';
import { ChestService } from './chest.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Chest.name,
                schema: ChestSchema,
            },
        ]),
    ],
    providers: [ChestService],
    exports: [ChestService],
})
export class ChestModule {}
