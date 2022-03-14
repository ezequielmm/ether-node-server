import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const nodes: Prisma.NodeCreateManyInput = {
    id: uuidv4(),
    name: faker.name.jobTitle(),
    description: faker.lorem.words(20),
    type: 'combat',
};
