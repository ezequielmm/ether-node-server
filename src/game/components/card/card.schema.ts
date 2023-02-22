import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { JsonStatus } from 'src/game/status/interfaces';
import { CardRarityEnum, CardTypeEnum, CardKeywordEnum } from './card.enum';

@ModelOptions({
    schemaOptions: { collection: 'cards', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Card {
    @Prop({ unique: true })
    cardId: number;

    @Prop()
    name: string;

    @Prop({ type: String, enum: CardRarityEnum })
    rarity: CardRarityEnum;

    @Prop({ type: String, enum: CardTypeEnum })
    cardType: CardTypeEnum;

    @Prop()
    pool: string;

    @Prop()
    energy: number;

    @Prop()
    description: string;

    @Prop({ type: Object })
    properties: {
        effects: JsonEffect[];
        statuses: JsonStatus[];
    };

    @Prop([String])
    keywords: CardKeywordEnum[];

    @Prop({ type: Object })
    merchantInfo?: {
        coinCost: number[];
    };

    @Prop({ default: false })
    showPointer: boolean;

    @Prop({ default: false })
    isUpgraded: boolean;

    @Prop()
    upgradedCardId?: number;

    @Prop()
    triggerAtEndOfTurn?: boolean;

    @Prop()
    triggerOnDrawn?: boolean;

    @Prop()
    isActive: boolean;
}
