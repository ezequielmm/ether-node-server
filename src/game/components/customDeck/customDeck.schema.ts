import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'customDecks', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class CustomDeck {
    @Prop()
    name: string;

    @Prop()
    userAddress: string;

    @Prop({ type: Object })
    cards: {
        cardId: number;
        amount: number;
    }[];

    @Prop()
    isDefault: boolean;
}
