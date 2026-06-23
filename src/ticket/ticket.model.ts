
import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  createdAt: { type: Date, default: Date.now, index: true },
});

export interface TicketModel extends mongoose.Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
}