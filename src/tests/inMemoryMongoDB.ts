import { DynamicModule } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class InMemoryMongoDB {
    public static forRootAsyncModule(
        mongod: MongoMemoryServer,
        options: TypegooseModule = {},
    ): DynamicModule {
        return TypegooseModule.forRootAsync({
            useFactory: async () => {
                const mongoUri = await mongod.getUri();
                return {
                    uri: mongoUri,
                    ...options,
                };
            },
        });
    }

    public static buildMongoMemoryServer(): Promise<MongoMemoryServer> {
        return MongoMemoryServer.create();
    }
}
