import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobModel } from './job.model'; // Based on updated model

@Injectable()
export class JobService {
    constructor(
        @InjectModel('Job') private readonly jobModel: Model<JobModel>
    ) { }

    // Fetch all jobs
    async findAll(): Promise<JobModel[]> {
        return await this.jobModel.find().exec();
    }

    // Fetch a single job by ID
    async findOne(id: string): Promise<JobModel> {
        const job = await this.jobModel.findById(id).exec();
        if (!job) {
            throw new NotFoundException(`job with ID ${id} not found`);
        }
        return job;
    }
    // Save job data and the image path to MongoDB
    async create(jobData: any, imagePath: string): Promise<JobModel> {
        const createdjob = new this.jobModel({
            ...jobData,
            imagePath: imagePath, // Store the local path or URL
        });
        return await createdjob.save();
    }
}