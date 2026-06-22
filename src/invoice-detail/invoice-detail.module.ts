import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceDetailController } from './invoice-detail.controller';
import { InvoiceDetailService } from './invoice-detail.service';
import { InvoiceDetailSchema } from './invoice-detail.model'

@Module({
  imports: [

    MongooseModule.forFeature([{ name: 'InvoiceDetail', schema: InvoiceDetailSchema }])
  ],
  controllers: [InvoiceDetailController],
  providers: [InvoiceDetailService],
})
export class InvoiceDetailModule {}