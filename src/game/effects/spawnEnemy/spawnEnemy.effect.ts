import { Injectable } from '@nestjs/common';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { spawnEnemyEffect } from './contants';

@EffectDecorator({
    effect: spawnEnemyEffect,
})
@Injectable()
export class SpawnEnemyEffect implements EffectHandler {
    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;

        // First we check the enemies that we are going to spawn in
        // during combat
    }
}
