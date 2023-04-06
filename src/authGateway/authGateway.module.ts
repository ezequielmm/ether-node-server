import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthGatewayService } from './authGateway.service';

@Module({
    imports: [HttpModule, forwardRef(() => ConfigModule)],
    providers: [AuthGatewayService],
    exports: [AuthGatewayService],
})
export class AuthGatewayModule {}
