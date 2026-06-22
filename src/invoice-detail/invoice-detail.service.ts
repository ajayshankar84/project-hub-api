import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { subMonths, startOfMonth, endOfMonth, startOfDay, format } from 'date-fns';
import { InvoiceDetailModel } from './invoice-detail.model'; // Based on updated model

@Injectable()
export class InvoiceDetailService {
    constructor(
        @InjectModel('InvoiceDetail') private readonly invoiceDetailModel: Model<InvoiceDetailModel>
    ) { }

    async create(data: any): Promise<InvoiceDetailModel> {
        const newRecord = new this.invoiceDetailModel({ ...data });
        return await newRecord.save();
    }

    async update(id: string, data: any): Promise<InvoiceDetailModel> {
        const updated = await this.invoiceDetailModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Invoice detail with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<InvoiceDetailModel> {
        const deleted = await this.invoiceDetailModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new NotFoundException(`Invoice detail with ID ${id} not found`);
        }
        return deleted;
    }
}
