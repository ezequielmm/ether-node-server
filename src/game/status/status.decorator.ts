import { STATUS_METADATA_KEY } from './contants';
import { StatusMetadata } from './interfaces';

export function StatusDecorator(status: StatusMetadata): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(STATUS_METADATA_KEY, status, target);
    };
}
