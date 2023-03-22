import { Controller, Get } from '@nestjs/common';
import { ExpeditionService } from "../game/components/expedition/expedition.service";

@Controller('highscrore')
export class HighscroreController {
    constructor(
        private readonly expeditionService: ExpeditionService,
    ){}
    @Get('/')
    async getVersion(): Promise<any> {
        const what = { value: 'nothing' };
        const who = await this.expeditionService.findTopScores();
        return who;
    }
}
