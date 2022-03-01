import { Controller, Get, Param, Version } from '@nestjs/common';
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

    @Version('2')
    @Get(':id')
    async getCharacterClass(
        @Param('id') id: string,
    ): Promise<character_classes> {
        const dto: Prisma.character_classesFindUniqueArgs = {
            where: { id: id },
        };
        return await this.service.getCharacterClass_V1(dto);
    }
}
