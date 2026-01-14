import * as mongoose from 'mongoose';

export const JobSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  companyName: { type: String, required: true, minlength: 3 },
  vendorName: { type: String, required: true, minlength: 3 },
  location: { type: String, required: true, minlength: 3 },
  jobFor: { type: Boolean, required: true, default: true },
  salary: { type: Boolean, required: true, default: true },

  jobType: {
    type: String,
    required: true,
    enum: ['Full-Time', 'Part-Time', 'Freelance', 'Internship', 'Temporary']
  },

  workMode: {
    type: String,
    required: true,
    enum: ['WFO', 'WFH', 'Hybrid', 'Onsite']
  },
  openings: { type: Number, required: true, min: 1 },
  experience: {
    type: String,
    required: true,
    enum: ['0-2', '3-5', '6-8', '8-10', '10+', '12+', '15+', '18+', '20+']
  },
  role: { type: String, required: true, minlength: 3 },
  jobDescription: { type: String, required: true, minlength: 3 },
  keyResponsibilities: { type: String, required: true, minlength: 3 },
  requiredSkills: { type: String, required: true, minlength: 3 },
  requirements: { type: String, required: true, minlength: 3 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  resume: { type: String, required: true }, // Stores the file path/URL of the uploaded image
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now }
});

export interface JobModel extends mongoose.Document {
  name: string;
  companyName: string;
  vendorName: string; 
  location: string;
  jobFor: boolean;
  salary: boolean;
  jobType: 'Full-Time' | 'Part-Time' | 'Freelance' | 'Internship' | 'Temporary';
  workMode: 'WFO' | 'WFH' | 'Hybrid' | 'Onsite';
  openings: number;
  experience: '0-2' | '3-5' | '6-8' | '8-10' | '10+' | '12+' | '15+' | '18+' | '20+';
  role: string;
  jobDescription: string;
  keyResponsibilities: string;
  requiredSkills: string;
  requirements: string;
  rating: number;
  resume: string;
  active: boolean;
  createdAt: Date;  
}