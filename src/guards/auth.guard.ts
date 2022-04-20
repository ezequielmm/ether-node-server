import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        let authorization: string = request.headers.authorization;

        if (!authorization) {
            return false;
        } else {
            authorization = authorization.startsWith('Bearer')
                ? authorization.replace('Bearer', '').trim()
                : authorization;

            return !authorization ? false : true;
        }
    }
}
