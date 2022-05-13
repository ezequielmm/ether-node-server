import { Activity } from '../elements/prototypes/activity';
import { ActionResponse } from './interfaces/index';
import { GameManagerService } from './gameManager.service';

export class Action {
    constructor(
        public clientId: string,
        public name: string,
        private readonly gameManagerService: GameManagerService,
    ) {}

    public async log(entity: any, activity: Activity): Promise<void> {
        this.gameManagerService.logActivity(this.clientId, activity);
    }

    public async end(): Promise<ActionResponse> {
        return this.gameManagerService.endAction(this.clientId, this.name);
    }
}
