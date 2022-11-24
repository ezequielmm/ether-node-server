import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ChestSizeEnum } from './chest.enum';

export type ChestDocument = HydratedDocument<Chest>;

@Schema({
    collection: 'chests',
    versionKey: false,
})
export class Chest {
    @Prop()
    name: string;

    @Prop()
    chance: number;

    @Prop({ type: String, enum: ChestSizeEnum })
    size: ChestSizeEnum;

    @Prop()
    coinChance: number;

    @Prop()
    minCoins: number;

    @Prop()
    maxCoins: number;

    @Prop()
    potionChance: number;
}

export const ChestSchema = SchemaFactory.createForClass(Chest);
