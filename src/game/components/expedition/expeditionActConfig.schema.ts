import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({ schemaOptions: { _id: false, versionKey: false } })
export class ExpeditionActConfig {
    @Prop()
    potionChance: number;
}
