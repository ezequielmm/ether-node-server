import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/config';
import { Database } from './config/database';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: Database,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
