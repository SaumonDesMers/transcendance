import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {

  // const httpsOptions = {
  //   key: fs.readFileSync('ssl/server.key'),
  //   cert: fs.readFileSync('ssl/server.crt')
  // }
  // const app = await NestFactory.create(AppModule, {httpsOptions});
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(3001);
}
bootstrap();
