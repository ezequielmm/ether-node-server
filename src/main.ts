import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CardModule } from './card/card.module';
import { CharacterClassModule } from './character-class/character-class.module';
import { ExpeditionModule } from './expedition/expedition.module';
import { TransformDataResource } from './interceptors/TransformDataResource.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable Validation
    app.useGlobalPipes(new ValidationPipe());

    // Add custom validation modules
    useContainer(app.select(ExpeditionModule), { fallbackOnErrors: true });
    useContainer(app.select(CharacterClassModule), { fallbackOnErrors: true });
    useContainer(app.select(CardModule), { fallbackOnErrors: true });

    // Add Resource Interceptor
    app.useGlobalInterceptors(new TransformDataResource());

    // Enable Versioning
    app.enableVersioning({
        type: VersioningType.URI,
    });

    // Enable Swagger for API docs
    const config = new DocumentBuilder()
        .setTitle('KOTE Gameplay Service')
        .setDescription('API routes')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer(process.env.GATEWAY_URL, 'Gateway URL')
        .addServer('http://localhost:3000', 'Local Server')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
