import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameManagerService } from 'src/game/gameManger/gameManager.service';
import { ActionError } from 'src/game/gameManger/interfaces';
import { CustomException, ErrorBehavior } from './custom.exception';

@Catch()
export class CustomExceptionFilter extends BaseWsExceptionFilter {
    private readonly logger: Logger = new Logger(CustomExceptionFilter.name);

    constructor(private readonly gameManagerService: GameManagerService) {
        super();
    }

    async catch(exception: unknown, host: ArgumentsHost) {
        if (!this.isWsRequest(host)) {
            super.catch(exception, host);
            return;
        }

        const client = host.switchToWs().getClient<Socket>();
        const action = this.gameManagerService.getLastActionByClientId(
            client.id,
        );

        if (!action) {
            this.logger.warn('Game manager not implemented yet');
            super.catch(exception, host);
            return;
        }

        let error: ActionError;

        if (exception instanceof CustomException) {
            error = {
                message: exception.message,
                behavior: exception.errorBehavior,
            };
        } else if (exception instanceof Error) {
            error = {
                message: exception.message,
                behavior: ErrorBehavior.ReturnToMainMenu,
            };
        } else {
            error = {
                message: 'Unknown error',
                behavior: ErrorBehavior.ReturnToMainMenu,
            };
        }

        this.logger.warn({
            error,
            exception,
            action: {
                clientId: action?.clientId,
                name: action?.name,
            },
        });

        const response = await action.end(error);

        const callback = host.getArgByIndex(2);

        if (callback && typeof callback === 'function') {
            callback(JSON.stringify(response));
        }
    }

    private isWsRequest(host: ArgumentsHost): boolean {
        return host.getType() == 'ws';
    }
}
