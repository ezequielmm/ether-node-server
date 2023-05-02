import { Module } from '@nestjs/common';
import { TroveModule } from 'src/trove/trove.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [TroveModule],
})
export class AuthModule {}
