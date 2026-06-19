import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { join, resolve } from 'path';
import { DocumentDetailModel } from './document-detail.model';

@Injectable()
export class DocumentDetailService {
    constructor(
        @InjectModel('DocumentDetail') private readonly documentDetailModel: Model<DocumentDetailModel>
    ) { }

    async findAll(): Promise<DocumentDetailModel[]> {
        return await this.documentDetailModel.find().sort({ createdAt: -1 }).exec();
    }

    async findByCustomerId(customerId: string): Promise<DocumentDetailModel[]> {
        return await this.documentDetailModel.find({ customerId }).sort({ createdAt: -1 }).exec();
    }

    async findPagedByCustomerId(customerId: string, page: number, limit: number = 10): Promise<{ data: DocumentDetailModel[], total: number }> {
        const skip = (page - 1) * limit;
        const query = { customerId };
        const [data, total] = await Promise.all([
            this.documentDetailModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.documentDetailModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }

    async findOne(id: string): Promise<DocumentDetailModel> {
        const doc = await this.documentDetailModel.findById(id).exec();
        if (!doc) {
            throw new NotFoundException(`Document detail with ID ${id} not found`);
        }
        return doc;
    }

    async create(data: any, file?: any): Promise<DocumentDetailModel> {
        // Handle potential stringified 'data' field from multipart requests
        let docData = { ...data };
        
        if (data.data) {
            try {
                const parsed = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
                docData = { ...docData, ...parsed };
                delete docData.data; // Clean up nested key if it existed
            } catch (e) {
                // Fail silently and use original data if parsing fails
            }
        }

        if (file) {
            // Normalize path: replace backslashes with forward slashes for URLs
            docData.documentPath = file.path.replace(/\\/g, '/');
            
            // Use fileSize from data if provided (e.g. "1 GB"), otherwise use file size
            docData.fileSize = docData.fileSize || file.size.toString();
            
            // Automatically set fileType from the uploaded file mimetype if not provided
            if (!docData.fileType) {
                docData.fileType = file.mimetype || docData.fileType;
            }
        }

        const newDoc = new this.documentDetailModel(docData);
        return await newDoc.save();
    }

    async update(id: string, data: any, file?: any): Promise<DocumentDetailModel> {
        const existingDoc = await this.findOne(id);
        let updateData = data.data && typeof data.data === 'string' ? JSON.parse(data.data) : { ...data };

        if (file) {
            updateData.documentPath = file.path.replace(/\\/g, '/');
            updateData.fileSize = file.size.toString();
            updateData.fileType = file.mimetype;

            // Delete the old file if it exists
            if (existingDoc.documentPath && existingDoc.documentPath !== updateData.documentPath) {
                const oldPath = resolve(existingDoc.documentPath);
                try {
                    await fs.promises.unlink(oldPath);
                } catch (err) {
                    if (err.code !== 'ENOENT') {
                        console.error(`Failed to delete old file: ${oldPath}`, err);
                    }
                }
            }
        }

        const updated = await this.documentDetailModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Document detail with ID ${id} not found`);
        }
        return updated;
    }

    async updateStatus(id: string, status: string): Promise<DocumentDetailModel> {
        const updated = await this.documentDetailModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Document detail with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<DocumentDetailModel> {
        const doc = await this.findOne(id);
        
        // Delete physical file
        if (doc.documentPath) {
            const filePath = resolve(doc.documentPath);
            try {
                await fs.promises.unlink(filePath);
            } catch (err) {
                // ENOENT means the file was already missing, which is fine
                if (err.code !== 'ENOENT') {
                    console.error(`Failed to delete physical file ${filePath}:`, err);
                }
            }
        }

        const deleted = await this.documentDetailModel.findByIdAndDelete(id).exec();
        return deleted;
    }
}
