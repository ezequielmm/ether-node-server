import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { UniqueNameOnCharactersTableRule } from 'src/validators/uniqueNameOnCharactersTable.rule';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
    imports: [PrismaModule],
    controllers: [CharacterController],
    providers: [CharacterService, UniqueNameOnCharactersTableRule],
    exports: [CharacterService],
})
export class CharacterModule {}
