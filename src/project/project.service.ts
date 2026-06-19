import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { subMonths, startOfMonth, endOfMonth, startOfDay, format } from 'date-fns';
import { ProjectModel } from './project.model'; // Based on updated model
import { ProjectDateService } from '../project-date/project-date.service';

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel('Project') private readonly projectModel: Model<ProjectModel>,
        @InjectConnection() private readonly connection: Connection,
        private readonly projectDateService: ProjectDateService,
    ) { }

    // Fetch all insurance records
    async findAll(): Promise<ProjectModel[]> {
        return await this.projectModel
            .find()
            .sort({ createdAt: -1 }) // Use 'desc' or -1 for descending order
            .exec();
    }

    // Create a new insurance record
    async create(data: any): Promise<ProjectModel> {
        const newRecord = new this.projectModel({ ...data });
        return await newRecord.save();
    }

    // Update an existing insurance record
    async update(id: string, data: any): Promise<ProjectModel> {
        const updated = await this.projectModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Insurance record with ID ${id} not found`);
        }
        return updated;
    }

    // Remove an insurance record
    async remove(id: string): Promise<ProjectModel> {
        const deleted = await this.projectModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new NotFoundException(`Insurance record with ID ${id} not found`);
        }
        return deleted;
    }

    // Fetch insurance records with pagination
    async findPaged(
        page: number,
        limit: number,
        search?: string,
        sortBy: string = 'createdAt',
        sortDir: string = 'desc',
        status?: string | string[],
        filters: any = {}
    ): Promise<{ data: ProjectModel[], total: number }> {
        const skip = (page - 1) * limit;

        // Combine filters and search into a single query object
        const query: any = { ...filters };

        // Explicitly handle status filtering with support for single or multiple values
        if (status) {
            const normalize = (val: string) => val.trim().toLowerCase();
            if (Array.isArray(status)) {
                query.status = { $in: status.map(normalize) };
            } else if (typeof status === 'string' && status.includes(',')) {
                query.status = { $in: status.split(',').map(normalize) };
            } else {
                query.status = normalize(status as string);
            }
        }

        if (search) {
            // Escape special regex characters to prevent MongoError
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { name: { $regex: escapedSearch, $options: 'i' } },
                { email: { $regex: escapedSearch, $options: 'i' } },
                { company: { $regex: escapedSearch, $options: 'i' } },
                { mobile: { $regex: escapedSearch, $options: 'i' } },
            ];
        }

        const sortOptions = { [sortBy]: sortDir.toLowerCase() === 'desc' ? -1 : 1 };

        const [data, total] = await Promise.all([
            this.projectModel.find(query).sort(sortOptions as any).skip(skip).limit(limit).exec(),
            this.projectModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }

       // Fetch a single insurance record by ID
    async findOne(id: string): Promise<ProjectModel> {
        const insurance = await this.projectModel.findById(id).exec();
        if (!insurance) {
            throw new NotFoundException(`Insurance record with ID ${id} not found`);
        }
        return insurance;
    }   

    // Fetch a single Project record by mobile number
    async findByMobile(mobile: string): Promise<ProjectModel> {
        const Project = await this.projectModel.findOne({ mobile }).exec();
        if (!Project) {
            throw new NotFoundException(`Project with mobile number ${mobile} not found`);
        }
        return Project;
    }

    // Fetch projects associated with a specific customer
    async findByCustomerId(customerId: string): Promise<ProjectModel[]> {
        return await this.projectModel.find({ customerId }).sort({ createdAt: -1 }).exec();
    }

    // Update the status of an existing project
    async updateProjectStatus(id: string, status: string): Promise<ProjectModel> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const updated = await this.projectModel
                .findByIdAndUpdate(id, { status }, { new: true })
                .session(session)
                .exec();

            if (!updated) {
                throw new NotFoundException(`Project with ID ${id} not found`);
            }

            // Log the status change history
            await this.projectDateService.create({
                projectId: id,
                status: status,
                updateAt: new Date(),
            }, session);

            await session.commitTransaction();
            return updated;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}