import { Controller, Get, Param, Post, Patch, Delete, Query, ParseIntPipe, Body } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Public } from '../auth/public.decorator';


@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Get()
  @Public()
  async findAll() {
    console.log('Customer') 
    return this.customerService.findAll();
  }

  @Post()
  @Public()
  async create(
    @Body() createData: any
  ) {
    return this.customerService.create(createData);
  }

  @Patch(':id')
  @Public()
  async update(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.customerService.update(id, updateData);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    return await this.customerService.remove(id);
  }

  @Get('paged/:page/:limit')
  @Public()
  async findPaged(
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
    @Query() query: any,
  ) {
    // Destructure query params. Since the frontend 'cleans' empty values, 
    // properties like search, sortBy, or sortDir might be missing (undefined).
    // The service layer handles defaults for these if they are undefined.
    const { search, sortBy, sortDir, status, ...filters } = query || {};
    
    return this.customerService.findPaged(page, limit, search, sortBy, sortDir, status, filters);
  }

  @Get('stats/customer-growth')
  @Public()
  async getCustomerGrowth() {
    return this.customerService.getCustomerGrowth();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOne(id);
  }

  @Get('mobile/:mobile')
  @Public()
  async findByMobile(@Param('mobile') mobile: string) {
    return await this.customerService.findByMobile(mobile);
  }

}