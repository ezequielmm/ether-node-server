import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { character_classes, Prisma } from '@prisma/client';
import { CharacterClassService } from './character-class.service';

@Controller('characters/classes')
export class CharacterClassController {
    constructor(private readonly service: CharacterClassService) {}

    @Version('1')
    @Get('/')
    async getCharacterClasses_V1(): Promise<character_classes[]> {
        return await this.service.getAllCharacterClasses_V1();
    }

    @Version('1')
    @Get(':id')
    async getCharacterClass_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<character_classes> {
        const data: Prisma.character_classesFindUniqueArgs = {
            where: { id },
        };
        return await this.service.getCharacterClass_V1(data);
    }
}
