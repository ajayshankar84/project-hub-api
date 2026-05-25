import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseDetailController } from './course-detail.controller';
import { CourseDetailService } from './course-detail.service';
import { CourseDetailSchema } from './course-detail.model'; // Import your schema

@Module({
  imports: [
    // This line is what makes "CourseModel" available to the Service
    MongooseModule.forFeature([{ name: 'CourseDetail', schema: CourseDetailSchema }])
  ],
  controllers: [CourseDetailController],
  providers: [CourseDetailService],
})
export class CourseDetailModule {}