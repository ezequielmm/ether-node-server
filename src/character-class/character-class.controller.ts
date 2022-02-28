import { Controller, Get, Param, Version } from '@nestjs/common';
import { CharacterClassService } from './character-class.service';

@Controller('characters/classes')
export class CharacterClassController {
    constructor(private readonly service: CharacterClassService) {}

    @Version('1')
    @Get()
    findAll_V1() {
        return this.service.findAll_V1();
    }

    @Version('1')
    @Get(':id')
    findOne_V1(@Param('id') id: string) {
        return this.service.findOne_V1(id);
    }
}
