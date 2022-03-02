import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { Character, Prisma } from '@prisma/client';
import { CharacterService } from './character.service';

@Controller('characters')
export class CharacterController {
    constructor(private readonly service: CharacterService) {}

    @Version('1')
    @Get('/')
    async getCharacters_V1(): Promise<Character[]> {
        return await this.service.getAllCharacters_V1();
    }

    @Version('1')
    @Get(':id')
    async getCharacter_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Character> {
        const data: Prisma.CharacterFindUniqueArgs = {
            where: { id },
        };
        return await this.service.getCharacter_V1(data);
    }
}
