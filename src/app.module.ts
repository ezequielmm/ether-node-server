import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterClassModule } from './character-class/character-class.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT) || 3306,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [`${__dirname}/**/*.entity{.ts,.js}`],
                synchronize: false,
            }),
        }),
        CharacterClassModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
