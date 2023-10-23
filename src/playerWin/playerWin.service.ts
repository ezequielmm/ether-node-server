import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerWin } from './playerWin.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CharacterService } from 'src/game/components/character/character.service';
import { CharacterClassEnum } from 'src/game/components/character/character.enum';
import { Character } from 'src/game/components/character/character.schema'
import { Gear } from 'src/game/components/gear/gear.schema';
import { IPlayerToken } from 'src/game/components/expedition/expedition.schema';
@Injectable()
export class PlayerWinService {
  constructor(
    @InjectModel(PlayerWin)
    private readonly playerWin: ReturnModelType<typeof PlayerWin>,
    private readonly characterService: CharacterService,
  ) { }

  async create(contest_info: PlayerWin) {
    return await this.playerWin.create(contest_info);
  }
  async getAllLootboxesByTokenId(tokenId: number): Promise<any[]> {
    // Query PlayerWin documents where the tokenId matches
    const winsWithMatchingToken = await this.playerWin
      .find({
        'playerToken.tokenId': tokenId,
      })
      .select('lootbox')
      .exec();

    // Aggregate all lootboxes
    const allLootboxes = winsWithMatchingToken.map((win) => win.lootbox);

    return allLootboxes;
  }

  async findLastStageWinAndUpdate(eventId: number, playerToken:IPlayerToken, currentStage:number){

    const lastDocument = await this.playerWin.findOne(
      {
        'playerToken': playerToken,
        'stage': (currentStage - 1),
        'event_id': eventId
      },
      null,
      { sort: { $natural: -1 } }
    );

    console.log(lastDocument)

    if (lastDocument) {
      await this.playerWin.updateOne(
        { _id: lastDocument._id },
        { $set: { 'stage': currentStage } }
      );
    }

    // const playerWinUpdated = await this.playerWin.findOneAndUpdate(
    //   {
    //     'playerToken': playerToken,
    //     'stage': (currentStage - 1),
    //     'event_id': eventId
    //   },
    //   {
    //     $set: {
    //       'stage': currentStage
    //     }
    //   },
    //   { 
    //     sort: { $natural: -1 }, // Ordenar en orden natural en sentido inverso
    //     limit: 1,
    //     new: true
    //   }
    //   );

  }


  async getAllLootByWallet(walletId: string): Promise<any[]> {
    // Query PlayerWin documents where the tokenId matches
    const winsWithMatchingWallet = await this.playerWin
      .find({
        'playerToken.walletId': walletId,
      })
      .select('lootbox')
      .exec();

    // Aggregate all lootboxes
    const allLootboxes = winsWithMatchingWallet.map((win) => win.lootbox);

    return allLootboxes;
  }
  async findAllWins(wallet_id: string, event_id: number) {
    const items = await this.playerWin.find({
      'playerToken.walletId': wallet_id,
      event_id: event_id,
    });
    return items;
  }

  async classCanWin(characterClass: CharacterClassEnum): Promise<boolean> {
    const character = await this.characterService.findOne({ characterClass });
    return character?.canCompete;
  }

  async canPlay(event_id: number, contract_address: string, token_id: number, wins?: number) : Promise<boolean> {
    
    //- If there is no event will not be able to play anyway:
    if (event_id === 0) return true;

    //- Non token villager can play without limit:
    if (contract_address === 'NONE') return true;

    if (typeof wins === 'undefined') {
        wins =
            (await this.playerWin.countDocuments({
                event_id: event_id,
                playerToken: {
                    $elemMatch: {
                        contractId: contract_address,
                        tokenId: token_id,
                    },
                },
            })) ?? 0;
    }
    
    if (wins == 0) return true;

    const character = await this.characterService.getCharacterByContractId(
        contract_address,
    );

    if (!character || character.name != 'Knight') return wins < 1;

    // at this point, it's a knight
    if (token_id <= 500) {
        return wins < 3; // genesis knight
    }

    return wins < 2; // knight
}

  async getWins(wins: number | undefined, event_id: number, contract_address: string, token_id: number): Promise<number> {

    try {

      wins =
        (await this.playerWin.countDocuments({
          event_id: event_id,
          playerToken: {
            $elemMatch: {
              contractId: contract_address,
              tokenId: token_id,
            },
          },
        })) ?? 0;

    }
    catch (exception) {
      console.error(exception);
    }
    return wins;
  }
  async getWinsCountByTokenId(token_id: number): Promise<number> {
    try {
      //console.log(`Attempting to fetch win count for token_id: ${token_id}`);

      const query = { "playerToken.tokenId": Number(token_id) };

      //console.log('Query:', query);

      const winCount = await this.playerWin.countDocuments(query);

      //console.log(`Fetched win count for token_id ${token_id}: ${winCount}`);
      return winCount;
    } catch (exception) {
      console.error(`Failed to fetch win count for token_id ${token_id}: ${exception}`);
      return 0;
    }
  }

  async getCharacterOrLog(contract_address: string): Promise<Character | null> { // Assuming Character is a type you've defined
    const character = await this.characterService.getCharacterByContractId(contract_address);
    //console.log(`Fetched character: ${character ? character.name : 'null'}`);
    return character;
  }

  canKnightPlay(token_id: number, wins: number): boolean {
    if (token_id <= 500) {
      //console.log('Token ID <= 500 (Genesis Knight), can play if wins < 3');
      return wins < 3; // genesis knight
    }

    //console.log('Token ID > 500 (Knight), can play if wins < 2');
    return wins < 2; // knight
  }
}