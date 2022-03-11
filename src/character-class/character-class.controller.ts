import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { CharacterClass } from '@prisma/client';
import { CharacterClassService } from './character-class.service';

@Controller('characters/classes')
export class CharacterClassController {
    constructor(private readonly service: CharacterClassService) {}

    @Version('1')
    @Get('/')
    async getCharacterClasses_V1(): Promise<CharacterClass[]> {
        return await this.service.getAllCharacterClasses_V1();
    }

    @Version('1')
    @Get(':id')
    async getCharacterClass_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CharacterClass> {
        return await this.service.getCharacterClass_V1(id);
    }
}
