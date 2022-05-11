import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { isValidAuthToken } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token: string = request.headers.authorization;

        return isValidAuthToken(token);
    }
}
