import { Request } from 'express';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformDataResource<T> implements NestInterceptor<T, Response<T>>
{
    intercept(_context: ExecutionContext, next: CallHandler<T>) : Observable<any> {
        const request = _context.switchToHttp().getRequest() as Request;

        if(request.method === "GET" && request.url.includes('/leaderboard?')){
            return next.handle();
        }
        return next.handle().pipe(map((data) => ( {data} )));
    }
}
