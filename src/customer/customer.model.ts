
import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
  cid: { type: String, required: false },
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, minlength: 3 },
  company: { type: String, required: true, minlength: 3 },
  country: { type: String, required: true, minlength: 3 },
  mobile: { type: String, required: true, minlength: 10, maxLength: 15 },
  status: { type: String, required: true, default: 'active' },
  createdAt: { type: Date, default: Date.now, index: true },
  product: { type: String, required: false },
  address: { type: String, required: false },
  bankName: { type: String, required: false },
  acNo: { type: String, required: false },
  ifscCode: { type: String, required: false },
  branchName: { type: String, required: false },
  gstNo: { type: String, required: false },
});

export interface CustomerModel extends mongoose.Document {
  cid: string;
  name: string;
  email: string;
  company: string;
  country: string;
  mobile: string;
  status: string;
  createdAt: Date;
  product: string;
  address: string;
  bankName: string;
  acNo: string;
  ifscCode: string;
  branchName: string;
  gstNo:string;
}