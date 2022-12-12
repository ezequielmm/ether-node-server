import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { CustomDeck } from './customDeck.schema';
import { CustomDeckService } from './customDeck.service';

@Module({
    imports: [
        KindagooseModule.forFeature([
            CustomDeck,
        ]),
    ],
    providers: [CustomDeckService],
    exports: [CustomDeckService],
})
export class CustomDeckModule { }
