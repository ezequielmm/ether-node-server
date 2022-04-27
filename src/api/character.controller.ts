import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CharacterService } from '../components/character/character.service';

@ApiBearerAuth()
@ApiTags('Characters')
@Controller('characters')
@UseGuards(new AuthGuard())
export class CharacterController {
    constructor(private readonly characterService: CharacterService) {}

    @ApiOperation({
        summary: 'Get all characters',
    })
    @Get()
    async handleGetAllCharacters() {
        const characters = await this.characterService.findAll();
        return characters.map((character) => {
            return {
                id: character._id,
                name: character.name,
                description: character.description,
                initial_health: character.initial_health,
                initial_gold: character.initial_gold,
                character_class: character.character_class,
            };
        });
    }
}
