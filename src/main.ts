import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CardPoolModule } from './cardPool/cardPool.module';
import { TransformDataResource } from './interceptors/TransformDataResource.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //Enable Validation
    app.useGlobalPipes(new ValidationPipe());

    // Add Resource Interceptor
    app.useGlobalInterceptors(new TransformDataResource());

    // Add custom validation modules
    useContainer(app.select(CardPoolModule), { fallbackOnErrors: true });

    // Enable Versioning
    app.enableVersioning({
        defaultVersion: '1',
        type: VersioningType.URI,
    });

    const localUrl = process.env.LOCAL_URL || 'http://localhost:3000';

    // Enable Swagger for API docs
    const config = new DocumentBuilder()
        .setTitle('KOTE Gameplay Service')
        .setDescription('API routes')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer(localUrl, 'Local Server')
        .addServer(process.env.GATEWAY_URL, 'Gateway URL')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
