import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'mapsDecks', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class MapDeck {
    @Prop()
    name: string;

    @Prop({ type: Object })
    cards: {
        cardId: number;
        amount: number;
    }[];

}
