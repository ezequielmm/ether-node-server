import { Controller, Get, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Character } from '@prisma/client';
import { CharacterService } from './character.service';

@ApiBearerAuth()
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
}
