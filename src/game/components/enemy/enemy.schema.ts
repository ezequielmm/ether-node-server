import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from './enemy.enum';
import { EnemyScript } from './enemy.interface';

export type EnemyDocument = Enemy & Document;

@Schema({
    collection: 'enemies',
})
export class Enemy {
    @Prop({ unique: true })
    enemyId: number;

    @Prop()
    name: string;

    @Prop()
    type: EnemyTypeEnum;

    @Prop()
    category: EnemyCategoryEnum;

    @Prop()
    size: EnemySizeEnum;

    @Prop()
    healthRange: number[];

    @Prop()
    description: string;

    @Prop({ type: Object })
    scripts: EnemyScript[];
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
