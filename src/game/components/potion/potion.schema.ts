import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { PotionRarityEnum } from './potion.enum';

export type PotionDocument = HydratedDocument<Potion>;

@Schema({
    collection: 'potions',
    versionKey: false,
})
export class Potion {
    @Prop()
    potionId: number;

    @Prop()
    name: string;

    @Prop({ type: String, enum: PotionRarityEnum })
    rarity: PotionRarityEnum;

    @Prop()
    description: string;

    @Prop()
    effects: JsonEffect[];

    @Prop()
    usableOutsideCombat: boolean;

    @Prop({ default: false })
    showPointer: boolean;

    @Prop()
    isActive: boolean;
}

export const PotionSchema = SchemaFactory.createForClass(Potion);
