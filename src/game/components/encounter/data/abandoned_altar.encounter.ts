import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const AbandonedAltarEncounter: Encounter = {
    encounterId: EncounterIdEnum.AbandonedAltar,
    encounterName: 'Abandoned Altar',
    stageNumber: 1,
    imageId: 'runicbeehive',
    overrideDisplayText: {
        starter:
            'The Card burns to ash, but you feel nothing. After a time, you continue on your way.',
        common: 'You feel soothing warmth from the fire.',
        uncommon: 'A glow emanates from the shrine, filling you with vigor',
        rare: 'A glow emanates from the shrine, filling you with vigor',
        epic: 'You feel the presence of a mighty spirit, and its strength flows through you.',
        legendary:
            'You feel the presence of a mighty spirit, and its strength flows through you.',
    },
    postCardChoiceEffect: 'abandon_altar',
    stages: [
        {
            //0
            displayText:
                'You come across an ancient altar to an unknown spirit, covered with moss and vines. You sense that offering a sacrifice may compel them to bless your journey',
            buttons: [
                {
                    text: 'Click here to offer a Card', //aka option 1
                    nextStage: 1,
                    awaitModal: true,
                    effects: [{ kind: 'choose_card_to_sacrifice' }],
                },
                {
                    text: 'Click here to leave', //aka option 2
                    nextStage: 1,
                    effects: [],
                },
            ],
        },
        {
            //1 aka option 2
            displayText:
                'You move along, but still feel mysterious eyes upon you.',
            buttons: [],
        },
    ],
};
