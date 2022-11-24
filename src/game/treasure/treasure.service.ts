import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { getRandomBetween } from 'src/utils';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { TreasureInterface } from './interfaces';
import { LargeChest, MediumChest, SmallChest } from './treasure.enum';

@Injectable()
export class TreasureService {
    constructor(private readonly expeditionService: ExpeditionService) {}

    generateTreasure(): TreasureInterface {
        const chance: number = getRandomBetween(1, 100);

        if (chance <= LargeChest.chance) {
            return {
                name: LargeChest.name,
                size: LargeChest.size,
                isOpen: false,
            };
        } else if (
            chance > LargeChest.chance &&
            chance <= MediumChest.chance + LargeChest.chance
        ) {
            return {
                name: MediumChest.name,
                size: MediumChest.size,
                isOpen: false,
            };
        } else {
            return {
                name: SmallChest.name,
                size: SmallChest.size,
                isOpen: false,
            };
        }
    }

    async openChest(client: Socket): Promise<void> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        await this.expeditionService.updateByFilter(
            {
                clientId: client.id,
                'map.id': currentNode.nodeId,
            },
            {
                $set: {
                    'map.$.private_data.treasure.isOpen': true,
                },
            },
        );
    }
}
