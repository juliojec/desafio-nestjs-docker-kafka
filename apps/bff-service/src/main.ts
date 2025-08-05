import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'bff';

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('BFF Service API')
    .setDescription('Documentação da API do BFF')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}` 
  );

  Logger.log(
    `Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();
