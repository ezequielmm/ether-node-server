import { Injectable } from "@nestjs/common";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { StatusEventDTO, StatusEventHandler } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { hatchingStatus } from "./constants";
import { ENEMY_SWARM_MASTER_ID } from "src/game/components/enemy/constants";
import { ExpeditionService } from "src/game/components/expedition/expedition.service";

@StatusDecorator({
    status: hatchingStatus,
})
@Injectable()
export class HatchingStatus implements StatusEventHandler {

    constructor(private readonly enemyService:EnemyService,
                private readonly expeditionService:ExpeditionService){}

    async handle(dto: StatusEventDTO): Promise<void> {
        
        const { ctx, update, remove, status, source } = dto;
        const enemies = ctx.expedition.currentNode.data.enemies;
        
        console.log("-----------------------------------------------------------------------------------")
        console.log("Hatching..")
        if(EnemyService.isEnemy(source)){
            console.log(source.value.enemyId)
        }
        else{
            console.log("Not enemy sorce")
        }
        console.log("-----------------------------------------------------------------------------------")

        // Decrease counter
        status.args.counter--;

        if (status.args.counter > 0) {
            update(status.args);
            return;
        }

        //- If counter is 0 remove the status and make the effect:
        remove();

        if(EnemyService.isEnemy(source)){
            //- Kill the current enemy:
            this.enemyService.setHp(ctx, source.value.enemyId, 0);

            const swarmMaster = enemies.find(enemy => enemy.enemyId == ENEMY_SWARM_MASTER_ID);

            if(swarmMaster){
                const newHp = swarmMaster.hpCurrent + source.value.hpMax;
                this.enemyService.setHp(ctx, swarmMaster.enemyId, newHp);

                //- todo: Este mensaje puede cambiar para que se ejecute otra animacion en unity
                // ctx.client.emit(
                //     'PutData',
                //     StandardResponse.respond({
                //         message_type: SWARMessageType.CombatUpdate,
                //         action: SWARAction.SpawnEnemies,
                //         data: newEnemy,
                //     }),
                // );
            }

            // const aliveEnemies = enemies.filter(enemy => enemy.hpCurrent > 0)

            // await this.expeditionService.updateByFilter(
            //     {
            //         _id: ctx.expedition._id,
            //         status: ExpeditionStatusEnum.InProgress,
            //     },
            //     { $set: { 'currentNode.data.enemies': aliveEnemies } },
            // );
        }
    }
}