import { WsException } from '@nestjs/websockets';

export enum ErrorBehavior {
    ApplyDiff = 'applyDiff',
    FullSync = 'fullSync',
    ReturnToMainMenu = 'returnToMainMenu',
    None = 'none',
}

export class CustomException extends WsException {
    public readonly errorBehavior: ErrorBehavior;

    constructor(error: string | object, errorBehavior: ErrorBehavior) {
        super(error);
        this.errorBehavior = errorBehavior;
    }
}
