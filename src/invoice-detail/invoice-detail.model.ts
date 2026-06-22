
import * as mongoose from 'mongoose';

export const InvoiceDetailSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  bankDetails: { type: Object, required: false },
  cgstAmount: { type: String, required: false },
  cgstPercent: { type: String, required: false },
  company: { type: Object, required: false },
  customer: { type: Object, required: false },
  dueDate: { type: String, required: false },
  invoiceDate: { type: String, required: false },
  invoiceString: { type: String, required: false },
  items: { type: Array, required: false },
  notes: { type: Array, required: false },
  placeOfSupply: { type: String, required: false },
  project: { type: Object, required: false },
  sgstAmount: { type: String, required: false },
  sgstPercent: { type: String, required: false },
  subTotal: { type: String, required: false },
  totalAmount: { type: String, required: false }
});

export interface InvoiceDetailModel extends mongoose.Document {
invoiceNumber: string;
bankDetails: any;
cgstAmount: string;
cgstPercent: string;
company: any;
customer: any;
dueDate: string;
invoiceDate: string;
invoiceString: string;
items: any[];
notes: any[];
placeOfSupply: string;
project: any;
sgstAmount: string;
sgstPercent: string;
subTotal: string;
totalAmount: string;
}