import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from './enums/index';

export const data = [
    {
        Name: 'Sporemonger',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Small,
        Description:
            'Floating enemy. Camouflaged, but will flare its foliage "hair" to appear more intimidating. Mouth can spit a toxic slime at enemies.',
        hpMin: 42,
        hpMax: 46,
    },
    {
        Name: 'BarkCharger',
        Type: EnemyTypeEnum.Beast,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Small,
        description: '',
        hpMin: 10,
        hpMax: 12,
    },
    {
        Name: 'GroundMoth',
        Type: EnemyTypeEnum.Beast,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Medium,
        description:
            'His tiny face is actually fake and a lure to make him seem kinda harmless despite his size. When he unrolls maybe he reveals his real face, on the chest area (like his fluffy collar ends-up being his hair), with a monstrous appendage like a butterfly\'s trump that will lash at knights to drink their "nectar"... blood!',
        hpMin: 48,
        hpMax: 56,
    },
    {
        Name: 'SwampGoblin1',
        Type: EnemyTypeEnum.Fey,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Medium,
        description:
            'Elderly and hunch-backed, she tries to appear harmless but she is aggressive and has Magic powers. Her MAGIC SPORE STAFF is like a huge wand - it can be used to cover enemies in magic toxic spores and choke them',
        hpMin: 34,
        hpMax: 40,
    },
    {
        Name: 'SwampGoblin2',
        Type: EnemyTypeEnum.Fey,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Medium,
        description:
            'Variation of SwampGoblin1: Shift color palette, make staff a thorny spear, adjust costume (like a bloody red hood)',
        hpMin: 38,
        hpMax: 44,
    },
    {
        Name: 'Trapelican',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Small,
        description:
            'He walks around the swamp gracefully with his mouth open, looking ethereal and plant-like until a knight gets too close, and then SNAP!',
        hpMin: 26,
        hpMax: 30,
    },
    {
        Name: 'MimicFrog1',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Small,
        description:
            'Camouflage with only his plant-like back sticking out of the water or soft ground, he comes out to STUN and PUMMEL unsuspecting travelers with his supersonic CROAKS (and depletes their health until he can consume them with his sticky tongue and soft mouth)',
        hpMin: 22,
        hpMax: 28,
    },
    {
        Name: 'MimicFrog2',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Small,
        description:
            'Camouflage with only his plant-like back sticking out of the water or soft ground, he comes out to STUN and PUMMEL unsuspecting travelers with his supersonic CROAKS (and depletes their health until he can consume them with his sticky tongue and soft mouth)',
        hpMin: 26,
        hpMax: 30,
    },
    {
        Name: 'StingFae1',
        Type: EnemyTypeEnum.Fey,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Small,
        description: '',
        hpMin: 9,
        hpMax: 12,
    },
    {
        Name: 'StingFae2',
        Type: EnemyTypeEnum.Fey,
        Class: EnemyCategoryEnum.Basic,
        Size: EnemySizeEnum.Small,
        description: '',
        hpMin: 10,
        hpMax: 15,
    },
    {
        Name: 'ThornWolf',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Elite,
        Size: EnemySizeEnum.Large,
        Description:
            'Imposing wolf-cat creature with multiple eyes and sharp thorns. Mutated by the bacteria in the swamp, he is half animal, half plant and an itchy fungal slime grows on him, making him extremely irritable. He claws at knights with his massive toxic THORN CLAWS',
        hpMin: 85,
        hpMax: 90,
    },
    {
        Name: 'ThornWolf_Pup',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Minion,
        Size: EnemySizeEnum.Medium,
        Description: 'Minion creature to ThornWolf',
        hpMin: 30,
        hpMax: 35,
    },
    {
        Name: 'QueenOrchid',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Elite,
        Size: EnemySizeEnum.Large,
        Description:
            'The sexy siren of the mossy dark forest. Impossible to resist! But as soon as you get close, you realize she is just a kind of "doll" and you are about to get wrapped in leafy tendrils and into the huge gaping maw of... the ORCHID QUEEN!',
        hpMin: 70,
        hpMax: 75,
    },
    {
        Name: 'AncientOne',
        Type: EnemyTypeEnum.Spirit,
        Class: EnemyCategoryEnum.Elite,
        Size: EnemySizeEnum.Large,
        Description:
            'Imposing beast, gentle usually... until there are intruders in his forest! His "chestmouth" shows scary teeth for intimidation, he lowers his head and sweeps in front of him with his antlers, like a moose',
        hpMin: 80,
        hpMax: 85,
    },
    {
        Name: 'FungalBrute',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Boss,
        Size: EnemySizeEnum.Giant,
        Description:
            'Massive, stomping fungal organism that stomps the ground, causing an area of damage where the ground shakes around him. Additionally, he can send large toxic spores flying around him and the knights have to dodge them or prepare to be paralyzed and stomped on.',
        hpMin: 140,
        hpMax: 140,
    },
    {
        Name: 'Treant',
        Type: EnemyTypeEnum.Plant,
        Class: EnemyCategoryEnum.Boss,
        Size: EnemySizeEnum.Giant,
        Description:
            'An elemental giant with a terrifying giant hand that reaches for knights and CRUSHES them, or claws the ground to send a shockwave of dirt and rocks their way',
        hpMin: 160,
        hpMax: 160,
    },
];
