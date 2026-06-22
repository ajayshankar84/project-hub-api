
import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3 },
  lastName: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, minlength: 3 },
  mobile: { type: String, required: true, minlength: 10, maxLength: 10 },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },

  program: { type: String, required: false, minlength: 3 },
  college: { type: String, required: false, minlength: 3 },

  internshipType: { type: String, required: false, minlength: 3 },
  active: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, default: Date.now },
  referralName: { type: String, required: false, minlength: 3 },
  referralMobile: { type: String, required: false, minlength: 10, maxLength: 10 },
  total: { type: Number, required: false, default: 0 },
  paid: { type: Number, required: false, default: 0 },
  balance: { type: Number, required: false, default: 0 },
  city: { type: String, required: false },
  comment: { type: String, required: false },
  yearsOfStudy: { type: String, required: false },
  address: { type: String, required: false },
  gstNo: { type: String, required: false },
  company: { type: Array, required: false },
});

export interface AuthModel extends mongoose.Document {
  firstName: string;
  lastName: string;
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
  password: string;
  role: 'admin' | 'user';
  address: string;
  gstNo: string;
  company: any[];
}