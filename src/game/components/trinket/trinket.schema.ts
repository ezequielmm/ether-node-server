import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { TrinketRarityEnum } from './trinket.enum';

export type TrinketDocument = Trinket & Document;

@Schema({
    collection: 'trinkets',
})
export class Trinket {
    @Prop()
    trinketId: number;

    @Prop()
    name: string;

    @Prop()
    rarity: TrinketRarityEnum;

    @Prop()
    description: string;

    @Prop()
    effects: JsonEffect[];
}

export const TrinketSchema = SchemaFactory.createForClass(Trinket);
