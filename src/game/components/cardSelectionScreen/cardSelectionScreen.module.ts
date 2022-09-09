import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    CardSelectionScreen,
    CardSelectionScreenSchema,
} from './cardSelectionScreen.schema';
import { CardSelectionScreenService } from './cardSelectionScreen.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: CardSelectionScreen.name,
                schema: CardSelectionScreenSchema,
            },
        ]),
    ],
    providers: [CardSelectionScreenService],
    exports: [CardSelectionScreenService],
})
export class CardSelectionScreenModule {}
