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
            resist?: {
                base: number;
                current: number;
            };
            spikes?: {
                base: number;
                current: number;
            };
            dodge?: {
                base: number;
                current: number;
            };
            force_field?: {
                base: number;
                current: number;
            };
            intercept?: {
                base: number;
                current: number;
            };
            heralding?: {
                base: number;
                current: number;
            };
            taste_of_blood?: {
                base: number;
                current: number;
            };
            resolve_expires?: {
                base: number;
                current: number;
            };
            energize?: {
                base: number;
                current: number;
            };
            bolstered?: {
                base: number;
                current: number;
            };
            anticipating?: {
                base: number;
                current: number;
            };
            siphoning?: {
                base: number;
                current: number;
            };
            double_down?: {
                base: number;
                current: number;
            };
            imbued?: {
                base: number;
                current: number;
            };
            trinity?: {
                base: number;
                current: number;
            };
            trinity_upgraded?: {
                base: number;
                current: number;
            };
            enflamed?: {
                base: number;
                current: number;
            };
            gifted?: {
                base: number;
                current: number;
            };
            finely_edged?: {
                base: number;
                current: number;
            };
            finely_edged_plus?: {
                base: number;
                current: number;
            };
            armored_up?: {
                base: number;
                current: number;
            };
            armored_up_plus?: {
                base: number;
                current: number;
            };
            dew_drop?: {
                base: number;
                current: number;
            };
            fatigue?: {
                base: number;
                current: number;
            };
            praying?: {
                base: number;
                current: number;
            };
            adept?: {
                base: number;
                current: number;
            };
            enraged?: {
                base: number;
                current: number;
            };
            herald_delayed?: {
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
            confused?: {
                base: number;
                current: number;
            };
            stunned?: {
                base: number;
                current: number;
            };
            drained?: {
                base: number;
                current: number;
            };
            feeble?: {
                base: number;
                current: number;
            };
            summoned?: {
                base: number;
                current: number;
            };
            clearheaded?: {
                base: number;
                current: number;
            };
            trapped?: {
                base: number;
                current: number;
            };
            blighted?: {
                base: number;
                current: number;
            };
            mimic?: {
                base: number;
                current: number;
            };
            mossy?: {
                base: number;
                current: number;
            };
            squishy?: {
                base: number;
                current: number;
            };
            blinded?: {
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
