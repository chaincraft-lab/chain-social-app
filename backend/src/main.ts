import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(
    `${process.env.BASE_ENDPOINT_URL}${process.env.PROJECT_VERSION}`,
  );

  const config = new DocumentBuilder()
  .setTitle('Soccer Ball')
  .setDescription(`Soccer Ball`)
  .setVersion('1.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'access-token',
  )
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors();
  // app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
