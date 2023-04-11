import { seeder } from 'nestjs-seeder';
import { CardSeeder } from './game/components/card/card.seeder';
import { CharacterSeeder } from './game/components/character/character.seeder';
import { EnemySeeder } from './game/components/enemy/enemy.seeder';
import { PotionSeeder } from './game/components/potion/potion.seeder';
import { SettingsSeeder } from './game/components/settings/settings.seeder';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChestSeeder } from './game/components/chest/chest.seeder';
import { KindagooseModule } from 'kindagoose';
import { EncounterSeeder } from './game/components/encounter/encounter.seeder';
import { GearSeeder } from './game/components/gear/gear.seeder';
import { ContestMapSeeder } from './game/contestMap/contestMap.seeder';
import { MapPopulationModule } from './game/map/mapPopulation.module';
import { ContestModule } from './game/contest/contest.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { SettingsModule } from './game/components/settings/settings.module';
import { EnemyModule } from './game/components/enemy/enemy.module';
import { CardModule } from './game/components/card/card.module';
import { PotionModule } from './game/components/potion/potion.module';
import { EncounterModule } from './game/components/encounter/encounter.module';
import { ChestModule } from './game/components/chest/chest.module';
import { CharacterModule } from './game/components/character/character.module';
import { GearModule } from './game/components/gear/gear.module';
import { ContestMapModule } from './game/contestMap/contestMap.module';

seeder({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: false }),
        EventEmitterModule.forRoot(),
        LoggerModule.forRootAsync({
            useFactory: async () => { return {
                pinoHttp: {},
            }; }
        }),
        KindagooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URL');
 
                return { uri, useNewUrlParser: true, useUnifiedTopology: true };
            },
        }),
        MapPopulationModule,
        ContestModule,
        EnemyModule,
        CardModule,
        PotionModule,
        SettingsModule,
        EncounterModule,
        ChestModule,
        CharacterModule,
        GearModule,
        ContestMapModule,
    ],
}).run([
    CardSeeder,
    CharacterSeeder,
    PotionSeeder,
    EnemySeeder,
    SettingsSeeder,
    ChestSeeder,
    GearSeeder,
    EncounterSeeder,
    ContestMapSeeder,
]);
