import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnemyCategoryEnum, EnemyTypeEnum } from './enums';
import { Factory } from 'nestjs-seeder';
import { Faker } from '@faker-js/faker';
import { getRandomBetween, getRandomEnumValue } from '../../../utils';

export type EnemyDocument = Enemy & Document;

@Schema()
export class Enemy {
    @Factory((faker: Faker) => faker.name.findName())
    @Prop()
    readonly name: string;

    @Factory(() => {
        return getRandomEnumValue(EnemyTypeEnum);
    })
    @Prop()
    readonly enemy_type: EnemyTypeEnum;

    @Factory(() => {
        return getRandomEnumValue(EnemyCategoryEnum);
    })
    @Prop()
    readonly enemy_category: EnemyCategoryEnum;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    readonly life: number;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    readonly min_attack: number;

    @Factory(() => {
        return getRandomBetween(20, 100);
    })
    @Prop()
    readonly max_attack: number;
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
