import { modelOptions, Prop } from '@typegoose/typegoose';

export type EncounterDocument = Encounter & Document;
@modelOptions({
    schemaOptions: { collection: 'encounter', versionKey: false },
})
export class Encounter {
    @Prop()
    encounterId: number;

    @Prop()
    imageId: string;

    @Prop({ type: Object })
    stages: {
        // eslint-disable-next-line @typescript-eslint/ban-types
        displayText: string;
        buttons: {
            text: string;
            nextStage: number;
            effects: any[];
        }[];
    }[];
}