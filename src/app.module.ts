import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ConfigurationModule } from './config/configuration.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationService } from './config/configuration.service';
import { SocketModule } from './socket/socket.module';

@Module({
    imports: [
        ApiModule,
        ConfigurationModule,
        SocketModule,
        MongooseModule.forRootAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: (configurationService: ConfigurationService) => {
                const options: MongooseModuleOptions = {
                    uri: configurationService.connectionString,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
                return options;
            },
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
