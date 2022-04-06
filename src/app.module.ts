import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CardModule } from './card/card.module';
import { CardPoolModule } from './cardPool/cardPool.module';
import { CharacterModule } from './character/character.module';
import { CharacterClassModule } from './characterClass/characterClass.module';
import { TrinketModule } from './trinket/trinket.module';

@Module({
    imports: [
        CardModule,
        CardPoolModule,
        CharacterClassModule,
        CharacterModule,
        TrinketModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
