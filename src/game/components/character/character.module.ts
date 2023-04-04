import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { Character } from './character.schema';
import { CharacterService } from './character.service';

@Module({
    imports: [KindagooseModule.forFeature([Character])],
    providers: [CharacterService],
    exports: [CharacterService, KindagooseModule],
})
export class CharacterModule {}
