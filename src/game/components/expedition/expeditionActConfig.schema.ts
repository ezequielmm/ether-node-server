import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { _id: false, versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class ExpeditionActConfig {
    @Prop()
    potionChance: number;
}
