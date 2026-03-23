import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { JobModule } from './job/job.module';
import { InternshipModule } from './internship/internship.module';

const DB_USER = 'user-admin';
const PASSWORD = encodeURIComponent('abcd123%40');
const DB_URL = `mongodb://user-admin:a78787kjasyd89yasasdas12nkdjaklsdj8@localhost:19925/users?authSource=admin`;
@Module({
  imports: [
    MongooseModule.forRoot(
      DB_URL
    ),

    CourseModule, JobModule, InternshipModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
