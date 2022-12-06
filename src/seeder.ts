import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './game/components/card/card.schema';
import { CardSeeder } from './game/components/card/card.seeder';
import { CharacterSeeder } from './game/components/character/character.seeder';
import {
    Character,
    CharacterSchema,
} from './game/components/character/character.schema';
import {
    Trinket,
    TrinketSchema,
} from './game/components/trinket/trinket.schema';
import { Enemy, EnemySchema } from './game/components/enemy/enemy.schema';
import { EnemySeeder } from './game/components/enemy/enemy.seeder';
import { PotionSeeder } from './game/components/potion/potion.seeder';
import { Potion, PotionSchema } from './game/components/potion/potion.schema';
import {
    Settings,
    SettingsSchema,
} from './game/components/settings/settings.schema';
import { SettingsSeeder } from './game/components/settings/settings.seeder';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { composeMongooseModuleOptions } from './dbConfiguration';
import { Chest, ChestSchema } from './game/components/chest/chest.schema';
import { ChestSeeder } from './game/components/chest/chest.seeder';

seeder({
    imports: [
        MongooseModule.forRootAsync({
            imports: [
                ConfigModule.forRoot({
                    cache: true,
                }),
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URL');

                return composeMongooseModuleOptions(uri);
            },
        }),
        MongooseModule.forFeature([
            { name: Card.name, schema: CardSchema },
            { name: Character.name, schema: CharacterSchema },
            { name: Trinket.name, schema: TrinketSchema },
            { name: Potion.name, schema: PotionSchema },
            { name: Enemy.name, schema: EnemySchema },
            { name: Settings.name, schema: SettingsSchema },
            { name: Chest.name, schema: ChestSchema },
        ]),
    ],
}).run([
    CardSeeder,
    CharacterSeeder,
    PotionSeeder,
    EnemySeeder,
    SettingsSeeder,
    ChestSeeder,
]);
