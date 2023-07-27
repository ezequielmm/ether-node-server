import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { MapDeck } from './mapDeck.schema';
import { MapDeckService } from './mapDeck.service';

@Module({
    imports: [KindagooseModule.forFeature([MapDeck])],
    providers: [MapDeckService],
    exports: [MapDeckService],
})
export class MapDeckModule {}