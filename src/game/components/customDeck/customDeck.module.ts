import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CustomDeck } from './customDeck.schema';
import { CustomDeckService } from './customDeck.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            CustomDeck,
        ]),
    ],
    providers: [CustomDeckService],
    exports: [CustomDeckService],
})
export class CustomDeckModule {}
