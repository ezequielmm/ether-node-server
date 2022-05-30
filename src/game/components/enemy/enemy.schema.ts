import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnemyCategoryEnum, EnemyTypeEnum, EnemySizeEnum } from './enums';
// import { Factory } from 'nestjs-seeder';
// import { Faker } from '@faker-js/faker';
// import { getRandomBetween, getRandomEnumValue } from '../../../utils';

export type EnemyDocument = Enemy & Document;

@Schema()
export class Enemy {
    // @Factory(() => faker.name.findName())
    @Prop()
    name: string;

    // @Factory(() => getRandomEnumValue(EnemyTypeEnum))
    @Prop()
    type: EnemyTypeEnum;

    // @Factory(() => getRandomEnumValue(EnemyCategoryEnum))
    @Prop()
    category: EnemyCategoryEnum;

    // @Factory(() => getRandomEnumValue(EnemySizeEnum))
    @Prop()
    size: EnemySizeEnum;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    hitPoints: number;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    attackMin: number;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    attackMax: number;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    hpMin: number;

    // @Factory(() => getRandomBetween(20, 100))
    @Prop()
    hpMax: number;

    // @Factory((faker: Faker) => faker.random.words(5))
    @Prop()
    description: string;
}

export const EnemySchema = SchemaFactory.createForClass(Enemy);
