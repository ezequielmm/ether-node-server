import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Version,
    Post,
    Body,
    Put,
} from '@nestjs/common';
import { Character } from '@prisma/client';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/createCharacter.dto';
import { UpdateCharacterDto } from './dto/updateCharacter.dto';

@Controller('characters')
export class CharacterController {
    constructor(private readonly service: CharacterService) {}

    @Version('1')
    @Get('/')
    async getCharacters_V1(): Promise<Character[]> {
        return await this.service.getAllCharacters_V1();
    }

    @Version('1')
    @Get(':id')
    async getCharacter_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Character> {
        return await this.service.getCharacter_V1(id);
    }

    @Version('1')
    @Post('/')
    async selectCharacter_V1(@Body() CreateCharacterDto: CreateCharacterDto) {
        return this.service.selectCharacter_V1(CreateCharacterDto);
    }

    @Version('1')
    @Put(':id')
    async updateCharacter_V1(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCharacterDto: UpdateCharacterDto,
    ) {
        return this.service.updateCharacter_V1(id, updateCharacterDto);
    }
}
