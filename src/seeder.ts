import { seeder } from 'nestjs-seeder';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationModule } from './config/configuration.module';
import { ConfigurationService } from './config/configuration.service';
import { Card, CardSchema } from './components/card/card.schema';
import { CardSeeder } from './components/card/card.seeder';
import { CharacterSeeder } from './components/character/character.seeder';
import {
    Character,
    CharacterSchema,
} from './components/character/character.schema';
import { TrinketSeeder } from './components/trinket/trinket.seeder';
import { Trinket, TrinketSchema } from './components/trinket/trinket.schema';
import { Enemy, EnemySchema } from './components/enemy/enemy.schema';
import { EnemySeeder } from './components/enemy/enemy.seeder';

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
            { name: Enemy.name, schema: EnemySchema },
        ]),
    ],
}).run([CardSeeder, CharacterSeeder, TrinketSeeder, EnemySeeder]);
