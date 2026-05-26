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
  courseId: { type: String, required: false },


  pageTitle: { type: String, required: false },
  pageSubTitle: { type: String, required: false },
  

  duration: { type: String, required: false },
  stipend: { type: String, required: false },
  location: { type: String, required: false },

  whatYouWillLearn: { type: Array, required: false },
  handsOnProjects: { type: Array, required: false },
  mentorshipAndAssessment: { type: Array, required: false },
  openPositions: { type: Object, required: false },
  
  weeklyCommitment: { type: String, required: false },
  startDate: { type: String, required: false },
  
  eligibility: { type: Array, required: false },
  timeline: { type: Array, required: false },
  curriculum: { type: Array, required: false },
  faq: { type: Array, required: false },
  evaluation: { type: Object, required: false },
  perksAndBenefits: { type: Array, required: false },

});

export interface CourseDetailModel extends mongoose.Document {
  name: string;
  type: string;
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