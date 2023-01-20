import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { _id: false, versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Score {
    @Prop({ default: 0 })
    nodesCompleted: number;

    @Prop({ default: 0 })
    basicEnemiesDefeated: number;

    @Prop({ default: 0 })
    eliteEnemiesDefeated: number;

    @Prop({ default: 0 })
    bossEnemiesDefeated: number;
}
