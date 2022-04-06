import { CharacterClassEnum, Prisma } from '@prisma/client';
import { cardpools } from './cardpools';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const characters: Prisma.CharacterCreateManyInput = {
    id: uuidv4(),
    name: faker.name.jobTitle(),
    description: 'Lorem ipsum',
    character_class: CharacterClassEnum.knight,
    initial_health: 78,
    initial_gold: 120,
    cardpool_id: cardpools.id,
};
