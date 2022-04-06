import { Injectable } from '@nestjs/common';
import { CharacterClass } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CharacterClassService {
    constructor(private readonly prisma: PrismaService) {}

    async getCharacterClassById(id: string): Promise<CharacterClass> {
        return await this.prisma.characterClass.findUnique({ where: { id } });
    }

    async getCharacterClasses(): Promise<CharacterClass[]> {
        return await this.prisma.characterClass.findMany();
    }
}
