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
        ]),
    ],
}).run([CardSeeder, CharacterSeeder]);
