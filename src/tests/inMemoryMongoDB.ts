import { DynamicModule } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class InMemoryMongoDB {
    public static async forRootAsyncModule(
        mongod: MongoMemoryServer,
        options: KindagooseModule = {},
    ): Promise<DynamicModule> {
        const mongoUri = await mongod.getUri();
        return KindagooseModule.forRoot(mongoUri, options);
    }

    public static buildMongoMemoryServer(): Promise<MongoMemoryServer> {
        return MongoMemoryServer.create();
    }
}
