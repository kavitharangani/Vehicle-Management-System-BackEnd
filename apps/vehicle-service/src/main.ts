import { NestFactory } from '@nestjs/core';
import { AppModule } from './vehicle-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3008);
}
bootstrap();
