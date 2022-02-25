import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
