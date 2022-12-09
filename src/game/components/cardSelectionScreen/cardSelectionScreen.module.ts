import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import {
    CardSelectionScreen,
} from './cardSelectionScreen.schema';
import { CardSelectionScreenService } from './cardSelectionScreen.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            CardSelectionScreen,
        ]),
    ],
    providers: [CardSelectionScreenService],
    exports: [CardSelectionScreenService],
})
export class CardSelectionScreenModule { }
