import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const cardpools: Prisma.CardPoolCreateManyInput = {
    id: uuidv4(),
    name: faker.name.jobTitle(),
    visibility: 'visible',
};
