import * as mongoose from 'mongoose';
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export const DocumentDetailSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
   senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  docTitle: { type: String, required: true },
  docDescription: { type: String, required: false },
  documentPath: { type: String, required: true },
  status: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

export class CreateDocumentDetailDto {
  @IsString() @IsNotEmpty()
  customerId: string;

  @IsString() @IsNotEmpty()
  senderId: string;

  @IsString() @IsNotEmpty()
  senderName: string;

  @IsString() @IsNotEmpty()
  docTitle: string;

  @IsString() @IsOptional()
  docDescription?: string;

  @IsString() @IsNotEmpty()
  status: string;

  @IsOptional()
  fileId?: string;

  @IsOptional()
  chunkIndex?: string | number;

  @IsOptional()
  totalChunks?: string | number;

  @IsString() @IsOptional()
  fileSize?: string;

  @IsString() @IsOptional()
  fileType?: string;
}

export interface DocumentDetailModel extends mongoose.Document {
  customerId: string;
  senderId: string;
  senderName: string;
  docTitle: string;
  docDescription: string;
  documentPath?: string;
  status: string;
  fileSize: string;
  fileType: string;
  createdAt: Date;

}