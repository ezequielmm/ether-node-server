import { modelOptions, Prop } from '@typegoose/typegoose';
import { EncounterButton } from './encounter.interfaces';

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
        displayText: string;
        buttons: EncounterButton[];
    }[];
}
