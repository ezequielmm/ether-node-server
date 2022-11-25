import { DynamicModule } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class InMemoryMongoDB {
    public static forRootAsyncModule(
        mongod: MongoMemoryServer,
        options: MongooseModuleOptions = {},
    ): DynamicModule {
        return MongooseModule.forRootAsync({
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
