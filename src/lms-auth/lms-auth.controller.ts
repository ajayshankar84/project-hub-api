import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LMSAuthService } from './lms-auth.service';


@Controller('lms-auth')
export class LMSAuthController {
  constructor(private readonly lmsAuthService: LMSAuthService) { }

  @Get()
  async getAllInternships() {
    console.log('Fetching all internships');
    return await this.lmsAuthService.findAll();
  }

  @Get(':id')
  async getInternship(@Param('id') id: string) {
    return await this.lmsAuthService.findOne(id);
  }

  @Get('by-mobile/:mobile')
  async getInternshipByMobile(@Param('mobile') mobile: string) {
    console.log('Fetching internship by mobile:', mobile);
    return await this.lmsAuthService.findByMobile(mobile);
  }

  @Post()
  async create(@Body() internshipData: any) {
    // The path where the image is saved on the server
    return this.lmsAuthService.create(internshipData);
  }

  @Get()
  async findAll() {
    return this.lmsAuthService.findAll();
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() internshipData: any) {
    return await this.lmsAuthService.update(id, internshipData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.lmsAuthService.remove(id);
  }

}