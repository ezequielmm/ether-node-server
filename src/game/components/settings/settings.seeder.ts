import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { SettingsService } from './settings.service';

@Injectable()
export class SettingsSeeder implements Seeder {
    constructor(private readonly settingsService: SettingsService) {}

    async seed(): Promise<any> {
        return this.settingsService.create({
            initialEnergy: 3,
            maxEnergy: 3,
            initialHandPileSize: 5,
            initialDeckSize: 10,
            initialPotionChance: 40,
            maxCardRewardsInCombat: 3,
            maxSteps: 10,
            maxNodes: 6,
            maxCardsOnMerchantNode: 6,
            maxPotionsOnMerchantNode: 5,
            maxTrinketsOnMerchantNode: 5,
        });
    }

    async drop(): Promise<any> {
        return this.settingsService.deleteMany({});
    }
}
