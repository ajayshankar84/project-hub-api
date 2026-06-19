import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { subMonths, startOfMonth, endOfMonth, startOfDay, format } from 'date-fns';
import { CustomerModel } from './customer.model'; // Based on updated model

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel('Customer') private readonly customerModel: Model<CustomerModel>
    ) { }

    // Fetch all insurance records
    async findAll(): Promise<CustomerModel[]> {
        return await this.customerModel
            .find()
            .sort({ createdAt: -1 }) // Use 'desc' or -1 for descending order
            .exec();
    }

    // Create a new insurance record
    async create(data: any): Promise<CustomerModel> {
        const newRecord = new this.customerModel({ ...data });
        return await newRecord.save();
    }

    // Update an existing insurance record
    async update(id: string, data: any): Promise<CustomerModel> {
        const updated = await this.customerModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Insurance record with ID ${id} not found`);
        }
        return updated;
    }

    // Remove an insurance record
    async remove(id: string): Promise<CustomerModel> {
        const deleted = await this.customerModel.findByIdAndDelete(id).exec();
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
    ): Promise<{ data: CustomerModel[], total: number }> {
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
            this.customerModel.find(query).sort(sortOptions as any).skip(skip).limit(limit).exec(),
            this.customerModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }

       // Fetch a single insurance record by ID
    async findOne(id: string): Promise<CustomerModel> {
        const insurance = await this.customerModel.findById(id).exec();
        if (!insurance) {
            throw new NotFoundException(`Insurance record with ID ${id} not found`);
        }
        return insurance;
    }   

    // Fetch a single customer record by mobile number
    async findByMobile(mobile: string): Promise<CustomerModel> {
        const customer = await this.customerModel.findOne({ mobile }).exec();
        if (!customer) {
            throw new NotFoundException(`Customer with mobile number ${mobile} not found`);
        }
        return customer;
    }

    // Get total customers and growth comparison for the last 6 months
    async getCustomerGrowth() {
        const now = new Date();

        // Using date-fns for robust month subtraction and day normalization
        const sixMonthsAgo = startOfDay(subMonths(now, 6));
        const twelveMonthsAgo = startOfDay(subMonths(now, 12));

        // Generate monthly data for charts (last 6 months)
        const chartDataPromises = [];
        for (let i = 5; i >= 0; i--) {
            const monthDate = subMonths(now, i);
            const start = startOfMonth(monthDate);
            const end = endOfMonth(monthDate);
            
            chartDataPromises.push(Promise.all([
                this.customerModel.countDocuments({ createdAt: { $gte: start, $lte: end }, status: 'active' }).exec(),
                this.customerModel.countDocuments({ createdAt: { $gte: start, $lte: end }, status: 'inactive' }).exec()
            ]).then(([active, inactive]) => ({
                name: format(monthDate, 'MMM yyyy'),
                active,
                inactive,
                total: active + inactive
            })));
        }

        const [totalCustomers, last6MonthsTotal, prior6MonthsTotal, monthlyData, activeCustomers, inactiveCustomers] = await Promise.all([
            this.customerModel.countDocuments().exec(),
            this.customerModel.countDocuments({ createdAt: { $gte: sixMonthsAgo } }).exec(),
            this.customerModel.countDocuments({ createdAt: { $gte: twelveMonthsAgo, $lt: sixMonthsAgo } }).exec(),
            Promise.all(chartDataPromises),
            this.customerModel.countDocuments({ status: 'active' }).exec(),
            this.customerModel.countDocuments({ status: 'inactive' }).exec()
        ]);

        const difference = last6MonthsTotal - prior6MonthsTotal;
        let percentageChange = 0;
        if (prior6MonthsTotal > 0) {
            percentageChange = (difference / prior6MonthsTotal) * 100;
        } else if (last6MonthsTotal > 0) {
            percentageChange = 100;
        }

        return {
            totalCustomers,
            activeCustomers,
            inactiveCustomers,
            newCustomersThisMonth: monthlyData[monthlyData.length - 1].total,
            newCustomersLast6Months: last6MonthsTotal,
            percentageChange: parseFloat(percentageChange.toFixed(2)),
            trend: difference >= 0 ? 'increase' : 'decrease',
            monthlyData // Array of { name: 'Jan 2024', active: 5, inactive: 2, total: 7 }
        };
    }
}