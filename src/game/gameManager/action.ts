import { Activity } from '../elements/prototypes/activity';
import { ActionResponse, LogActivityOptions } from './interfaces/index';
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

    public async end(): Promise<ActionResponse> {
        return this.gameManagerService.endAction(this.clientId, this.name);
    }
}
