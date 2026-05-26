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

  async create(data: any): Promise<CourseDetailModel> {
    try {
      const createdDoc = new this.courseDetailModel(data);
      return await createdDoc.save();
    } catch (error) {
      // Log the actual Mongoose validation error to the console
      if (error.name === 'ValidationError') {
        console.error('Mongoose Validation Error details:', error.errors);
      }
      console.error('Error creating CourseDetail:', error);
      throw new InternalServerErrorException('Failed to create course detail');
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

  async removeByCourseId(courseId: string): Promise<any> {
    try {
      const result = await this.courseDetailModel.findOneAndDelete({ courseId }).exec();
      console.log(`Deleted CourseDetail for courseId: ${courseId}`);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete course detail');
    }
  }
}
