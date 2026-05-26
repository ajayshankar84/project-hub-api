import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseModel } from './course.model'; // Based on updated model
import { CourseDetailService } from '../course-detail/course-detail.service';
import { AssignedCourseService } from '../assigned-course/assigned-course.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CourseService {
    constructor(
        @InjectModel('Course') private readonly courseModel: Model<CourseModel>,
        private readonly courseDetailService: CourseDetailService,
        private readonly assignedCourseService: AssignedCourseService,
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
        try {
            const createdCourse = new this.courseModel({
                ...courseData,
                imagePath: imagePath,
            });
            const savedCourse = await createdCourse.save();

            // Automatically create a matching record in the CourseDetail collection
            await this.courseDetailService.create({
                ...courseData,
                courseId: savedCourse._id.toString(), // Explicitly cast ObjectId to String
                imagePath: imagePath,
                // Ensure numeric fields from courseData are valid for CourseDetailSchema
                price: Number(courseData.price) || 0,
                finalPrice: Number(courseData.finalPrice) || 0,
                rating: Number(courseData.rating) || 1,
                // Provide defaults for required CourseDetail fields not present in Course
                taxInclusivePrice: courseData.taxInclusivePrice || '0',
                seatsLeft: courseData.seatsLeft || '0',
                pageTitle: courseData.pageTitle || courseData.name,
                pageSubTitle: courseData.pageSubTitle || '',
                duration: courseData.duration || 'Not Specified',
                stipend: courseData.stipend || 'None',
                location: courseData.location || 'Online',
                whatYouWillLearn: courseData.whatYouWillLearn || [],
                handsOnProjects: courseData.handsOnProjects || [],
                mentorshipAndAssessment: courseData.mentorshipAndAssessment || [],
                openPositions: courseData.openPositions || {},
                weeklyCommitment: courseData.weeklyCommitment || '',
                startDate: courseData.startDate || '',
                eligibility: courseData.eligibility || [],
                timeline: courseData.timeline || [],
                curriculum: courseData.curriculum || [],
                faq: courseData.faq || [],
                evaluation: courseData.evaluation || {},
                perksAndBenefits: courseData.perksAndBenefits || [],
            });

            // Automatically create a matching record in the AssignedCourse collection
            await this.assignedCourseService.create({
                ...courseData,
                courseId: savedCourse._id.toString(),
                courseName: courseData.name, // Mapping Course.name to AssignedCourse.courseName
                imagePath: imagePath,
                // Ensure types match expectations
                price: Number(courseData.price) || 0,
                discount: Number(courseData.discount) || 0,
                finalPrice: Number(courseData.finalPrice) || 0,
                rating: Number(courseData.rating) || 1,
                active: courseData.active !== undefined ? courseData.active : true,
            });

            return savedCourse;
        } catch (error) {
            console.error('Error in CourseService.create:', error);
            throw new InternalServerErrorException('An error occurred while creating the course and its details');
        }
    }

    async update(id: string, updateData: any): Promise<CourseModel> {
        try {
            const existingCourse = await this.courseModel.findById(id).exec();
            if (!existingCourse) {
                throw new NotFoundException(`Course with ID ${id} not found`);
            }

            const oldImagePath = existingCourse.imagePath;
            const updatedCourse = await this.courseModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
            
            // If a new image was uploaded and update succeeded, delete the old file
            if (updateData.imagePath && oldImagePath && oldImagePath !== updateData.imagePath) {
                this.deleteFile(oldImagePath);
            }

        // --- Start of synchronization logic for CourseDetail update ---
        const courseDetailUpdateData: any = {};
        const fieldsToSync = [
            'name', 'type', 'category', 'description', 'tag', 'price',
            'discount', 'finalPrice', 'rating', 'imagePath', 'active'
        ];

        for (const field of fieldsToSync) {
            if (updateData[field] !== undefined) {
                courseDetailUpdateData[field] = updateData[field];
            }
        }

        // Special handling for pageTitle: if course name is updated and pageTitle is not explicitly set
        // in the courseDetailUpdateData, update pageTitle to match the new course name.
        if (updateData.name !== undefined && courseDetailUpdateData.pageTitle === undefined) {
            courseDetailUpdateData.pageTitle = updateData.name;
        }

        // Ensure numeric fields are correctly typed for CourseDetail,
        // as they might come as strings from the controller's processedData.
        if (courseDetailUpdateData.price !== undefined) {
            courseDetailUpdateData.price = Number(courseDetailUpdateData.price);
        }
        if (courseDetailUpdateData.finalPrice !== undefined) {
            courseDetailUpdateData.finalPrice = Number(courseDetailUpdateData.finalPrice);
        }
        if (courseDetailUpdateData.rating !== undefined) {
            courseDetailUpdateData.rating = Number(courseDetailUpdateData.rating);
        }

        // Only attempt to update CourseDetail if there's data to update
        if (Object.keys(courseDetailUpdateData).length > 0) {
            // Call the existing CourseDetailService.update method, which expects courseId as its first parameter
            await this.courseDetailService.update(id, courseDetailUpdateData);
        }

        // --- Start of synchronization logic for AssignedCourse update ---
        const assignedCourseUpdateData: any = {};
        const fieldsForAssigned = [
            'type', 'category', 'description', 'tag', 'price',
            'discountType', 'discount', 'finalPrice', 'rating', 'imagePath', 'active', 'isPaid'
        ];

        for (const field of fieldsForAssigned) {
            if (updateData[field] !== undefined) {
                assignedCourseUpdateData[field] = updateData[field];
            }
        }

        // Map 'name' to 'courseName' for AssignedCourse schema compatibility
        if (updateData.name !== undefined) {
            assignedCourseUpdateData.courseName = updateData.name;
        }

        if (Object.keys(assignedCourseUpdateData).length > 0) {
            await this.assignedCourseService.updateManyByCourseId(id, assignedCourseUpdateData);
        }
        // --- End of synchronization logic ---

            return updatedCourse;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error('Error updating course or synchronizing course detail:', error);
            throw new InternalServerErrorException('Failed to update course and its details');
        }
    }

    async remove(id: string): Promise<CourseModel> {
        try {
            // 1. Cascade delete the associated CourseDetail record first
            // We use the ID of the course to find the corresponding detail
            const deletedDetail = await this.courseDetailService.removeByCourseId(id);

            // 2. Cascade delete all associated AssignedCourse records
            await this.assignedCourseService.removeByCourseId(id);

            // 2. Delete the main Course record
            const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();
            if (!deletedCourse) {
                throw new NotFoundException(`Course with ID ${id} not found`);
            }

            // 3. Clean up the associated image file from the server
            if (deletedCourse.imagePath) {
                this.deleteFile(deletedCourse.imagePath);
            }

            // 4. Also clean up the image path from CourseDetail if it's different
            if (deletedDetail && deletedDetail.imagePath && deletedDetail.imagePath !== deletedCourse?.imagePath) {
                this.deleteFile(deletedDetail.imagePath);
            }

            return deletedCourse;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error('Error during course cascading deletion:', error);
            throw new InternalServerErrorException('An error occurred while deleting the course and its details');
        }
    }

    private deleteFile(filePath: string) {
        if (!filePath) return;
        
        const absolutePath = path.resolve(filePath);
        fs.access(absolutePath, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(absolutePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting file at ${absolutePath}:`, unlinkErr);
                    }
                });
            }
        });
    }
}