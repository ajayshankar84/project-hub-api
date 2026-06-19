import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageModel } from './message.model';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel('Message') private readonly messageModel: Model<MessageModel>
    ) { }

    //_________________________
    async create(data: any): Promise<MessageModel> {
        const newMessage = new this.messageModel({
            ...data,
            status: data.status ?? false,
        });
        return await newMessage.save();
    }

     async getMessagesByCustomer(customerId: string, limit = 50) {
    return this.messageModel
      .find({ customerId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .exec();
  }

    async markAsRead(messageId: string) {
        return this.messageModel.findByIdAndUpdate(messageId, { status: true });
    }

    async markAllAsRead(customerId: string) {
        return this.messageModel.updateMany({ customerId, status: false }, { status: true }).exec();
    }

    async getDistinctCustomerIds(): Promise<string[]> {
        return this.messageModel.distinct('customerId').exec();
    }
}
