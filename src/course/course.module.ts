import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseSchema } from './course.model'; // Import your schema

@Module({
  imports: [
    // This line is what makes "CourseModel" available to the Service
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }])
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}