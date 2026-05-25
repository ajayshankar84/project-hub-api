import * as mongoose from 'mongoose';

export const AssignedCourseSchema = new mongoose.Schema({
  courseId: { type: String, required: false },
  courseName: { type: String, required: false },
  courseImage: { type: String, required: false },
  batchId: { type: String, required: false },
  batchName: { type: String, required: false },
  studentName: { type: String, required: false },
  email: { type: String, required: false },
  mobile: { type: String, required: false },
  program: { type: String, required: false },
  internshipType: { type: String, required: false },
  college: { type: String, required: false },
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  isPaid: { type: Boolean, required: false, default: false }
});

export interface AssignedCourseModel extends mongoose.Document {
  courseId: string;
  courseName: string;
  courseImage: string;
  batchId: string;
  batchName: string;
  studentName: string;
  email: string;
  mobile: string;
  program: string;
  internshipType: string;
  college: string;
  active: boolean;
  createdAt: Date;
  isPaid: boolean;
}