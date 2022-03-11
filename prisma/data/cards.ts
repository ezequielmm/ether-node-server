import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { characterClasses } from './characterClasses';

export const cards: Prisma.CardCreateManyInput = {
    id: uuidv4(),
    code: 'random code',
    name: faker.name.jobTitle(),
    description: faker.lorem.words(20),
    rarity: 'common',
    character_class_id: characterClasses.id,
    type: 'attack',
    keyword: 'ethereal',
    coin_cost: 2,
    status: 'active',
};
