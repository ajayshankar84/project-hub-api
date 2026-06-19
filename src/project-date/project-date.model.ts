
import * as mongoose from 'mongoose';

export const ProjectDateSchema = new mongoose.Schema({
  projectId: { type: String, required: true, minlength: 3 },
  updateAt: { type: Date, default: Date.now, index: true },
  status: { type: String, required: true },
});

export interface ProjectDateModel extends mongoose.Document {
  projectId: string;
  updateAt: Date;
  status: string;
}