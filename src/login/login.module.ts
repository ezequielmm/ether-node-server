import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { env } from 'process';

@Module({
    imports: [PrismaModule,JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: {expiresIn: `${env.TOKEN_REFRESH_TIME||54000}s`}
      })],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule {}
