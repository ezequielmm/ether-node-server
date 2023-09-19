import { Injectable } from "@nestjs/common";
import { StatusEventDTO, StatusEventHandler, StatusType } from "../interfaces";
import { StatusDecorator } from "../status.decorator";
import { revealStatus } from "./constants";
import { EnemyService } from "src/game/components/enemy/enemy.service";
import { ENEMY_BOOBY_TRAP_ID, ENEMY_MIMIC_ID } from "src/game/components/enemy/constants";
import { ExpeditionStatusEnum } from "src/game/components/expedition/expedition.enum";
import { ExpeditionService } from "src/game/components/expedition/expedition.service";
import { StandardResponse, SWARMessageType, SWARAction } from "src/game/standardResponse/standardResponse";
import { EnemyBuilderService } from "src/game/components/enemy/enemy-builder.service";

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

        // Remove status if counter is 0
        if (status.args.counter === 0) {
            remove();
            
            if(EnemyService.isEnemy(source)){
                this.enemyService.setHp(ctx, source.value.enemyId, 0);

                let enemyFromDB;

                if(ENEMY_BOOBY_TRAP_ID)
                    enemyFromDB = await this.enemyService.findById(ENEMY_MIMIC_ID);

                if(enemyFromDB){
                    const newEnemy = await this.enemyService.createNewStage2EnemyWithStatuses(enemyFromDB, source.value.statuses[StatusType.Buff], source.value.statuses[StatusType.Debuff]);
                    enemies.unshift(...[newEnemy]);

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
                        { $set: { 'currentNode.data.enemies': enemies } },
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

        } else {
            update(status.args);
        }
    }
}