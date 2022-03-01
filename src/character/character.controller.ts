import { Controller, Get, Param, Version } from '@nestjs/common';
import { characters, Prisma } from '@prisma/client';
import { CharacterService } from './character.service';

@Controller('characters')
export class CharacterController {
    constructor(private readonly service: CharacterService) {}

    @Version('1')
    @Get('/')
    async getCharacters_V1(): Promise<characters[]> {
        return await this.service.getAllCharacters_V1();
    }

    @Version('1')
    @Get(':id')
    async getCharacter_V1(@Param('id') id: string): Promise<characters> {
        const data: Prisma.charactersFindUniqueArgs = {
            where: { id },
        };
        return await this.service.getCharacter_V1(data);
    }
}
