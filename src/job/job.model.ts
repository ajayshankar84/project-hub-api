import * as mongoose from 'mongoose';

export const JobSchema = new mongoose.Schema({
  active: { type: Boolean,  default: true },
  companyName: { type: String,  minlength: 3 },
  createdAt: { type: Date, default: Date.now },
  experience: { type: String,  },
  jobDescription: { type: String,  minlength: 3 },
  jobFor: { type: Boolean,  default: true },
  jobRole: { type: String,  minlength: 3 },
  jobType: { type: String,  },
  keyResponsibilities: { type: String,  minlength: 3 },
  location: { type: String,  minlength: 3 },
  name: { type: String,  minlength: 3 },
  opening: { type: Number,  min: 1 },
  rating: { type: Number,  min: 1, max: 5 },
  requiredSkills: { type: Array,  minlength: 3 },
  requirements: { type: String,  minlength: 3 },
  salaryRange: { type: String,  minlength: 3 },
  vendorName: { type: String,  minlength: 3 },
  workMode: { type: String,  },
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