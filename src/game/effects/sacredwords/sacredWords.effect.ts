import { Logger } from '@nestjs/common';
import { forEach, get } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { damageEffect } from '../damage/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { sacredwords } from './constants';
import { EnemyTypeEnum } from 'src/game/components/enemy/enemy.enum';
import { StatusService } from 'src/game/status/status.service';
import { burn } from 'src/game/status/burn/constants';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { AttachedStatus } from 'src/game/status/interfaces';

export interface SacreWordsEffectsArgs {
    shuffleTurns : number,
}
@EffectDecorator({
    effect: sacredwords,
})
export class sacredWordsEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(sacredwords.name);
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService
    ) {}

    async handle(dto: EffectDTO<SacreWordsEffectsArgs>): Promise<void> {
        const { ctx } = dto;
        const energy = ctx.expedition.currentNode.data.player.energy;
        await this.sacredWords(dto, energy);
    }

    protected async sacredWords(dto: EffectDTO<SacreWordsEffectsArgs>, energy: number) {
        const { ctx, source, target, action } = dto;

        //we get the alive enemies in the currentNode
        //const currentNodeEnemies = this.enemyService.getLiving(ctx);

        if (!target) {
            this.logger.debug(ctx.info, 'No target found for sacred words');
            return;
        }  

       // for(let currentEnemy of currentNodeEnemies){
        if(EnemyService.isEnemy(target) && energy > 0){
            
            // const enemyType = target.value.type;

            this.enemyService.calculateNewIntentions(ctx);

            
        }             
    } 
}
