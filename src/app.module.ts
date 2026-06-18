import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CustomerModule } from './customer/customer.module';
import { DocumentDetailModule } from './document-detail/document-detail.module';
import { MessageModule } from './message/message.module';
import { ProjectModule } from './project/project.module';
require('dotenv').config();

const DB_URL = process.env.DB
console.log(DB_URL);

@Module({
  imports: [
    MongooseModule.forRoot(
      DB_URL,
      {
        autoIndex: true, // Ensures Mongoose uses createIndexes instead of ensureIndex
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'insuranceDB',
      }
    ),
    AuthModule, CustomerModule, DocumentDetailModule, MessageModule, ProjectModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
