
import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema({

  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, minlength: 3 },
  subject: { type: String, required: true, minlength: 3 },
  message: { type: String, required: true, minlength: 10, maxLength: 15 },
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