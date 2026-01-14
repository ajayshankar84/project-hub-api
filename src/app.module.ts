import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { JobModule } from 'dist/job/job.module';
import { InternshipModule } from './internship/internship.module';

const DB_USER = 'user-admin';
const PASSWORD = encodeURIComponent('abcd123%40');
const DB_URL = `mongodb://user-admin:a78787kjasyd89yasasdas12nkdjaklsdj8@157.20.214.72:19925/users?authSource=users`;
@Module({
    imports: [
    MongooseModule.forRoot(
      DB_URL
    ),
    
    CourseModule ,JobModule, InternshipModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
