import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from './enums';
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

    @Factory(() => {
        return getRandomEnumValue(CardRarityEnum);
    })
    @Prop()
    rarity: CardRarityEnum;

    @Factory(() => {
        return getRandomEnumValue(CardTypeEnum);
    })
    @Prop()
    card_type: CardTypeEnum;

    @Factory('knight')
    @Prop()
    pool: string;

    @Factory(() => {
        return getRandomBetween(1, 3);
    })
    @Prop()
    energy: number;

    @Factory('Deal $prop.damage.current$ damage to target')
    @Prop()
    description: string;

    @Factory(() => {
        return getRandomEnumValue(CardTargetedEnum);
    })
    @Prop()
    targeted: CardTargetedEnum;

    @Factory(() => {
        return {
            damage: {
                base: getRandomBetween(8, 20),
            },
        };
    })
    @Prop({ type: Object })
    properties: {
        damage: {
            base: number;
        };
    };

    @Factory(() => {
        return getRandomEnumValue(CardKeywordEnum);
    })
    @Prop()
    keywords: CardKeywordEnum;
}

export const CardSchema = SchemaFactory.createForClass(Card);
