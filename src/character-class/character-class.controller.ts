import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CharacterClass } from '@prisma/client';
import { CharacterClassService } from './character-class.service';

@ApiBearerAuth()
@ApiTags('Character Class')
@Controller('characters/classes')
export class CharacterClassController {
    constructor(private readonly service: CharacterClassService) {}

    @Version('1')
    @ApiOperation({
        summary: 'Get all character classes',
    })
    @Get('/')
    async getCharacterClasses_V1(): Promise<CharacterClass[]> {
        return await this.service.getAllCharacterClasses_V1();
    }

    @Version('1')
    @ApiOperation({
        summary: 'Get a character class by its id',
    })
    @Get(':id')
    async getCharacterClass_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CharacterClass> {
        return await this.service.getCharacterClass_V1(id);
    }
}
