import { Injectable } from '@nestjs/common';
import { characters, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CharacterService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get a single character
     * @version 1
     * @param characterWhereUniqueInput
     * @returns character | null
     */
    async getCharacter_V1(
        data: Prisma.charactersFindUniqueArgs,
    ): Promise<characters | null> {
        return await this.prisma.characters.findUnique(data);
    }

    /**
     * Get all character classes
     * @version 1
     */
    async getAllCharacters_V1(): Promise<characters[]> {
        return await this.prisma.characters.findMany();
    }
}
