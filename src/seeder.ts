import { seeder } from 'nestjs-seeder';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationModule } from './config/configuration.module';
import { ConfigurationService } from './config/configuration.service';
import { Card, CardSchema } from './components/card/card.schema';
import { CardSeeder } from './components/card/card.seeder';

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
        MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    ],
}).run([CardSeeder]);
