import { Injectable } from '@nestjs/common';
import { forEach } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { spawnEnemyEffect } from './contants';

export interface SpawnEnemyArgs {
    enemiesToSpawn: number[];
}

@EffectDecorator({
    effect: spawnEnemyEffect,
})
@Injectable()
export class SpawnEnemyEffect implements EffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(dto: EffectDTO<SpawnEnemyArgs>): Promise<void> {
        const {
            ctx,
            args: { enemiesToSpawn },
        } = dto;

        // First we check the enemies that we are going to spawn in
        // during combat and get their information from the database
        const enemies = await this.enemyService.findEnemiesById(enemiesToSpawn);

        // Now if we find enemies, we add them to the combat state and send a new message
        // To the frontend so they can show the proper animations
        if (enemies.length > 0) {
            // Here we add the enemies to the enemies array on the current state object

            forEach(enemies, (enemy) => {});
        }
    }
}
