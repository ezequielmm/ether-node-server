import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthorizedRequest } from './auth.types';
import { verifySessionJwt } from '../utils/tokenHelpers';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req: AuthorizedRequest = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        if (!authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException(
                "Authorization header must be prefixed with 'Bearer'",
            );
        }

        try {
            const token = authHeader.replace(/^Bearer /, '');
            req.userAddress = verifySessionJwt(token);
            return true;
        } catch (error) {
            console.error('Unauthorized: invalid token');
            console.error(error);
            throw new UnauthorizedException('Invalid authorization token');
        }
    }
}
