import { INestApplication } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { ClientSocketMock } from './clientSocketMock';
import { InMemoryMongoDB } from './inMemoryMongoDB';

/*
    ADD Comments
*/

export class IntegrationTestServer {
    module: TestingModule;
    clientSockets: Array<ClientSocketMock>;
    mongod: MongoMemoryServer;
    connection: Connection;
    app: INestApplication;
    serverPort: number;
    started: boolean;

    constructor() {
        this.clientSockets = [];
    }

    async start(providers, models): Promise<void> {
        this.mongod = await InMemoryMongoDB.buildMongoMemoryServer();
        this.module = await Test.createTestingModule({
            imports: [
                InMemoryMongoDB.forRootAsyncModule(this.mongod),
                MongooseModule.forFeature(models),
            ],
            providers,
        }).compile();

        this.app = this.module.createNestApplication();
        this.app.useWebSocketAdapter(new IoAdapter(this.app));

        await this.app.init();
        const { port } = this.app.getHttpServer().listen().address();
        this.serverPort = port;

        this.connection = await this.module.get(getConnectionToken());
        expect(this.connection).toBeDefined();

        this.started = true;
    }

    getInjectable(modulee: any): any {
        const injectable = this.module.get(modulee);
        expect(injectable).toBeDefined();
        return injectable;
    }

    async addNewSocketConnection(): Promise<ClientSocketMock> {
        const clientSocket = new ClientSocketMock();
        this.clientSockets.push(clientSocket);
        await clientSocket.connect(this.serverPort);
        return clientSocket;
    }

    async stop() {
        if (!this.started) return;

        this.clientSockets.forEach((cs) => {
            cs.disconnect();
        });
        await this.mongod.stop();
        await this.connection.close();
        await this.app.close();
    }
}
