import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const enemies: Prisma.EnemyCreateManyInput = {
    id: uuidv4(),
    name: faker.name.jobTitle(),
    type: 'beast',
    category: 'basic',
    life: 10,
    min_attack: 5,
    max_attack: 10,
};
