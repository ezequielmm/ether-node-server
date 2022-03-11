import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const characterClasses: Prisma.CharacterClassCreateManyInput = {
    id: uuidv4(),
    name: faker.name.jobTitle(),
};
