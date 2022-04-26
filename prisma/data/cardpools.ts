import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';

export const cardpools: Prisma.CardPoolCreateManyInput = {
    id: uuid(),
    name: faker.name.jobTitle(),
    visibility: 'visible',
};
