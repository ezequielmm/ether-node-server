import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { PotionRarityEnum } from './enums';
import { getRandomEnumValue } from 'src/utils';

export type PotionDocument = Potion & Document;

@Schema()
export class Potion {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    name: string;

    @Factory((faker: Faker) => faker.datatype.boolean())
    @Prop()
    usable: boolean;

    @Factory(() => {
        return getRandomEnumValue(PotionRarityEnum);
    })
    @Prop()
    rarity: PotionRarityEnum;

    @Factory('Deal $prop.damage.current$ damage to target')
    @Prop()
    description: string;

    @Factory('Deal $prop.damage.current$ damage to target')
    @Prop()
    effect: any;
}

export const PotionSchema = SchemaFactory.createForClass(Potion);
