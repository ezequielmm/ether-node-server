import { Prop } from "@typegoose/typegoose";

export class GearItem {
    @Prop()
    name: string;

    @Prop()
    trait: string;

    @Prop()
    category: string;

    @Prop()
    rarity: string;
}
