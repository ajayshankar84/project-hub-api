import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDetailModel } from './course-detail.model';

@Injectable()
export class CourseDetailService {
  constructor(
    @InjectModel('CourseDetail')
    private readonly courseDetailModel: Model<CourseDetailModel>,
  ) { }

  async findAll(): Promise<CourseDetailModel[]> {
    return await this.courseDetailModel.find().exec();
  }

  async findByCourseId(courseId: string): Promise<CourseDetailModel[]> {
    try {
      return await this.courseDetailModel.find({ courseId }).exec();
    }
    catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch course detail by course id');
    }
  }

  async update(courseId: string, updateData: any): Promise<CourseDetailModel> {
    try {
      const updatedDoc = await this.courseDetailModel
        .findOneAndUpdate({ courseId }, updateData, { new: true })
        .exec();

      if (!updatedDoc) {
        throw new NotFoundException(`Course detail with courseId ${courseId} not found`);
      }

      return updatedDoc;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update course detail');
    }
  }
}
