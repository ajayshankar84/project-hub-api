import * as mongoose from 'mongoose';



export const CourseDetailSchema = new mongoose.Schema({

  name: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  discount: { type: Number, required: true, min: 0, default: 0 },
  taxInclusivePrice: { type: String, required: true },
  seatsLeft: { type: String, required: true },
  finalPrice: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  imagePath: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },

  courseId: { type: String, required: true },
  pageTitle: { type: String, required: true },
  pageSubTitle: { type: String, required: true },
  

  duration: { type: String, required: true },
  stipend: { type: String, required: true },
  location: { type: String, required: true },

  whatYouWillLearn: { type: Array, required: true },
  handsOnProjects: { type: Array, required: true },
  mentorshipAndAssessment: { type: Array, required: true },
  openPositions: { type: Object, required: true },
  
  weeklyCommitment: { type: String, required: true },
  startDate: { type: String, required: true },
  
  eligibility: { type: Array, required: true },
  timeline: { type: Array, required: true },
  curriculum: { type: Array, required: true },
  faq: { type: Array, required: true },
  evaluation: { type: Object, required: true },
  perksAndBenefits: { type: Array, required: true },

});

export interface CourseDetailModel extends mongoose.Document {
  name: string;
  type: 'basic' | 'intermediate' | 'advance';
  category: string;
  description: string;
  tag: string;
  price: number;
  discount: number;  
  taxInclusivePrice: string;
  seatsLeft: string;  
  finalPrice: number;
  rating: number;
  imagePath: string;
  active: boolean;
  createdAt: Date;

  pageTitle: string;
  pageSubTitle: string;
  
  duration: string;
  stipend: string;
  location: string;
  whatYouWillLearn: any[];
  handsOnProjects: any[];
  mentorshipAndAssessment: any[];
  openPositions: object;
  
  weeklyCommitment: string;
  startDate: string;
  
  eligibility: any[];
  timeline: any[];
  curriculum: any[];
  faq: any[];
  evaluation: object;
  perksAndBenefits: any[];
}