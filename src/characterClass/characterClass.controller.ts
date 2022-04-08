import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CharacterClass } from '@prisma/client';
import { CharacterClassService } from './characterClass.service';

@ApiBearerAuth()
@ApiTags('Character Classes')
@Controller('characters/classes')
export class CharacterClassController {
    constructor(private readonly service: CharacterClassService) {}

    @ApiOperation({
        summary: 'Get all character classes',
    })
    @Get()
    async handleGetCharacterClasses(): Promise<CharacterClass[]> {
        return await this.service.getCharacterClasses();
    }

    @ApiOperation({
        summary: 'Get a character class by its id',
    })
    @Get(':id')
    async handleGetCharacterClassById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CharacterClass> {
        return await this.service.getCharacterClassById(id);
    }
}