import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignedCourseModel } from './assigned-course.model'; // Based on updated model
import { CreateAssignedCourseDto } from './dto/create-assigned-course.dto';

@Injectable()
export class AssignedCourseService {
    constructor(
        @InjectModel('AssignedCourse') private readonly assignedCourseModel: Model<AssignedCourseModel>
    ) { }

    // Fetch all courses
    async findAll(): Promise<AssignedCourseModel[]> {
        return await this.assignedCourseModel.find().exec();
    }

    // Fetch all courses (POST helper with try/catch)
    async findAllPost(): Promise<AssignedCourseModel[]> {
        try {
            return await this.assignedCourseModel.find().exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch assigned courses');
        }
    }

    // Fetch a single course by ID
    async findOne(id: string): Promise<AssignedCourseModel> {
        const course = await this.assignedCourseModel.findById(id).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    async findByMobile(mobile: string): Promise<AssignedCourseModel[]> {
        try {
            return await this.assignedCourseModel.find({ mobile }).exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch assigned courses by mobile');
        }
    }

    async createMany(createAssignedCourseDtos: CreateAssignedCourseDto[]): Promise<AssignedCourseModel[]> {
        try {
            const docs = (createAssignedCourseDtos || []).map((item) => ({
                ...item,
                courseName: item.courseName ?? item.course,
            }));
            return await this.assignedCourseModel.insertMany(docs, { ordered: true });
        } catch (error) {
            throw new InternalServerErrorException('Failed to create assigned courses');
        }
    }
}
