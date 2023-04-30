import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {

  // const httpsOptions = {
  //   key: fs.readFileSync('ssl/server.key'),
  //   cert: fs.readFileSync('ssl/server.crt')
  // }
  // const app = await NestFactory.create(AppModule, {httpsOptions});
  
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors()
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());
	app.useStaticAssets(join(__dirname, 'pictures'));

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
