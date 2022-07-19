import { Injectable } from '@nestjs/common';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { confusion } from './constants';

@StatusDecorator({
    status: confusion,
})
@Injectable()
export class ConfusionStatus implements StatusEventHandler {
    async handle(dto: StatusEventDTO): Promise<void> {
        // This needs to implement the real confusion, for a later task
        console.log(dto);
    }
}
