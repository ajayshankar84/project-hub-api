import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { JobModule } from './job/job.module';
import { InternshipModule } from './internship/internship.module';
import { LMSAuthModule } from './lms-auth/lms-auth.module';
import { CourseDetailModule } from './course-detail/course-detail.module';
import { AssignedCourseModule } from './assigned-course/assigned-course.module';

const DB_USER = 'user-admin';
const PASSWORD = encodeURIComponent('abcd123%40');
const DB_URL = `mongodb://localhost:27017/bharat-app-internship`;
@Module({
  imports: [
    MongooseModule.forRoot(
      DB_URL
    ),

    CourseModule, JobModule, InternshipModule, LMSAuthModule, CourseDetailModule, AssignedCourseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
