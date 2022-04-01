import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Character } from '@prisma/client';
import { CharacterService } from './character.service';

@ApiTags('Characters')
@Controller('characters')
export class CharacterController {
    constructor(private readonly service: CharacterService) {}

    @Version('1')
    @ApiOperation({
        summary: 'Get all characters',
    })
    @Get('/')
    async getCharacters_V1(): Promise<Character[]> {
        return await this.service.getAllCharacters_V1();
    }

    @Version('1')
    @ApiOperation({
        summary: 'Get a single character by its ID',
    })
    @Get(':id')
    async getCharacter_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Character> {
        return await this.service.getCharacter_V1(id);
    }
}
