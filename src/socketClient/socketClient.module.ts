import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketClient, SocketClientSchema } from './socketClient.schema';
import { SocketClientService } from './socketClient.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: SocketClient.name,
                schema: SocketClientSchema,
            },
        ]),
    ],
    providers: [SocketClientService],
})
export class SocketClientModule {}
