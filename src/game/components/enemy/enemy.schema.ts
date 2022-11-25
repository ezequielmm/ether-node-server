import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from './enemy.enum';
import { EnemyScript } from './enemy.interface';

export type EnemyDocument = HydratedDocument<Enemy>;

@Schema({
    collection: 'enemies',
    versionKey: false,
})
export class Enemy {
    @Prop({ unique: true })
    enemyId: number;

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
    scripts: EnemyScript[];
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
