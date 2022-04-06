import { Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CharacterService {
    constructor(private readonly prisma: PrismaService) {}

    async getCharacterById(id: string): Promise<Character> {
        return await this.prisma.character.findUnique({
            where: { id },
            include: { cardpool: true },
        });
    }

    async getAllCharacters(): Promise<Character[]> {
        return await this.prisma.character.findMany({
            include: { cardpool: true },
        });
    }
}
