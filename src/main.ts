import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  // for use vallidator
  app.useGlobalPipes(new ValidationPipe())
  const port = configService.get("app.port")
  await app.listen(port, () => {
    console.log(`server run on port:${port} `);
  });
}
bootstrap();
