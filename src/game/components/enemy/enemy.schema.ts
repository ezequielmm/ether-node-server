import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnemyCategoryEnum, EnemyTypeEnum, EnemySizeEnum } from './enums';

export type EnemyDocument = Enemy & Document;

@Schema()
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
    hitPoints?: number;

    @Prop()
    attackMin: number;

    @Prop()
    attackMax: number;

    @Prop()
    hpMin: number;

    @Prop()
    hpMax: number;

    @Prop()
    life: number;

    @Prop()
    description: string;
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
