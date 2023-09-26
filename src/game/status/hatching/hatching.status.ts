import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { StatusEventDTO, StatusEventHandler } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { hatchingStatus } from "./constants";
import { ENEMY_SWARM_MASTER_ID } from "src/game/components/enemy/constants";
import { ExpeditionService } from "src/game/components/expedition/expedition.service";
import { ExpeditionStatusEnum } from "src/game/components/expedition/expedition.enum";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";

@StatusDecorator({
    status: hatchingStatus,
})
@Injectable()
export class HatchingStatus implements StatusEventHandler {

    constructor(private readonly enemyService:EnemyService,
                private readonly expeditionService:ExpeditionService){}

    async handle(dto: StatusEventDTO): Promise<void> {
        
        const { ctx, update, remove, status, source } = dto;
        let enemies = ctx.expedition.currentNode.data.enemies;

        // Decrease counter
        status.args.counter--;


        if(status.args.counter === 0){
             //- If counter is 0 remove the status and make the effect:
            if(EnemyService.isEnemy(source)){

                console.log("-----------------------------------------------------------------------------------")
                console.log("Hatching..")

                remove();

                const cocoonHP = source.value.hpCurrent;
                console.log("cocoonHP: " + cocoonHP);

                //- Kill the current enemy:
                await this.enemyService.setHp(ctx, source.value.id, 0);

                enemies = enemies.map(enemy => {
                    if (enemy.id === source.value.id) {
                        return { ...enemy, hpCurrent: 0 }; 
                    }
                    return enemy; 
                });

                const swarmMaster = enemies.find(enemy => enemy.enemyId == ENEMY_SWARM_MASTER_ID);

                if(swarmMaster){
                    let newHp = swarmMaster.hpCurrent + source.value.hpCurrent;
                    newHp = await this.enemyService.setHp(ctx, swarmMaster.id, newHp);
                    source.value.hpCurrent = 0;

                    enemies = enemies.map(enemy => {
                        if (enemy.enemyId === ENEMY_SWARM_MASTER_ID) {
                            return { ...enemy, hpCurrent: newHp }; 
                        }
                        return enemy; 
                    });

                    const aliveEnemies = enemies.filter(enemy => enemy.hpCurrent > 0)
                    
                    ctx.expedition.currentNode.data.enemies = aliveEnemies;
                    ctx.expedition.markModified('currentNode.data.enemies');
                    await ctx.expedition.save();

                    //- todo: Este mensaje puede cambiar para que se ejecute otra animacion en unity
                    ctx.client.emit(
                        'PutData',
                        StandardResponse.respond({
                            message_type: SWARMessageType.CombatUpdate,
                            action: SWARAction.RemoveEnemies,
                            data: source.value,
                        }),
                    );
                }

            }
            console.log("-----------------------------------------------------------------------------------")
        }
        else{
            update(status.args);
        }

    }
}