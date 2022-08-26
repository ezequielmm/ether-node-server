import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MoveCardAction {
    private readonly logger: Logger = new Logger(MoveCardAction.name);
}
