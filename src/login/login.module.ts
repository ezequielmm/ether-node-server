import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';

@Module({
    imports: [PrismaModule,JwtModule.register({
      secret: process.env.TOKEN_SECRET_KEY,
      signOptions: {expiresIn: `${process.env.AUTH_TOKEN_DURATION||30}d`}
      })],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule {}
