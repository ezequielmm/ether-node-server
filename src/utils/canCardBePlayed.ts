import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from 'src/game/components/card/card.enum';

export function canPlayerPlayCard(
    cardEnergyCost: number,
    availableEnergy: number,
): {
    readonly canPlayCard: boolean;
    readonly message?: string;
} {
    // First we verify if the card has a 0 cost
    // if this is true, we allow the use of this card no matter the energy
    // the player has available
    if (cardEnergyCost === CardEnergyEnum.None)
        return {
            canPlayCard: true,
        };

    // If the card has a cost of -1, this means that the card will use all the available
    // energy that the player has, also the player energy needs to be more than 0
    if (cardEnergyCost === CardEnergyEnum.All)
        return {
            canPlayCard: true,
        };

    // If the card energy cost is higher than the player's available energy or the
    // player energy is 0 the player can't play the card
    if (cardEnergyCost > availableEnergy || availableEnergy === 0)
        return {
            canPlayCard: false,
            message: CardPlayErrorMessages.NoEnergyLeft,
        };

    // If the card energy cost is lower or equal than the player's available energy
    if (cardEnergyCost <= availableEnergy)
        return {
            canPlayCard: true,
        };
}
