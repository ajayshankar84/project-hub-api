import { Controller, Get, Param, Post, Patch, Delete, Query, ParseIntPipe, Body } from '@nestjs/common';
import { InvoiceDetailService } from './invoice-detail.service';
import { Public } from '../auth/public.decorator';


@Controller('invoice-detail')
export class InvoiceDetailController {
  constructor(private readonly InvoiceDetailService: InvoiceDetailService) { }

  @Post()
  async create(@Body() createData: any) {
    return this.InvoiceDetailService.create(createData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.InvoiceDetailService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.InvoiceDetailService.remove(id);
  }
}
