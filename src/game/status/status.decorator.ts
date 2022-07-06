import { STATUS_METADATA } from './contants';
import { StatusMetadata } from './interfaces';

export function StatusDecorator(status: StatusMetadata): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(STATUS_METADATA, status, target);
    };
}
