import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { getRandomEnumValue } from 'src/utils';
import { PotionRarityEnum } from './potion.enum';

export type PotionDocument = Potion & Document;

@Schema()
export class Potion {
    @Prop(() => 'potion')
    name: string;

    @Prop(() => true)
    @Prop()
    usable: boolean;

    @Factory(() => getRandomEnumValue(PotionRarityEnum))
    @Prop()
    rarity: PotionRarityEnum;

    @Factory('Deal $prop.damage.current$ damage to target')
    @Prop()
    description: string;

    @Factory(() => {
        return {
            properties: {
                effects: {},
            },
        };
    })
    @Prop({ type: Object })
    properties: {
        effects: {
            resolve?: {
                base: number;
            };
        };
    };
}

export const PotionSchema = SchemaFactory.createForClass(Potion);
