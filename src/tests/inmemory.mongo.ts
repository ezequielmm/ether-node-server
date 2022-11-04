import { DynamicModule } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class InMemoryMongo {
    public static forRootAsync(
        options: MongooseModuleOptions = {},
    ): DynamicModule {
        return MongooseModule.forRootAsync({
            useFactory: async () => {
                const mongod = await MongoMemoryServer.create();
                const mongoUri = await mongod.getUri();
                return {
                    uri: mongoUri,
                    ...options,
                };
            },
        });
    }
}
