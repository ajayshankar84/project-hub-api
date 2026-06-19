import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { MessageGateway } from './message/message.gateway';
import { Server } from 'socket.io';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.json({ limit: '1.5gb' }));
  app.use(express.urlencoded({ limit: '1.5gb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: false,
  });

  // Serve uploaded files at both /uploads/ (legacy) and /upload/ (spec)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/upload/' });

  // Extend request timeout for large file uploads (10 min)
  app.use((req: any, res: any, next: any) => {
    res.setTimeout(600000);
    next();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // @nestjs/websockets v11 is incompatible with @nestjs/core v6 internals, so
  // NestJS's socket module silently fails to load. We wire Socket.IO manually instead.
  const io = new Server(app.getHttpServer(), {
    path: '/chat',
    cors: { origin: '*', credentials: false },
  });

  const gateway = app.get(MessageGateway);
  gateway.afterInit(io);

  io.on('connection', (socket: any) => {
    gateway.handleConnection(socket);

    socket.on('joinDocumentRoom', (data: any) => gateway.handleJoinRoom(socket, data));
    socket.on('sendMessage', (data: any) => gateway.handleSendMessage(socket, data));
    socket.on('typing', (data: any) => gateway.handleTyping(socket, data));
    socket.on('markRead', (data: any) => gateway.handleMarkRead(socket, data));
    socket.on('documentStatusUpdate', (data: any) => gateway.handleDocumentStatusUpdate(socket, data));
    socket.on('newDocumentUploaded', (data: any) => gateway.handleNewDocumentUploaded(socket, data));
    socket.on('leaveRoom', (data: any) => gateway.handleLeaveRoom(socket, data));
    socket.on('disconnect', () => gateway.handleDisconnect(socket));
  });

  console.log(`Server running on port ${port}`);
}
bootstrap();
