import { MongooseModuleOptions } from '@nestjs/mongoose';

export function composeMongooseModuleOptions(
    uri: string,
): MongooseModuleOptions {
    return { uri, useNewUrlParser: true, useUnifiedTopology: true };
}
