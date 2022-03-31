import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
    imports: [HttpModule],
    providers: [SocketGateway, SocketService],
})
export class SocketModule {}
