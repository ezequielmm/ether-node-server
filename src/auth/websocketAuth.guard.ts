import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthorizedSocket } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { verifySessionJwt } from 'src/utils/tokenHelpers';

@Injectable()
export class WebsocketAuthGuard implements CanActivate {

    private readonly signingSecret: string;

    constructor(private readonly configService:ConfigService){
        this.signingSecret = this.configService.get<string>("JWT_SIGNER");
    }

    canActivate(context: ExecutionContext): boolean {
        const client: AuthorizedSocket = context.switchToWs().getClient();
        const authHeader = client.handshake.headers.authorization;

        if (!authHeader) {
            client.disconnect(true);
            throw new UnauthorizedException('Missing Authorization header');
        }

        if (!authHeader.startsWith('Bearer ')) {
            client.disconnect(true);
            throw new UnauthorizedException(
                "Authorization header must be prefixed with 'Bearer'",
            );
        }

        try {
            const token = authHeader.replace(/^Bearer /, '');
            client.userAddress = verifySessionJwt(token, this.signingSecret);
            return true;
        } catch (error) {
            client.disconnect(true);
            console.error('Unauthorized: invalid token');
            console.error(error);
            throw new UnauthorizedException('Invalid authorization token');
        }
    }
}
