import { Prop } from '@typegoose/typegoose';
import { GameContext } from '../../interfaces';
import { Trinket } from '../trinket.schema';

export class OneUseTrinket extends Trinket {
    @Prop({ default: false })
    private used: boolean;

    isUsed(): boolean {
        return this.used;
    }

    async markAsUsed(ctx: GameContext): Promise<void> {
        this.used = true;
        ctx.expedition.markModified('playerState.trinkets');
        await ctx.expedition.save();
    }
}
