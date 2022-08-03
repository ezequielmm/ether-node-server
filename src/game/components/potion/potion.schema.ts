import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { getRandomEnumValue } from 'src/utils';
import { PotionRarityEnum } from './potion.enum';

export type PotionDocument = Potion & Document;

@Schema({
    collection: 'potions',
})
export class Potion {
    @Prop(() => 'potion')
    name: string;

    @Prop(() => true)
    @Prop()
    usable: boolean;

    @Factory(() => getRandomEnumValue(PotionRarityEnum))
    @Prop()
    rarity: PotionRarityEnum;

    @Factory('Future description')
    @Prop()
    description: string;
}

export const PotionSchema = SchemaFactory.createForClass(Potion);
