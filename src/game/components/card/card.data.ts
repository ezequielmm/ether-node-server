import { Card } from './card.schema';
import { AttackCard, AttackCardUpgraded } from './data/attack.card';
import { ChargeCard, ChargeCardUpgraded } from './data/charge.card';
import { CounterCard, CounterCardUpgraded } from './data/counter.card';
import { DefenseCard, DefenseCardUpgraded } from './data/defend.card';
import { FeintCard, FeintCardUpgraded } from './data/feint.card';
import {
    FindWeaknessCard,
    FindWeaknessCardUpgraded,
} from './data/findWeakness.card';
import { FineEdgeCard, FineEdgeCardUpgraded } from './data/fineEdge.card';
import { FirstMoveCard, FirstMoveCardUpgraded } from './data/firstMove.card';
import {
    HeavenGraceCard,
    HeavenGraceCardUpgraded,
} from './data/heavenGrace.card';
import {
    HeraldOfPainCard,
    HeraldOfPainCardUpgraded,
} from './data/heraldOfPain.card';
import { HiltPunchCard, HiltPunchCardUpgraded } from './data/hiltPunch.card';
import { LungeCard, LungeCardUpgraded } from './data/lunge.card';
import { PrayCard, PrayCardUpgraded } from './data/pray.card';
import { ShieldBashCard, ShieldBashCardUpgraded } from './data/shieldBash.card';
import { TurtleCard, TurtleCardUpgraded } from './data/turtle.card';

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
];
