import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseModel } from './course.model'; // Based on updated model

@Injectable()
export class CourseService {
    constructor(
        @InjectModel('Course') private readonly courseModel: Model<CourseModel>
    ) { }

    // Fetch all courses
    async findAll(): Promise<CourseModel[]> {
        return await this.courseModel.find().exec();
    }

    // Fetch a single course by ID
    async findOne(id: string): Promise<CourseModel> {
        const course = await this.courseModel.findById(id).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }
    // Save course data and the image path to MongoDB
    async create(courseData: any, imagePath: string): Promise<CourseModel> {
        const createdCourse = new this.courseModel({
            ...courseData,
            imagePath: imagePath, // Store the local path or URL
        });
        return await createdCourse.save();
    }
}