import { Card, CardClassEnum, CardRarityEnum, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { cardpools } from './cardpools';

function getRandomBetween(min: number, max: number): number {
    max = max + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum) as Array<keyof T>;
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumKey = enumValues[randomIndex];
    return anEnum[randomEnumKey];
}

const items: Card[] = [];

const cardCount = 15;

for (let i = 1; i <= cardCount; i++) {
    items.push({
        id: uuidv4(),
        code: 'knight_attack',
        name: faker.name.firstName(),
        description: faker.lorem.words(20),
        rarity: getRandomEnumValue(CardRarityEnum),
        card_class: getRandomEnumValue(CardClassEnum),
        type: 'attack',
        coins_max: getRandomBetween(1, 200),
        coins_min: getRandomBetween(1, 200),
        energy: getRandomBetween(1, 3),
        cardpool_id: cardpools.id,
        active: true,
        created_at: new Date(),
    });
}

export const cards: Prisma.CardCreateManyArgs = {
    data: items,
};
