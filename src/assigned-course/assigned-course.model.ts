import * as mongoose from 'mongoose';

export const AssignedCourseSchema = new mongoose.Schema({
  courseId: { type: String, required: false },
  courseName: { type: String, required: false },    
  type: { type: String, required: false },
  category:{ type: String, required: false },
  description: { type: String, required: false },
  tag: { type: String, required: false },
  price:  { type: Number, required: false },
  discountType: { type: String, required: false },
  discount: { type: Number, required: false },
  finalPrice:  { type: Number, required: false },
  rating: { type: Number, required: false },
  imagePath: { type: String, required: false },  
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  isPaid: { type: Boolean, required: false, default: false },
  
  batchId: { type: String, required: false },
  batchName: { type: String, required: false },
  studentName: { type: String, required: false },
  email: { type: String, required: false },
  mobile: { type: String, required: false },
  program: { type: String, required: false },
  internshipType: { type: String, required: false },
  college: { type: String, required: false },

});

export interface AssignedCourseModel extends mongoose.Document {
  courseId: string;
  courseName: string;
  

  
  type: string;
  category: string;
  description: string;
  tag: string;
  price: number;
  discountType: string;
  discount: number;
  finalPrice: number;
  rating: number;
  imagePath: string;
  active: boolean;
  createdAt: Date;
  isPaid: boolean;

  
  batchId: string;
  batchName: string;
  studentName: string;
  email: string;
  mobile: string;
  program: string;
  internshipType: string;
  college: string;
 
}