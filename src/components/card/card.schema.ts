import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardClassEnum, CardRarityEnum, CardTypeEnum } from './enums';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { getRandomBetween, getRandomEnumValue } from 'src/utils';

export type CardDocument = Card & Document;

@Schema()
export class Card {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    name: string;

    @Factory((faker: Faker) => faker.lorem.words(10))
    @Prop()
    description: string;

    @Factory('knight_attack')
    @Prop()
    code: string;

    @Factory(() => {
        return getRandomEnumValue(CardRarityEnum);
    })
    @Prop()
    rarity: CardRarityEnum;

    @Factory(() => {
        return getRandomBetween(1, 3);
    })
    @Prop()
    energy: number;

    @Factory(() => {
        return getRandomEnumValue(CardTypeEnum);
    })
    @Prop()
    card_type: CardTypeEnum;

    @Factory(() => {
        return getRandomBetween(1, 200);
    })
    @Prop()
    coin_min: number;

    @Factory(() => {
        return getRandomBetween(1, 200);
    })
    @Prop()
    coin_max: number;

    @Factory(true)
    @Prop()
    active: boolean;

    @Factory(CardClassEnum.Knight)
    @Prop()
    card_class: CardClassEnum;
}

export const CardSchema = SchemaFactory.createForClass(Card);
