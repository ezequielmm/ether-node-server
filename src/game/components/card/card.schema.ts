import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from './enums';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema()
export class Card {
    @Prop()
    name: string;

    @Prop()
    rarity: CardRarityEnum;

    @Prop()
    card_type: CardTypeEnum;

    @Prop()
    pool: string;

    @Prop()
    energy: number;

    @Prop()
    description: string;

    @Prop()
    targeted: CardTargetedEnum;

    @Prop({ type: Object })
    properties: {
        effects: {
            damage?: {
                base: number;
            };
            defense?: {
                base: number;
            };
            energy?: {
                base: number;
            };
            drawCard?: {
                base: number;
            };
        };
        statuses: {
            resolve?: {
                base: number;
            };
            fortitude?: {
                base: number;
            };
        };
    };

    @Prop()
    keywords: CardKeywordEnum[];

    @Prop({ type: Object })
    merchant_info?: {
        coin_cost: number[];
    };
}

export const CardSchema = SchemaFactory.createForClass(Card);
