import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Character } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { CharacterService } from './character.service';

@ApiBearerAuth()
@ApiTags('Characters')
@Controller('characters')
@UseGuards(new AuthGuard())
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
