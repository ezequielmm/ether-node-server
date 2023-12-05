import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const TreeCarvingEncounter: Encounter = {
    encounterId: EncounterIdEnum.TreeCarving,
    encounterName: 'Tree Carving',
    stageNumber: 1,
    imageId: 'stumpcreatures',
    stages: [
        {
            //0
            displayText:
                'A glowing string of runes etched into the trunk of a tree catches your attention. You don’t recognize the markings but you think you might be able to decode them if you take the time. Haven’t you seen that first rune somewhere before…?',
            buttons: [
                {
                    text: 'Click here to try to decode the runes', // aka option 1
                    nextStage: 1,
                    effects: [],
                },
                {
                    text: 'Click here to leave', // aka option 2
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            //1 aka option 1
            displayText:
                'You inch closer to the runes, straining to recall where you’ve seen them before. Just as you’re about to give up, they begin to morph in front of you. You can suddenly read them. They say, “Stop him. Stop him before it spreads.”',
            buttons: [
                {
                    text: 'Click here to touch the Runes [Become Imbued. Start next combat with 2 Fatigue.]', // aka option 3
                    nextStage: 3,
                    effects: [{ kind: 'fatigue' }, { kind: 'imbued' }],
                },
                {
                    text: 'Click here to step Away [Start next combat with Feeble]', // aka option 4
                    nextStage: 4,
                    effects: [{ kind: 'feeble' }],
                },
            ],
        },
        {
            //2 aka option 2
            displayText:
                'There is no time to waste on meaningless scrawls. You follow the path deeper into the forest.',
            buttons: [],
        },
        {
            //3 aka option 3
            displayText:
                'You place your hand upon the scarred tree trunk. As you do, blue sparks swirl around your hand and travel up your arm before disappearing. You feel… changed… imbued with a newfound purpose, although you’re not quite sure what it is. You make a mental note of the runic message and decide you’ve wasted enough time already. You head back out into the forest, ready for your next battle.',
            buttons: [],
        },
        {
            //4 aka option 4
            displayText:
                'The runes and their message are disconcerting. You shake your head and once again the message has returned to its garbled state. You move past the tree, making sure to step OVER the root this time.',
            buttons: [],
        },
    ],
};
