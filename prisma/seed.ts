import { PrismaClient } from '@prisma/client';
import { cardpools } from './data/cardpools';
import { cards } from './data/cards';
import { characterClasses } from './data/characterClasses';
import { characters } from './data/characters';
import { rooms } from './data/rooms';

const prisma = new PrismaClient();

async function main() {
    console.log('Start Seeding...');

    //#region  Delete previous data
    // Disable Foreign key constraints
    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0;`;

    await prisma.cardPool.deleteMany();
    console.log('Deleted records in cardpools table');

    await prisma.character.deleteMany();
    console.log('Deleted records in characters table');

    await prisma.characterClass.deleteMany();
    console.log('Deleted records in character classes table');

    await prisma.card.deleteMany();
    console.log('Deleted records in cards table');

    await prisma.room.deleteMany();
    console.log('Deleted records in rooms table');

    // Enable Foreign key constraints
    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1;`;
    //#endregion End Delete previous data

    //#region Insert Data
    await prisma.cardPool.create({ data: cardpools });
    console.log('Added cardpools data');

    await prisma.character.createMany({ data: characters });
    console.log('Added characters data');

    await prisma.characterClass.createMany({ data: characterClasses });
    console.log('Added character classes data');

    await prisma.card.createMany({ data: cards });
    console.log('Added cards data');

    await prisma.room.createMany({ data: rooms });
    console.log('Added rooms data');
    //#endregion End Insert Data

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
