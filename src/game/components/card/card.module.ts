import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionModule } from 'src/game/action/action.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Card, CardSchema } from './card.schema';
import { CardService } from './card.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Card.name,
                schema: CardSchema,
            },
        ]),
        forwardRef(() => ActionModule),
        forwardRef(() => ExpeditionModule),
    ],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule {}
