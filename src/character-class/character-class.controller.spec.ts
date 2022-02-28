import { Test, TestingModule } from '@nestjs/testing';
import { CharacterClassController } from './character-class.controller';
import { CharacterClassService } from './character-class.service';

describe('CharacterClassController', () => {
    let controller: CharacterClassController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CharacterClassController],
            providers: [CharacterClassService],
        }).compile();

        controller = module.get<CharacterClassController>(
            CharacterClassController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
