import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from './enums';
import { Document } from 'mongoose';
import { JsonEffect } from 'src/game/effects/interfaces/baseEffect';

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
        effects: JsonEffect[];
        statuses: {
            resolve?: {
                base: number;
                current: number;
            };
            fortitude?: {
                base: number;
                current: number;
            };
            distraught?: {
                base: number;
                current: number;
            };
            turtling?: {
                base: number;
                current: number;
            };
            burn?: {
                base: number;
                current: number;
            };
            confusion?: {
                base: number;
                current: number;
            };
            regeneration?: {
                base: number;
                current: number;
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
