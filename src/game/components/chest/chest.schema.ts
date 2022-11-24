import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TreasureTypeEnum } from 'src/game/treasure/treasure.enum';
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

    @Prop()
    trappedChance: number;

    @Prop({ type: String, enum: TreasureTypeEnum })
    trappedType: TreasureTypeEnum;
}

export const ChestSchema = SchemaFactory.createForClass(Chest);
