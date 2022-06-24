import { STATUS_METADATA } from './contants';
import { StatusConfig } from './interfaces';

export function Status(status: StatusConfig): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(STATUS_METADATA, status, target);
    };
}
