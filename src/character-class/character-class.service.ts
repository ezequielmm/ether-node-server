import { Injectable } from '@nestjs/common';
import { CharacterClass, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CharacterClassService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get a single character class
     * @version 1
     * @param character_classesFindUniqueArgs
     * @returns character_class | null
     */
    async getCharacterClass_V1(
        data: Prisma.CharacterClassFindUniqueArgs,
    ): Promise<CharacterClass | null> {
        return await this.prisma.characterClass.findUnique(data);
    }

    /**
     * Get all character classes
     * @version 1
     */
    async getAllCharacterClasses_V1(): Promise<CharacterClass[]> {
        return await this.prisma.characterClass.findMany();
    }
}
