import { Prisma } from '@prisma/client';
import { cardpools } from './cardpools';

export const characters: Prisma.CharacterCreateManyInput = {
    id: 'b648138d-e2ba-42e7-a0f4-90f8690bbd38',
    name: 'Dark Knight',
    description: 'Lorem ipsum',
    class: 'knight',
    initial_health: 78,
    initial_gold: 120,
    cardpool_id: cardpools.id,
};
