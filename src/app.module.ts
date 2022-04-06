import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CardModule } from './card/card.module';
import { CardPoolModule } from './cardPool/cardPool.module';

@Module({
    imports: [CardModule, CardPoolModule],
    controllers: [AppController],
})
export class AppModule {}
