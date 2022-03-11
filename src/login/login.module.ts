import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { LocalStrategy } from 'src/login/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies';

@Module({
    imports: [PrismaModule, JwtModule.register({}), PassportModule],
    controllers: [LoginController],
    providers: [
        LoginService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshTokenStrategy,
    ],
})
export class LoginModule {}
