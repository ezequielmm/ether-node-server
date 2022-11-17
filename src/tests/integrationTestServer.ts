import {
    ConsoleLogger,
    INestApplication,
    Injectable,
    Provider,
} from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { ClientSocketMock } from './clientSocketMock';
import { InMemoryMongoDB } from './inMemoryMongoDB';

@Injectable()
export class DebugLogger extends ConsoleLogger {
    constructor() {
        super();
        this.setContext('Integration Test Server');
        this.setLogLevels(['debug']);
    }
}

export interface IntegrationTestServerOptions {
    providers: Array<any>;
    models: Array<any>;
    logger?: Provider<ConsoleLogger>;
}

/**
 * It Creates a standard NestJS TestingModule where it setups
 * an in Memory MongoDB server and an array of ClientSocketMock. This allows
 * store Mongo documents by using the same Mongosee API and simulate
 * socket connections
 * @param IntegrationTestServerOptions set up your providers, MongoDB models,
 * and an optional logger
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

    async start(params: IntegrationTestServerOptions): Promise<void> {
        this.mongod = await InMemoryMongoDB.buildMongoMemoryServer();
        this.module = await Test.createTestingModule({
            imports: [
                InMemoryMongoDB.forRootAsyncModule(this.mongod),
                MongooseModule.forFeature(params.models),
            ],
            providers: params.logger
                ? [params.logger, ...params.providers]
                : params.providers,
        }).compile();

        this.app = this.module.createNestApplication();
        this.app.useWebSocketAdapter(new IoAdapter(this.app));

        this.setUpLogger(params.logger);

        await this.app.init();
        const { port } = this.app.getHttpServer().listen().address();
        this.serverPort = port;

        this.connection = await this.module.get(getConnectionToken());
        expect(this.connection).toBeDefined();

        this.started = true;
    }

    private setUpLogger(logger: Provider<ConsoleLogger>): void {
        if (!logger) return;
        this.app.useLogger(this.app.get(logger as any));
    }

    getInjectable(modulee: any): any {
        const injectable = this.module.get(modulee);
        expect(injectable).toBeDefined();
        return injectable;
    }

    async addNewSocketConnection(): Promise<[ClientSocketMock, any[]]> {
        const clientSocket = new ClientSocketMock();
        this.clientSockets.push(clientSocket);
        await clientSocket.connect(this.serverPort);
        const messages = [];
        clientSocket.on('PutData', (message) => {
            messages.push(JSON.parse(message));
        });
        clientSocket.on('ErrorMessage', (message) => {
            messages.push(JSON.parse(message));
        });
        return [clientSocket, messages];
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
