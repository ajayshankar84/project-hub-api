import * as mongoose from 'mongoose';

export const JobSchema = new mongoose.Schema({
  active: { type: Boolean, required: true, default: true },
  companyName: { type: String, required: true, minlength: 3 },
  createdAt: { type: Date, default: Date.now },
  experience: { type: String, required: true },
  jobDescription: { type: String, required: true, minlength: 3 },
  jobFor: { type: Boolean, required: true, default: true },
  jobRole: { type: String, required: true, minlength: 3 },
  jobType: { type: String, required: true },
  keyResponsibilities: { type: String, required: true, minlength: 3 },
  location: { type: String, required: true, minlength: 3 },
  name: { type: String, required: true, minlength: 3 },
  opening: { type: Number, required: true, min: 1 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  requiredSkills: { type: Array, required: true, minlength: 3 },
  requirements: { type: String, required: true, minlength: 3 },
  salaryRange: { type: String, required: true, minlength: 3 },
  vendorName: { type: String, required: true, minlength: 3 },
  workMode: { type: String, required: true },
});

export interface JobModel extends mongoose.Document {
  name: string;
  companyName: string;
  vendorName: string;
  location: string;
  jobFor: string;
  salaryRange: string;
  jobType: string;
  workMode: any;
  opening: number;
  experience: string;
  jobRole: string;
  jobDescription: string;
  keyResponsibilities: string;
  requiredSkills: any;
  requirements: string;
  rating: number;
  active: boolean;
  createdAt: Date;
}