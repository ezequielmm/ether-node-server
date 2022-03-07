import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateRandomNumber } from '../src/utils';

const prisma = new PrismaClient();

const characterClassesData: Prisma.CharacterClassCreateInput[] = [
    {
        name: faker.name.jobArea(),
        characters: {
            create: {
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            },
        },
        cards: {
            create: {
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                description: faker.lorem.lines(3),
                code: faker.random.alphaNumeric(10),
                rarity: 'common',
                cost: generateRandomNumber(1, 100),
                type: 'attack',
                keyword: 'exhaust',
                coin_cost: generateRandomNumber(1, 100),
                status: 'active',
            },
        },
    },
    {
        name: faker.name.jobArea(),
        characters: {
            create: {
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            },
        },
    },
];

const enemiesData: Prisma.EnemyCreateInput[] = [
    {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        type: 'beast',
        category: 'basic',
    },
];

const roomsData: Prisma.RoomCreateManyInput[] = [
    {
        player_id: faker.datatype.uuid(),
        status: 'finished',
    },
    {
        player_id: faker.datatype.uuid(),
        status: 'canceled',
    },
    {
        player_id: faker.datatype.uuid(),
        status: 'in_progress',
    },
];

const nodesData: Prisma.NodeCreateManyInput[] = [
    {
        name: faker.name.jobArea(),
        description: faker.random.words(3),
        type: 'camp',
    },
    {
        name: faker.name.jobArea(),
        description: faker.random.words(3),
        type: 'encounter',
    },
    {
        name: faker.name.jobArea(),
        description: faker.random.words(3),
        type: 'merchant',
    },
];

async function main() {
    console.log('Start Seeding...');
    for (const data of characterClassesData) {
        await prisma.characterClass.create({ data });
    }
    for (const data of enemiesData) {
        await prisma.enemy.create({ data });
    }
    for (const data of roomsData) {
        await prisma.room.create({ data });
    }
    for (const data of nodesData) {
        await prisma.node.create({ data });
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
