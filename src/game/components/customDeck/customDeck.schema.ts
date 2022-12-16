import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'customDecks', versionKey: false },
})
export class CustomDeck {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop({ type: Object })
    cards: {
        cardId: number;
        amount: number;
    }[];

    @Prop()
    isDefault: boolean;
}
