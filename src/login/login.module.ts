import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { LocalStrategy } from 'src/login/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET_KEY,
            signOptions: {
                expiresIn: `${process.env.AUTH_TOKEN_DURATION || 30}d`,
            },
        }),
        PassportModule,
    ],
    controllers: [LoginController],
    providers: [LoginService, LocalStrategy, JwtStrategy],
})
export class LoginModule {}
