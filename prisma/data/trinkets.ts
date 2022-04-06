import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Prisma, TrinketRarityEnum } from '@prisma/client';

export const trinkets: Prisma.TrinketCreateManyInput = {
    id: uuidv4(),
    name: faker.name.jobTitle(),
    rarity: TrinketRarityEnum.common,
    coin_cost: 0,
    effect: 'move',
    trigger: 'what',
};
