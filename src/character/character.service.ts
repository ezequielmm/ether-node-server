import { Injectable } from '@nestjs/common';
import { Character, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCharacterDto } from './dto/updateCharacter.dto';

@Injectable()
export class CharacterService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get a single character
     * @version 1
     * @param characterWhereUniqueInput
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

    /**
     * Returns character selection
     * @param data
     * @returns character selection
     */

    async selectCharacter_V1(data) {
        // Sending example response
        // TODO: Update this to return the character
        return {
            id: uuidv4(),
            ...data,
        };
    }

    async updateCharacter_V1(id: string, data: UpdateCharacterDto) {
        // Sending example response
        // TODO: Update this to return the updated character
        return {
            id: uuidv4(),
            ...data,
        };
    }

    async checkIfNameExists(name: string): Promise<boolean> {
        const data: Prisma.CharacterFindManyArgs = {
            where: { name },
        };
        const characters = await this.prisma.character.findMany(data);
        return characters.length === 0;
    }
}
