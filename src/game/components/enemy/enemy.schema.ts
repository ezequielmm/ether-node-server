import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from './enemy.enum';
import { EnemyAction, EnemyScript } from './enemy.interface';

@ModelOptions({
    schemaOptions: { collection: 'enemies', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Enemy {
    @Prop({ unique: true })
    enemyId: number;

    @Prop()
    isActive: boolean;

    @Prop()
    name: string;

    @Prop({ type: String, enum: EnemyTypeEnum })
    type: EnemyTypeEnum;

    @Prop({ type: String, enum: EnemyCategoryEnum })
    category: EnemyCategoryEnum;

    @Prop({ type: String, enum: EnemySizeEnum })
    size: EnemySizeEnum;

    @Prop([Number])
    healthRange: number[];

    @Prop()
    description: string;

    @Prop({ type: Object })
    scripts?: EnemyScript[];

    @Prop({ type: Object })
    attackLevels?: EnemyAction[];

    @Prop()
    aggressiveness?: number;
}


