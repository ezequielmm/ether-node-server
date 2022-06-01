import { seeder } from 'nestjs-seeder';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationModule } from './config/configuration.module';
import { ConfigurationService } from './config/configuration.service';
import { Card, CardSchema } from './game/components/card/card.schema';
import { CardSeeder } from './game/components/card/card.seeder';
import { CharacterSeeder } from './game/components/character/character.seeder';
import {
    Character,
    CharacterSchema,
} from './game/components/character/character.schema';
import { TrinketSeeder } from './game/components/trinket/trinket.seeder';
import {
    Trinket,
    TrinketSchema,
} from './game/components/trinket/trinket.schema';
import { Enemy, EnemySchema } from './game/components/enemy/enemy.schema';
import { EnemySeeder } from './game/components/enemy/enemy.seeder';
import { PotionSeeder } from './game/components/potion/potion.seeder';
import { Potion, PotionSchema } from './game/components/potion/potion.schema';

seeder({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: (configurationService: ConfigurationService) => {
                const options: MongooseModuleOptions = {
                    uri: configurationService.connectionString,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
                return options;
            },
        }),
        MongooseModule.forFeature([
            { name: Card.name, schema: CardSchema },
            { name: Character.name, schema: CharacterSchema },
            { name: Trinket.name, schema: TrinketSchema },
            { name: Potion.name, schema: PotionSchema },
            { name: Enemy.name, schema: EnemySchema },
        ]),
    ],
}).run([CardSeeder, CharacterSeeder, TrinketSeeder, PotionSeeder, EnemySeeder]);
