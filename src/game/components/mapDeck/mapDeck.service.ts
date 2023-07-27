import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { MapDeck } from './mapDeck.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class MapDeckService {
    constructor(
        @InjectModel(MapDeck)
        private readonly mapDeck: ReturnModelType<typeof MapDeck>,
    ) {}

    async findById(id: string): Promise<MapDeck> {
        return await this.mapDeck.findById(id);
    }
}