import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignedCourseController } from './assigned-course.controller';
import { AssignedCourseService } from './assigned-course.service';
import { AssignedCourseSchema } from './assigned-course.model'; // Import your schema

@Module({
  imports: [
    // This line is what makes "CourseModel" available to the Service
    MongooseModule.forFeature([{ name: 'AssignedCourse', schema: AssignedCourseSchema }])
  ],
  controllers: [AssignedCourseController],
  providers: [AssignedCourseService],
})
export class AssignedCourseModule {}