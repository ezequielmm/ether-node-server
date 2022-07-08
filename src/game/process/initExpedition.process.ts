import { Injectable } from '@nestjs/common';
import { CardService } from '../components/card/card.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { CharacterService } from '../components/character/character.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';

interface InitExpeditionDTO {
    playerId: number;
    playerName: string;
}

@Injectable()
export class InitExpeditionProcess {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
        private readonly settingsService: SettingsService,
    ) {}

    async handle(payload: InitExpeditionDTO): Promise<void> {
        const { playerId, playerName } = payload;

        const character = await this.characterService.findOne({
            characterClass: CharacterClassEnum.Knight,
        });

        const map = this.expeditionService.getMap();

        const cards = await this.generatePlayerDeck();

        await this.expeditionService.create({
            playerId,
            map,
            playerState: {
                playerName,
                characterClass: character.characterClass,
                hpMax: character.initialHealth,
                hpCurrent: character.initialHealth,
                gold: character.initialGold,
                cards,
                createdAt: new Date(),
            },
            status: ExpeditionStatusEnum.InProgress,
        });
    }

    private async generatePlayerDeck(): Promise<
        IExpeditionPlayerStateDeckCard[]
    > {
        const cards = await this.cardService.findAll();

        const {
            player: { deckSize, deckSettings },
        } = await this.settingsService.getSettings();

        /*return cards.map((card) => ({
            cardId: card.cardId,
            id: card._id.toString(),
            name: card.name,
            description: card.description,
            rarity: card.rarity,
            energy: card.energy,
            cardType: card.cardType,
            pool: card.pool,
            properties: card.properties,
            keywords: card.keywords,
            isTemporary: false,
            showPointer: card.showPointer,
        }));*/
    }
}
