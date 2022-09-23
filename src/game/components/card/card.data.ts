import { Card } from './card.schema';
import { AdeptCard, AdeptCardUpgraded } from './data/adept.card';
import { AnticipateCard, AnticipateCardUpgraded } from './data/anticipate.card';
import { ArmorUpCard, ArmorUpCardUpgraded } from './data/armorUp.card';
import { AttackCard, AttackCardUpgraded } from './data/attack.card';
import { BackflipCard, BackflipCardUpgraded } from './data/backflip.card';
import { BackHandCard, BackHandCardUpgraded } from './data/backhand.card';
import { BlusterCard, BlusterCardUpgraded } from './data/bluster.card';
import { BolsterCard, BolsterCardUpgraded } from './data/bolster.card';
import { BraceCard, BraceCardUpgraded } from './data/brace.card';
import { BulkUpCard, BulkUpCardUpgraded } from './data/bulkUp.card';
import { BurnedCard } from './data/burned.card';
import { ChargeCard, ChargeCardUpgraded } from './data/charge.card';
import { CounterCard, CounterCardUpgraded } from './data/counter.card';
import { DefenseCard, DefenseCardUpgraded } from './data/defend.card';
import { DivineGiftCard, DivineGiftCardUpgraded } from './data/divineGift.card';
import { DoubleDownCard, DoubleDownCardUpgraded } from './data/doubleDown.card';
import {
    ExecutionersBlowCard,
    ExecutionersBlowCardUpgraded,
} from './data/executionersBlow.card';
import { FadeCard, FadeCardUpgraded } from './data/fade.card';
import { FeintCard, FeintCardUpgraded } from './data/feint.card';
import {
    FindWeaknessCard,
    FindWeaknessCardUpgraded,
} from './data/findWeakness.card';
import { FineEdgeCard, FineEdgeCardUpgraded } from './data/fineEdge.card';
import { FirstMoveCard, FirstMoveCardUpgraded } from './data/firstMove.card';
import { FlurryCard, FlurryCardUpgraded } from './data/flurry.card';
import { ForceFieldCard, ForceFieldCardUpgraded } from './data/forceField.card';
import { FrontflipCard, FrontflipCardUpgraded } from './data/frontflip.card';
import {
    GiveNoGroundCard,
    GiveNoGroundCardUpgraded,
} from './data/giveNoGround.card';
import { GNCard, GNCardUpgraded } from './data/gn.card';
import { HeadButtCard, HeadButtCardUpgraded } from './data/headButt.card';
import {
    HeavenGraceCard,
    HeavenGraceCardUpgraded,
} from './data/heavenGrace.card';
import {
    HeraldOfPainCard,
    HeraldOfPainCardUpgraded,
} from './data/heraldOfPain.card';
import { HiltPunchCard, HiltPunchCardUpgraded } from './data/hiltPunch.card';
import { InterceptCard, InterceptCardUpgraded } from './data/intercept.card';
import { IntimidateCard, IntimidateCardUpgraded } from './data/intimidate.card';
import {
    InvokeBlessingCard,
    InvokeBlessingCardUpgraded,
} from './data/invokeBlessing.card';
import { KegChugCard, KegChugCardUpgraded } from './data/kegChug.card';
import { KindleCard, KindleCardUpgraded } from './data/kindle.card';
import {
    KnightsResolveCard,
    KnightsResolveCardUpgraded,
} from './data/knightsResolve.card';
import { KnockDownCard, KnockDownCardUpgraded } from './data/knockDown.card';
import { LastResortCard, LastResortCardUpgraded } from './data/lastResort.card';
import { LungeCard, LungeCardUpgraded } from './data/lunge.card';
import { OnARollCard, OnARollCardUpgraded } from './data/onARoll.card';
import {
    PerfectTimingCard,
    PerfectTimingCardUpgraded,
} from './data/perfectTiming.card';
import { PlantFeetCard, PlantFeetCardUpgraded } from './data/plantFeet.card';
import { PrayCard, PrayCardUpgraded } from './data/pray.card';
import {
    QuickToAdaptCard,
    QuickToAdaptCardUpgraded,
} from './data/quickToAdapt.card';
import { RecoverCard, RecoverCardUpgraded } from './data/recover.data';
import { Refocus } from './data/refocus.card';
import { RepositionCard, RepositionCardUpgraded } from './data/reposition.card';
import { RoundHouseCard, RoundHouseCardUpgraded } from './data/roundHouse.card';
import { ShakeItOffCard, ShakeItOffCardUpgraded } from './data/shakeItOff.card';
import {
    SharpenBladeCard,
    SharpenBladeCardUpgraded,
} from './data/sharpenBlade.card';
import { ShieldBashCard, ShieldBashCardUpgraded } from './data/shieldBash.card';
import {
    ShieldPlantCard,
    ShieldPlantCardUpgraded,
} from './data/shieldPlant.card';
import { ShoutCard, ShoutCardUpgraded } from './data/shout.card';
import { SiphonCard, SiphonCardUpgraded } from './data/siphon.card';
import { SparkCard, SparkCardUpgraded } from './data/Spark.card';
import { SpikeArmorCard, SpikeArmorCardUpgraded } from './data/spikeArmor.card';
import {
    TasteOfBloodCard,
    TasteOfBloodCardUpgraded,
} from './data/tasteOfBlood.card';
import {
    TightenGripCard,
    TightenGripCardUpgraded,
} from './data/tightenGrip.card';
import {
    TightenStrapsCard,
    TightenStrapsCardUpgraded,
} from './data/tightenStraps.card';
import { TorchCard, TorchCardUpgraded } from './data/torch.card';
import { TurtleCard, TurtleCardUpgraded } from './data/turtle.card';
import {
    TwistTheBladeCard,
    TwistTheBladeCardUpgraded,
} from './data/twistTheBlade.card';
import {
    UltraLethalityCard,
    UltraLethalityCardUpgraded,
} from './data/ultraLethality.card';
import { WrathCard, WrathCardUpgraded } from './data/wrath.card';

