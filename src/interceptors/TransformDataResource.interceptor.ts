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
export class TransformDataResource<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        _context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<Response<T>> {
        return next.handle().pipe(map((data) => ({ data })));
    }
}
