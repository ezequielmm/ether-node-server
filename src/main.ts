import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableVersioning({
        type: VersioningType.URI,
    });

    // Validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // CORS Validation
    app.enableCors();

    // Swagger UI settings
    const config = new DocumentBuilder()
        .setTitle('KOTE Gameplay Service')
        .setDescription('API Routes and examples')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    await app.listen(3001);
}
bootstrap();
