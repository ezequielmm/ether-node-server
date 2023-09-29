import { Injectable } from "@nestjs/common";
import { StatusEventDTO, StatusEventHandler, StatusType } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { revealStatus } from "./constants";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { ExpeditionStatusEnum } from "src/game/components/expedition/expedition.enum";
import { ExpeditionService } from "src/game/components/expedition/expedition.service";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";
import { boobyTrapData } from "src/game/components/enemy/data/boobyTrap.enemy";
import { mimicData } from "src/game/components/enemy/data/mimic.enemy";

@StatusDecorator({
    status: revealStatus,
})
@Injectable()
export class RevealStatus implements StatusEventHandler {

    constructor(private readonly enemyService:EnemyService, 
                private readonly expeditionService:ExpeditionService){}


    async handle(dto: StatusEventDTO): Promise<void> {

        const { ctx, update, remove, status, source } = dto;
        const enemies = ctx.expedition.currentNode.data.enemies;
        
        // Decrease counter
        status.args.counter--;
        if(status.args.counter > 0){
            update(status.args);
            return;
        }

        //- If counter is 0 remove the status and make the effect:
        remove();
        
        if(EnemyService.isEnemy(source)){
            this.enemyService.setHp(ctx, source.value.id, 0);
            let enemies = ctx.expedition.currentNode.data.enemies;
            enemies = enemies.map(enemy => {
                if (enemy.id === source.value.id) {
                    return { ...enemy, hpCurrent: 0 }; 
                }
                return enemy; 
            });

            let enemyFromDB;

            if(source.value.enemyId === boobyTrapData.enemyId)
                enemyFromDB = await this.enemyService.findById(mimicData.enemyId);

            if(enemyFromDB){
                const aliveEnemies = enemies.filter(enemy => enemy.hpCurrent > 0)
                const buffs = source.value.statuses[StatusType.Buff].filter(buff => buff.name !== revealStatus.name);
                const newEnemy = await this.enemyService.createNewStage2EnemyWithStatuses(enemyFromDB, buffs, source.value.statuses[StatusType.Debuff]);
                aliveEnemies.unshift(...[newEnemy]);

                //- todo: Este mensaje puede cambiar para que se ejecute otra animacion en unity
                ctx.client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageType.CombatUpdate,
                        action: SWARAction.SpawnEnemies,
                        data: newEnemy,
                    }),
                );

                await this.expeditionService.updateByFilter(
                    {
                        _id: ctx.expedition._id,
                        status: ExpeditionStatusEnum.InProgress,
                    },
                    { $set: { 'currentNode.data.enemies': aliveEnemies } },
                );

                // Now we generate a new ctx to generate the new enemy intentions
                const newCtx = await this.expeditionService.getGameContext(ctx.client);

                await this.enemyService.setCurrentScript(
                    newCtx,
                    enemyFromDB.enemyId,
                    {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]},
                );
            }
        }
    }
}