import { NestFactory } from '@nestjs/core';

import bodyParser = require('body-parser');
import { AppModule } from './app.module';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {

  const server = express();
  const app = await NestFactory.create(AppModule, 
    new ExpressAdapter(server),
  );
 // 2. Configure static assets
  // This maps http://localhost:3000/uploads to the physical ./uploads folder
  server.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({ credentials: true, origin: "*" });
  await app.init();
  http.createServer(server).listen(process.env.PORT || 3000);
 
  //await app.listen(3000);
}
bootstrap();
