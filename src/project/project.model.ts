
import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({

  projectName: { type: String, required: true, minlength: 3 },
  customerId: { type: String, required: true, minlength: 3 },
  status: { type: String, required: true, default: 'pending' },
  createdAt: { type: Date, default: Date.now, index: true },
  dueDate: { type: Date, default: Date.now, index: true },

});

export interface ProjectModel extends mongoose.Document {
  
  projectName: string;
  customerId: string;
  status: string;
  createdAt: Date;
  dueDate: Date;


}