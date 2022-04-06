import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { cardpools } from './cardpools';

export const cards: Prisma.CardCreateManyInput = {
    id: uuidv4(),
    code: 'knight_attack',
    name: faker.name.jobTitle(),
    description: faker.lorem.words(20),
    rarity: 'common',
    class: 'knight',
    type: 'attack',
    coins_max: 0,
    coins_min: 0,
    energy: 1,
    cardpool_id: cardpools.id,
};
