import { modelOptions, Prop, Severity } from '@typegoose/typegoose';
import { EncounterButton } from './encounter.interfaces';

export type EncounterDocument = Encounter & Document;
@modelOptions({
    schemaOptions: { collection: 'encounters', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Encounter {
    @Prop()
    encounterId: number;

    @Prop()
    encounterName: string;

    @Prop()
    imageId: string;

    @Prop({ type: Object })
    overrideDisplayText?: object;

    @Prop()
    postCardChoiceEffect?: string;

    @Prop({ type: Object })
    stages: {
        displayText: string;
        buttons: EncounterButton[];
    }[];
}
