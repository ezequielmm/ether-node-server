import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { JsonStatus } from 'src/game/status/interfaces';
import { PotionRarityEnum } from './potion.enum';

export type PotionDocument = Potion & Document;

@Schema({
    collection: 'potions',
})
export class Potion {
    @Prop()
    potionId: number;

    @Prop()
    name: string;

    @Prop()
    rarity: PotionRarityEnum;

    @Prop()
    description: string;

    @Prop()
    effects: JsonEffect[];

    @Prop()
    statuses: JsonStatus[];

    @Prop()
    usableOutsideCombat: boolean;

    @Prop({ default: false })
    showPointer: boolean;
}

export const PotionSchema = SchemaFactory.createForClass(Potion);
