import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Character } from '@prisma/client';
import { CharacterService } from './character.service';

@ApiBearerAuth()
@ApiTags('Characters')
@Controller('characters')
export class CharacterController {
    constructor(private readonly service: CharacterService) {}

    @ApiOperation({
        summary: 'Get all characters',
    })
    @Get()
    async handleGetAllCharacters(): Promise<Character[]> {
        return await this.service.getAllCharacters();
    }
}
