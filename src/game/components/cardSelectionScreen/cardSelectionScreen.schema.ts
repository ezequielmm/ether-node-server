import { ModelOptions, Prop } from '@typegoose/typegoose';
import { CardSelectionScreenOriginPileEnum } from './cardSelectionScreen.enum';

@ModelOptions({
    schemaOptions: { collection: 'cardSelectionScreens', versionKey: false },
})
export class CardSelectionScreen {
    @Prop()
    clientId: string;

    @Prop()
    cardIds: any[];

    @Prop({ type: String, enum: CardSelectionScreenOriginPileEnum })
    originPile: CardSelectionScreenOriginPileEnum;

    @Prop()
    amountToTake: number;
}
