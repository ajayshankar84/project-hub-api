import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternshipModel } from './internship.model'; // Based on updated model

@Injectable()
export class InternshipService {
    constructor(
        @InjectModel('Internship') private readonly internshipModel: Model<InternshipModel>
    ) { }

    // Fetch all internships
    async findAll(): Promise<InternshipModel[]> {
        return await this.internshipModel
            .find()
            .sort({ createdAt: -1 }) // Use 'desc' or -1 for descending order
            .exec();
    }

    // Fetch a single internship by ID
    async findOne(id: string): Promise<InternshipModel> {
        const internship = await this.internshipModel.findById(id).exec();
        if (!internship) {
            throw new NotFoundException(`internship with ID ${id} not found`);
        }
        return internship;
    }
    // Save internship data and the image path to MongoDB
    async create(internshipData: any): Promise<InternshipModel> {
        const createdInternship = new this.internshipModel({
            ...internshipData,
            // Store the local path or URL
        });
        return await createdInternship.save();
    }

    async update(id: string, internshipData: any): Promise<InternshipModel> {
        const updatedInternship = await this.internshipModel
            .findByIdAndUpdate(id, internshipData, { new: true }) // { new: true } returns the modified document
            .exec();

        if (!updatedInternship) {
            throw new NotFoundException(`Internship with ID ${id} not found`);
        }
        return updatedInternship;
    }

    // Delete an internship
    async remove(id: string): Promise<any> {
        const result = await this.internshipModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Internship with ID ${id} not found`);
        }
        return { deleted: true };
    }
}