import { PrismaClient } from '@prisma/client';
import { cardpools } from './data/cardpools';
import { characters } from './data/characters';

const prisma = new PrismaClient();

async function main() {
    console.log('Start Seeding...');

    await prisma.cardPool.deleteMany();
    console.log('Deleted records in cardpools table');

    await prisma.character.deleteMany();
    console.log('Deleted records in characters table');

    await prisma.cardPool.create({ data: cardpools });
    console.log('Added cardpools data');

    await prisma.character.createMany({ data: characters });
    console.log('Added characters data');

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
