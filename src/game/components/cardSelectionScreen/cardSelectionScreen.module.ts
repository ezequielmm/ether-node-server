import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import {
    CardSelectionScreen,
} from './cardSelectionScreen.schema';
import { CardSelectionScreenService } from './cardSelectionScreen.service';

@Module({
    imports: [
        KindagooseModule.forFeature([
            CardSelectionScreen,
        ]),
    ],
    providers: [CardSelectionScreenService],
    exports: [CardSelectionScreenService],
})
export class CardSelectionScreenModule { }
