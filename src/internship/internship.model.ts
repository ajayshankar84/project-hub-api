
import * as mongoose from 'mongoose';

export const InternshipSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, minlength: 3 },
  program: { type: String, required: true, minlength: 3 },
  college: { type: String, required: true, minlength: 3 },
  mobile: { type: String, required: true, minlength: 10, maxLength: 10 },
  internshipType: { type: String, required: true, minlength: 3 },
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  referralName: { type: String, required: false, minlength: 3 },
  referralMobile: { type: String, required: false, minlength: 10, maxLength: 10 },
  total: { type: Number, required: false, default: 0 },
  paid: { type: Number, required: false, default: 0 },
  balance: { type: Number, required: false, default: 0 },
   city:  { type: String, required: false },
  comment:  { type: String, required: false },
  yearsOfStudy:  { type: String, required: false },
});

export interface InternshipModel extends mongoose.Document {
  name: string;
  email: string;
  program: string;
  college: string;
  mobile: string;
  internshipType: string;
  active: boolean;
  createdAt: Date;
  referralName: string;
  referralMobile: string;
  total: number;
  paid: number;
  balance: number;
  city: string;
  comment: string;
  yearsOfStudy: string;
}