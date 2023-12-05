import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const EnchantedForest: Encounter = {
    encounterId: EncounterIdEnum.EnchantedForest,
    encounterName: 'Enchanted Forest',
    stageNumber: 1,
    imageId: 'ents',
    stages: [
        {
            // 0
            displayText:
                'You come to an obstructed section of trees. Their branches begin to move, blocking the way out. Suddenly three of the face-like trunks awaken. “Whooo Enters Ouuuuur Foressssst?”',
            buttons: [
                {
                    text: 'Click here to become lighter to escape [Choose a card to remove]', // aka option 1
                    nextStage: 1,
                    awaitModal: true,
                    effects: [{ kind: 'choose_card_remove' }],
                },
                {
                    text: 'Click here to grow like the seedling [Choose a card to upgrade]', // aka option 2
                    nextStage: 2,
                    awaitModal: true,
                    effects: [{ kind: 'choose_card_upgrade' }],
                },
            ],
        },
        {
            // 1 aka option 1
            displayText:
                'Appeased, the limbs retract and a path forward emerges.',
            buttons: [],
        },
        {
            // 2 aka option 2
            displayText:
                'Appeased, the limbs retract and a path forward emerges.',
            buttons: [],
        },
    ],
};
