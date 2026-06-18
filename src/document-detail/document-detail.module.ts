import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentDetailController } from './document-detail.controller';
import { DocumentDetailService } from './document-detail.service';
import { DocumentDetailSchema } from './document-detail.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'DocumentDetail', schema: DocumentDetailSchema }])
  ],
  controllers: [DocumentDetailController],
  providers: [DocumentDetailService],
})
export class DocumentDetailModule {}
