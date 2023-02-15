import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {

  // const httpsOptions = {
  //   key: fs.readFileSync('ssl/server.key'),
  //   cert: fs.readFileSync('ssl/server.crt')
  // }
  // const app = await NestFactory.create(AppModule, {httpsOptions});
  
	const app = await NestFactory.create(AppModule);
	app.enableCors()
	app.useGlobalPipes(new ValidationPipe());

	//SWAGGER INIT

	const config = new DocumentBuilder()
		.setTitle('User')
		.setDescription('The User API description')
		.setVersion('0.1')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	//
  await app.listen(3001);
}
bootstrap();
