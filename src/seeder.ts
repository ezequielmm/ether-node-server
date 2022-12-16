import { seeder } from 'nestjs-seeder';
import { Card } from './game/components/card/card.schema';
import { CardSeeder } from './game/components/card/card.seeder';
import { CharacterSeeder } from './game/components/character/character.seeder';
import { Character } from './game/components/character/character.schema';
import { Trinket } from './game/components/trinket/trinket.schema';
import { Enemy } from './game/components/enemy/enemy.schema';
import { EnemySeeder } from './game/components/enemy/enemy.seeder';
import { PotionSeeder } from './game/components/potion/potion.seeder';
import { Potion } from './game/components/potion/potion.schema';
import { Settings } from './game/components/settings/settings.schema';
import { SettingsSeeder } from './game/components/settings/settings.seeder';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Chest } from './game/components/chest/chest.schema';
import { ChestSeeder } from './game/components/chest/chest.seeder';
import { KindagooseModule } from 'kindagoose';
import { EncounterSeeder } from './game/components/encounter/encounter.seeder';
import { Encounter } from "./game/components/encounter/encounter.schema";

seeder({
    imports: [
        KindagooseModule.forRootAsync({
            imports: [
                ConfigModule.forRoot({
                    cache: true,
                }),
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URL');

                return { uri, useNewUrlParser: true, useUnifiedTopology: true };
            },
        }),
        KindagooseModule.forFeature([
            Card,
            Character,
            Trinket,
            Potion,
            Enemy,
            Settings,
            Chest,
            Encounter
        ]),
    ],
}).run([
    CardSeeder,
    CharacterSeeder,
    PotionSeeder,
    EnemySeeder,
    SettingsSeeder,
    ChestSeeder,
    EncounterSeeder,
]);
