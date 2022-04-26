import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthGatewayService } from './authGateway.service.';

@Module({
    imports: [HttpModule],
    providers: [AuthGatewayService],
})
export class AuthGatewayModule {}
