import { Injectable } from '@nestjs/common';
import { Character, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CharacterService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get a single character
     * @version 1
     * @returns character | null
     */
    async getCharacter_V1(id: string): Promise<Character | null> {
        const data: Prisma.CharacterFindUniqueArgs = {
            where: { id },
            include: {
                cardpool: true,
            },
        };
        return await this.prisma.character.findUnique(data);
    }

    /**
     * Get all character classes
     * @version 1
     */
    async getAllCharacters_V1(): Promise<Character[]> {
        return await this.prisma.character.findMany({
            include: { cardpool: true },
        });
    }

    async checkIfNameExists(name: string): Promise<boolean> {
        const data: Prisma.CharacterFindManyArgs = {
            where: { name },
        };
        const characters = await this.prisma.character.findMany(data);
        return characters.length === 0;
    }
}
