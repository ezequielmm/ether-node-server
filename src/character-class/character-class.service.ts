import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterClass } from './entities/character-class.entity';

@Injectable()
export class CharacterClassService {
    constructor(
        @InjectRepository(CharacterClass)
        private repository: Repository<CharacterClass>,
    ) {}

    async findAll_V1() {
        return await this.repository.find();
    }

    async findOne_V1(id: string) {
        return await this.repository.findOneOrFail(id);
    }
}
