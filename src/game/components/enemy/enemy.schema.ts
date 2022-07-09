import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { CardStatus } from 'src/game/status/interfaces';
import { CardTargetedEnum } from '../card/card.enum';
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from './enemy.enum';

export type EnemyDocument = Enemy & Document;

export enum IntentionType {
    Attack = 'attack',
    Defend = 'defend',
    Stun = 'stun',
    Buff = 'buff',
    Debuff = 'debuff',
}

export interface Intention {
    type: IntentionType;
    target: CardTargetedEnum;
    value: any;
    effect?: JsonEffect;
    status?: CardStatus;
}

export interface NextScript {
    probability: number;
    scriptIndex: number;
}

export interface Script {
    intentions: Intention[];
    next: NextScript[];
}

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
    healthRange: number[];

    @Prop()
    description: string;

    @Prop({ type: Object })
    scripts: Script[];
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
