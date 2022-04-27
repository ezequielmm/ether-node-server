import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from '../components/character/character.schema';

@ApiBearerAuth()
@ApiTags('Characters')
@Controller('characters')
@UseGuards(new AuthGuard())
export class CharacterController {
    constructor(
        @InjectModel(Character.name)
        private readonly character: Model<Character>,
    ) {}

    @ApiOperation({
        summary: 'Get all characters',
    })
    @Get()
    async handleGetAllCharacters(): Promise<Character[]> {
        return this.character.find().lean();
    }
}
