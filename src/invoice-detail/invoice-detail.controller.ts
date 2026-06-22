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

  @Get('customer/:companyName')
  async getCustomersByCompanyName(@Param('companyName') companyName: string) {
    return this.InvoiceDetailService.getCustomersByCompanyName(companyName);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.InvoiceDetailService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.InvoiceDetailService.remove(id);
  }

  @Get('company/:companyName/customer/:customerName')
  async getInvoicesByCompanyAndCustomer(@Param('companyName') companyName: string, @Param('customerName') customerName: string) {
    return this.InvoiceDetailService.getInvoicesByCompanyAndCustomer(companyName, customerName);
  }
}
