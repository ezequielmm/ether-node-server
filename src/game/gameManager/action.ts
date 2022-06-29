import { Activity } from '../elements/prototypes/activity';
import {
    LogActivityOptions,
    ActionError,
    ActionResponse,
} from './gameManager.interface';
import { GameManagerService } from './gameManager.service';

export class Action {
    constructor(
        public clientId: string,
        public name: string,
        private readonly gameManagerService: GameManagerService,
    ) {}

    public async log(
        activity: Activity,
        options: LogActivityOptions = {},
    ): Promise<void> {
        return this.gameManagerService.logActivity(
            this.clientId,
            activity,
            options,
        );
    }

    public async end(error?: ActionError): Promise<ActionResponse> {
        return this.gameManagerService.endAction(
            this.clientId,
            this.name,
            error,
        );
    }
}
