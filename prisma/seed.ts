import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const characterClassesData: Prisma.character_classesCreateInput[] = [
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
                rarity: 'Common',
                cost: faker.random.number(100),
                type: 'Ghost',
                keyword: 'tags',
                coin_cost: faker.random.number(100),
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

async function main() {
    console.log('Start Seeding...');
    for (const data of characterClassesData) {
        await prisma.character_classes.create({
            data,
        });
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
