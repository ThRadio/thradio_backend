import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ValidationPipe } from '@nestjs/common';

import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Initial swagger
  const options = new DocumentBuilder()
    .setTitle('ThRadio API')
    .setVersion(process.env.npm_package_version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  // Enable cors
  app.enableCors();
  // Validators
  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());
  await app.listen(3010);
}
bootstrap();
