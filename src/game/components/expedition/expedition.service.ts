import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import {
    CardDestinationEnum,
    ExpeditionStatusEnum,
} from '../../expedition/enums';
import {
    AddCardToPileDTO,
    CardExistsDTO,
    CreateExpeditionDTO,
    GetExpeditionDTO,
    TakeCardFromDrawPileDTO,
    UpdateExpeditionDTO,
    UpdateExpeditionFilterDTO,
    UpdatePlayerEnergyDTO,
    UpdateSocketClientDTO,
    ModifyHPMaxDTO,
    TurnChangeDTO,
    SetPlayerDefense,
    GetPlayerState,
    UpdatePlayerHpDTO,
} from '../../expedition/dto';
import {
    IExpeditionNode,
    IExpeditionCurrentNode,
    IExpeditionPlayerStateDeckCard,
    IExpeditionPlayerState,
} from '../../expedition/interfaces';
import { CardService } from '../card/card.service';
import { generateMap, restoreMap } from '../../expedition/map/app';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly cardService: CardService,
    ) {}

    async playerHasExpeditionInProgress(player_id: number): Promise<boolean> {
        const itemExists = await this.expedition.exists({
            player_id,
            status: ExpeditionStatusEnum.InProgress,
        });
        return itemExists !== null;
    }

    async create(payload: CreateExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition.create(payload);
    }

    async cancel(player_id: number): Promise<boolean> {
        const exists = await this.playerHasExpeditionInProgress(player_id);

        if (!exists) {
            return false;
        }

        await this.expedition.updateOne(
            { player_id, status: ExpeditionStatusEnum.InProgress },
            { status: ExpeditionStatusEnum.Canceled },
        );

        return true;
    }

    getMap(): IExpeditionNode[] {
        const map = generateMap();
        return map.getMap;
    }

    async updateClientId(
        payload: UpdateSocketClientDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, player_id } = payload;
        return this.expedition.findOneAndUpdate(
            {
                player_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            { client_id },
            { new: true },
        );
    }

    async findOne(payload: GetExpeditionDTO): Promise<ExpeditionDocument> {
        return this.expedition.findOne(payload).lean();
    }

    async getExpeditionMapNode(
        client_id: string,
        node_id: number,
    ): Promise<IExpeditionNode> {
        const { map } = await this.expedition
            .findOne({
                client_id,
                'map.id': node_id,
            })
            .select('map')
            .lean();
        if (!map) return null;
        return restoreMap(map, client_id).fullCurrentMap.get(node_id);
    }

    async getExpeditionMap(client_id: string): Promise<IExpeditionNode[]> {
        const { map } = await this.expedition
            .findOne({ client_id })
            .select('map')
            .lean();
        // TODO: throw error if there is no expedition
        if (!map) return null;
        return restoreMap(map, client_id).getMap;
    }

    async getDeckCards(
        client_id: string,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        const {
            player_state: {
                deck: { cards },
            },
        } = await this.expedition
            .findOne({ client_id })
            .select('player_state.deck')
            .lean();

        return cards;
    }

    async update(
        filter: UpdateExpeditionFilterDTO,
        payload: UpdateExpeditionDTO,
    ): Promise<ExpeditionDocument> {
        return this.expedition.findOneAndUpdate(filter, payload, {
            new: true,
        });
    }

    async cardExistsOnPlayerHand(payload: CardExistsDTO): Promise<boolean> {
        const { card_id, client_id } = payload;
        const itemExists = await this.expedition.exists({
            client_id,
            status: ExpeditionStatusEnum.InProgress,
            'current_node.data.player.cards.hand.id': card_id,
        });
        return itemExists !== null;
    }

    async getCurrentNodeByClientId(
        client_id: string,
    ): Promise<IExpeditionCurrentNode> {
        const { current_node } = await this.expedition
            .findOne({ client_id, status: ExpeditionStatusEnum.InProgress })
            .select('current_node')
            .lean();
        return current_node;
    }

    async moveCardFromPlayerHandToDiscardPile(
        payload: CardExistsDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, card_id } = payload;

        const current_node = await this.getCurrentNodeByClientId(client_id);

        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            {
                $pull: {
                    'current_node.data.player.cards.hand': {
                        id: card_id,
                    },
                },
                $push: {
                    'current_node.data.player.cards.discard':
                        current_node.data.player.cards.hand.filter((card) => {
                            return card.id === card_id;
                        })[0],
                },
            },
            { new: true },
        );
    }

    async moveCardFromPlayerHandToExhaustPile(
        payload: CardExistsDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, card_id } = payload;

        const current_node = await this.getCurrentNodeByClientId(client_id);

        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            {
                $pull: {
                    'current_node.data.player.cards.hand': {
                        id: card_id,
                    },
                },
                $push: {
                    'current_node.data.player.cards.exhaust':
                        current_node.data.player.cards.hand.filter((card) => {
                            return card.id === card_id;
                        })[0],
                },
            },
            { new: true },
        );
    }

    async updatePlayerEnergy(
        payload: UpdatePlayerEnergyDTO,
    ): Promise<Expedition> {
        const { client_id, energy } = payload;
        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            { 'current_node.data.player.energy': energy },
            { new: true },
        );
    }

    async moveAllCardsToDiscardPile(
        client_id: string,
    ): Promise<ExpeditionDocument> {
        const currentNode = await this.getCurrentNodeByClientId(client_id);

        const discardPile = currentNode.data.player.cards.discard;
        const handPile = currentNode.data.player.cards.hand;

        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            {
                'current_node.data.player.cards.hand': [],
                'current_node.data.player.cards.discard': [
                    ...(discardPile !== undefined ? discardPile : []),
                    ...handPile,
                ],
            },
            { new: true },
        );
    }

    async moveDiscardPileToDrawPile(
        client_id: string,
    ): Promise<ExpeditionDocument> {
        const currentNode = await this.getCurrentNodeByClientId(client_id);

        const {
            data: {
                player: {
                    cards: {
                        discard: discardPile,
                        hand: handPile,
                        draw: originalDrawPile,
                    },
                },
            },
        } = currentNode;

        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            {
                'current_node.data.player.cards.discard': [],
                'current_node.data.player.cards.draw': [
                    ...handPile,
                    ...discardPile,
                    ...originalDrawPile,
                ],
            },
            { new: true },
        );
    }

    async moveCardsFromDrawToHandPile(
        payload: TakeCardFromDrawPileDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, cards_to_take } = payload;

        const currentNode = await this.getCurrentNodeByClientId(client_id);

        let drawPile = currentNode.data.player.cards.draw;

        if (drawPile.length < cards_to_take) {
            const newCurrentNode = await this.moveDiscardPileToDrawPile(
                client_id,
            );

            drawPile = newCurrentNode.current_node.data.player.cards.draw;
        }

        const handPile = drawPile
            .sort(() => 0.5 - Math.random())
            .slice(0, cards_to_take);

        const drawCards = this.cardService.removeHandCardsFromDrawPile(
            drawPile,
            handPile,
        );

        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            {
                'current_node.data.player.cards.draw': drawCards,
                'current_node.data.player.cards.hand': handPile,
            },
            { new: true },
        );
    }

    async addCardToPile(
        payload: AddCardToPileDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, destination, card_id, is_temporary } = payload;

        const card = await this.cardService.findById(card_id);

        const newCard = {
            id: card._id.toString(),
            name: card.name,
            description: card.description,
            rarity: card.rarity,
            energy: card.energy,
            card_type: card.card_type,
            pool: card.pool,
            properties: card.properties,
            keywords: card.keywords,
            is_temporary,
        };

        let newDestination = '';

        switch (destination) {
            case CardDestinationEnum.Discard:
                newDestination = 'current_node.data.player.cards.discard';
                break;
            case CardDestinationEnum.Hand:
                newDestination = 'current_node.data.player.cards.hand';
                break;
            case CardDestinationEnum.DrawRandom:
                newDestination = 'current_node.data.player.cards.draw';
                break;
            case CardDestinationEnum.DrawTop:
                newDestination = 'current_node.data.player.cards.draw';
                break;
        }

        return await this.expedition.findOneAndUpdate(
            {
                client_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                $push: {
                    [newDestination]: newCard,
                },
            },
            { new: true },
        );
    }

    async modifyHPMaxValue(
        payload: ModifyHPMaxDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, hp_value } = payload;

        const {
            player_state: { hp_current },
        } = await this.expedition
            .findOne({
                client_id,
                status: ExpeditionStatusEnum.InProgress,
            })
            .lean();

        const newHpValue = Math.min(hp_current, hp_value);

        return await this.expedition.findOneAndUpdate(
            {
                client_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                'player_state.hp_current': newHpValue,
                'player_state.hp_max': hp_value,
            },
            { new: true },
        );
    }

    async turnChange(payload: TurnChangeDTO): Promise<ExpeditionDocument> {
        const { client_id } = payload;

        const {
            data: { round },
        } = await this.getCurrentNodeByClientId(client_id);

        const newRound = round + 1;

        return await this.expedition.findOneAndUpdate(
            {
                client_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                'current_node.data.round': newRound,
            },
            { new: true },
        );
    }

    async setPlayerDefense(
        payload: SetPlayerDefense,
    ): Promise<ExpeditionDocument> {
        const { client_id, value } = payload;

        const {
            data: {
                player: { defense },
            },
        } = await this.getCurrentNodeByClientId(client_id);

        const newDefenseValue = defense + value;

        return await this.expedition.findOneAndUpdate(
            {
                client_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            { 'current_node.data.player.defense': newDefenseValue },
            { new: true },
        );
    }

    async getPlayerStateByClientId(
        payload: GetPlayerState,
    ): Promise<IExpeditionPlayerState> {
        const { client_id } = payload;

        const playerState = await this.expedition
            .findOne({ client_id, status: ExpeditionStatusEnum.InProgress })
            .select('player_state')
            .lean();

        if (!playerState) {
            throw new Error('Player state not found');
        }

        return playerState.player_state;
    }

    async updatePlayerHp(payload: UpdatePlayerHpDTO): Promise<void> {
        // Update player hp
        const response = await this.expedition.updateOne(
            {
                client_id: payload.client_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                $set: {
                    'player_state.hp_current': payload.hp,
                },
            },
        );

        if (response.modifiedCount === 0) {
            throw new Error('Player state not found');
        }
    }
}