export const data: Card[] = [
    AttackCard,
    AttackCardUpgraded,
    DefenseCard,
    DefenseCardUpgraded,
    LungeCard,
    LungeCardUpgraded,
    CounterCard,
    CounterCardUpgraded,
    FindWeaknessCard,
    FindWeaknessCardUpgraded,
    ChargeCard,
    ChargeCardUpgraded,
    ShieldBashCard,
    ShieldBashCardUpgraded,
    HiltPunchCard,
    HiltPunchCardUpgraded,
    FineEdgeCard,
    FineEdgeCardUpgraded,
    TurtleCard,
    TurtleCardUpgraded,
    HeavenGraceCard,
    HeavenGraceCardUpgraded,
    FirstMoveCard,
    FirstMoveCardUpgraded,
    PrayCard,
    PrayCardUpgraded,
    FeintCard,
    FeintCardUpgraded,
    HeraldOfPainCard,
    HeraldOfPainCardUpgraded,
    TasteOfBloodCard,
    TasteOfBloodCardUpgraded,
    QuickToAdaptCard,
    QuickToAdaptCardUpgraded,
    KindleCard,
    KindleCardUpgraded,
    ShakeItOffCard,
    ShakeItOffCardUpgraded,
    FadeCard,
    FadeCardUpgraded,
    GiveNoGroundCard,
    GiveNoGroundCardUpgraded,
    PerfectTimingCard,
    PerfectTimingCardUpgraded,
    SiphonCard,
    SiphonCardUpgraded,
    InvokeBlessingCard,
    InvokeBlessingCardUpgraded,
    GNCard,
    GNCardUpgraded,
    HeadButtCard,
    HeadButtCardUpgraded,
    PlantFeetCard,
    PlantFeetCardUpgraded,
    DoubleDownCard,
    DoubleDownCardUpgraded,
    IntimidateCard,
    IntimidateCardUpgraded,
    SpikeArmorCard,
    SpikeArmorCardUpgraded,
    RepositionCard,
    RepositionCardUpgraded,
    RecoverCard,
    RecoverCardUpgraded,
    TightenGripCard,
    TightenGripCardUpgraded,
    KegChugCard,
    KegChugCardUpgraded,
    LastResortCard,
    LastResortCardUpgraded,
    FlurryCard,
    FlurryCardUpgraded,
    Refocus,
    BackHandCard,
    BackHandCardUpgraded,
    UltraLethalityCard,
    UltraLethalityCardUpgraded,
    BlusterCard,
    BlusterCardUpgraded,
    InterceptCard,
    InterceptCardUpgraded,
    ForceFieldCard,
    ForceFieldCardUpgraded,
    BolsterCard,
    BolsterCardUpgraded,
    AdeptCard,
    AdeptCardUpgraded,
    DivineGiftCard,
    DivineGiftCardUpgraded,
    ExecutionersBlowCard,
    ExecutionersBlowCardUpgraded,
    KnightsResolveCard,
    KnightsResolveCardUpgraded,
    ShieldPlantCard,
    ShieldPlantCardUpgraded,
    SparkCard,
    SparkCardUpgraded,
    TorchCard,
    TorchCardUpgraded,
    SharpenBladeCard,
    SharpenBladeCardUpgraded,
    OnARollCard,
    OnARollCardUpgraded,
    ShoutCard,
    ShoutCardUpgraded,
    AnticipateCard,
    AnticipateCardUpgraded,
    TwistTheBladeCard,
    TwistTheBladeCardUpgraded,
    KnockDownCard,
    KnockDownCardUpgraded,
    BackflipCard,
    BackflipCardUpgraded,
    FrontflipCard,
    FrontflipCardUpgraded,
    BurnedCard,
    RoundHouseCard,
    RoundHouseCardUpgraded,
    BraceCard,
    BraceCardUpgraded,
    BulkUpCard,
    BulkUpCardUpgraded,
    ArmorUpCard,
    ArmorUpCardUpgraded,
    TightenStrapsCard,
    TightenStrapsCardUpgraded,
    WrathCard,
    WrathCardUpgraded,
];
