import { Injectable } from '@nestjs/common';
import { CardService } from '../components/card/card.service';
import { CharacterClassEnum } from '../components/character/character.enum';
import { CharacterService } from '../components/character/character.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';

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
    ) {}

    async handle(payload: InitExpeditionDTO): Promise<void> {
        const { playerId, playerName } = payload;

        const cards = await this.cardService.findAll();

        const character = await this.characterService.findOne({
            characterClass: CharacterClassEnum.Knight,
        });

        const map = this.expeditionService.getMap();

        await this.expeditionService.create({
            playerId,
            map,
            playerState: {
                playerName,
                characterClass: character.characterClass,
                hpMax: character.initialHealth,
                hpCurrent: character.initialHealth,
                gold: character.initialGold,
                cards: cards.map((card) => ({
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
                })),
                createdAt: new Date(),
            },
            status: ExpeditionStatusEnum.InProgress,
        });
    }
}
