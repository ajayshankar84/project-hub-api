import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { LMSAuthModel } from './lms-auth.model'; // Based on updated model

@Injectable()
export class LMSAuthService {
    constructor(
        @InjectModel('LMSAuth') private readonly lmsAuthModel: Model<LMSAuthModel>
    ) { }

    // Fetch all internships
    async findAll(): Promise<LMSAuthModel[]> {
        return await this.lmsAuthModel
            .find()
            .sort({ createdAt: -1 }) // Use 'desc' or -1 for descending order
            .exec();
    }

    // Fetch a single internship by ID
    async findOne(id: string): Promise<LMSAuthModel> {
        if (!isValidObjectId(id)) {
            return await this.findByMobile(id);
        }

        const lmsAuth = await this.lmsAuthModel.findById(id).exec();
        if (!lmsAuth) {
            throw new NotFoundException(`LMSAuth with ID ${id} not found`);
        }
        return lmsAuth;
    }

        // Fetch a single internship by ID
    async findByMobile(mobile: string): Promise<LMSAuthModel> {
        const lmsAuth = await this.lmsAuthModel.findOne({ mobile }).exec();
        if (!lmsAuth) {
            throw new NotFoundException(`LMSAuth with Mobile ${mobile} not found`);
        }
        return lmsAuth;
    }

    // Save internship data and the image path to MongoDB
    async create(internshipData: any): Promise<LMSAuthModel> {
        const createdLMSAuth = new this.lmsAuthModel({
            ...internshipData,
            // Store the local path or URL
        });
        return await createdLMSAuth.save();
    }

    async update(id: string, internshipData: any): Promise<LMSAuthModel> {
        const updatedLMSAuth = await this.lmsAuthModel
            .findByIdAndUpdate(id, internshipData, { new: true }) // { new: true } returns the modified document
            .exec();

        if (!updatedLMSAuth) {
            throw new NotFoundException(`LMSAuth with ID ${id} not found`);
        }
        return updatedLMSAuth;
    }

    // Delete an internship
    async remove(id: string): Promise<any> {
        const result = await this.lmsAuthModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`LMSAuth with ID ${id} not found`);
        }
        return { deleted: true };
    }
}