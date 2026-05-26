import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseSchema } from './course.model'; // Import your schema
import { CourseDetailModule } from '../course-detail/course-detail.module';
import { AssignedCourseModule } from '../assigned-course/assigned-course.module';

@Module({
  imports: [
    // This line is what makes "CourseModel" available to the Service
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    CourseDetailModule,
    AssignedCourseModule
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}