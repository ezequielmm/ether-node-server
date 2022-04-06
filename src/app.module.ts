import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthGatewayModule } from './authGateway/authGateway.module';
import { CardModule } from './card/card.module';
import { CardPoolModule } from './cardPool/cardPool.module';
import { CharacterModule } from './character/character.module';
import { CharacterClassModule } from './characterClass/characterClass.module';
import { ExpeditionModule } from './expedition/expedition.module';
import { SocketModule } from './socket/socket.module';
import { SocketClientModule } from './socketClient/socketClient.module';
import { TrinketModule } from './trinket/trinket.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URL),
        CardModule,
        CardPoolModule,
        CharacterClassModule,
        CharacterModule,
        TrinketModule,
        AuthGatewayModule,
        ExpeditionModule,
        SocketClientModule,
        SocketModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
