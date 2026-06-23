import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { subMonths, startOfMonth, endOfMonth, startOfDay, format } from 'date-fns';
import { TicketModel } from './ticket.model'; // Based on updated model

@Injectable()
export class TicketService {
    constructor(
        @InjectModel('Ticket') private readonly ticketModel: Model<TicketModel>
    ) { }

    // Fetch all insurance records
    async findAll(): Promise<TicketModel[]> {
        return await this.ticketModel
            .find()
            .sort({ createdAt: -1 }) // Use 'desc' or -1 for descending order
            .exec();
    }

    // Create a new insurance record
    async create(data: any): Promise<TicketModel> {
        const newRecord = new this.ticketModel({ ...data });
        return await newRecord.save();
    }

    // Update an existing insurance record
    async update(id: string, data: any): Promise<TicketModel> {
        const updated = await this.ticketModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Insurance record with ID ${id} not found`);
        }
        return updated;
    }

    // Remove an insurance record
    async remove(id: string): Promise<TicketModel> {
        const deleted = await this.ticketModel.findByIdAndDelete(id).exec();
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
    ): Promise<{ data: TicketModel[], total: number }> {
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
            this.ticketModel.find(query).sort(sortOptions as any).skip(skip).limit(limit).exec(),
            this.ticketModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }

       // Fetch a single insurance record by ID
    async findOne(id: string): Promise<TicketModel> {
        const insurance = await this.ticketModel.findById(id).exec();
        if (!insurance) {
            throw new NotFoundException(`Insurance record with ID ${id} not found`);
        }
        return insurance;
    }
}