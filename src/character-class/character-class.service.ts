import { Injectable } from '@nestjs/common';
import { character_classes, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CharacterClassService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get a single character class
     * @version 1
     * @param characterClassWhereUniqueInput
     * @returns character_classes | null
     */
    async getCharacterClass_V1(
        data: Prisma.character_classesFindUniqueArgs,
    ): Promise<character_classes | null> {
        return await this.prisma.character_classes.findUnique(data);
    }

    /**
     * Get all character classes
     * @version 1
     */
    async getAllCharacterClasses_V1(): Promise<character_classes[]> {
        return await this.prisma.character_classes.findMany();
    }
}
