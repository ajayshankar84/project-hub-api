import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { subMonths, startOfMonth, endOfMonth, startOfDay, format } from 'date-fns';
import { ProjectDateModel } from './project-date.model'; // Based on updated model

@Injectable()
export class ProjectDateService {
    constructor(
        @InjectModel('ProjectDate') private readonly projectDateModel: Model<ProjectDateModel>
    ) { }

    // Create a new project date record
    async create(data: any, session?: ClientSession): Promise<ProjectDateModel> {
        const newRecord = new this.projectDateModel({ ...data });
        return await newRecord.save({ session });
    }
}