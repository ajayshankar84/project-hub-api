import * as mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  type: { 
    type: String, 
    required: true, 
    enum: ['basic', 'intermediate', 'advance'] 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['web_dev', 'mobile', 'backend', 'frontend', 'full_stack', 'mean_stack', 'mern_stack', 'dev_ops']
  },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  discountType: { 
    type: String, 
    required: true, 
    enum: ['percent', 'inr'], 
    default: 'percent' 
  },
  discount: { type: Number, required: true, min: 0, default: 0 },
  finalPrice: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  imagePath: { type: String, required: true }, // Stores the file path/URL of the uploaded image
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  isPaid: { type: Boolean, required: false, default: false }
});

export interface CourseModel extends mongoose.Document {
  name: string;
  type: 'basic' | 'intermediate' | 'advance';
  category: string;
  description: string;
  tag: string;
  price: number;
  discountType: 'percent' | 'inr';
  discount: number;
  finalPrice: number;
  rating: number;
  imagePath: string;
  active: boolean;
  createdAt: Date;
  isPaid: boolean;
}