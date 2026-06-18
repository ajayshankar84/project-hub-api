
import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  messages: { type: String, required: true },
  status: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

export interface MessageModel extends mongoose.Document {
  customerId: string;
  senderId: string;
  senderName: string;
  messages: string;
  status: boolean;
  createdAt: Date;
}