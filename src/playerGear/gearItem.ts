import { Prop } from '@typegoose/typegoose';

export class GearItem {
    @Prop()
    gearId: string;

    @Prop()
    name: string;

    @Prop()
    trait: string;

    @Prop()
    category: string;

    @Prop()
    rarity: string;
}
