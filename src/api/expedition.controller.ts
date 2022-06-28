import { Controller, Logger, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { CardService } from '../game/components/card/card.service';
import { CharacterService } from '../game/components/character/character.service';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
@UseGuards(new AuthGuard())
export class ExpeditionController {
    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
    ) {}

    private readonly logger: Logger = new Logger(ExpeditionController.name);
}
