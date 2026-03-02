import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InternshipService } from './internship.service';


@Controller('internship')
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) { }

  @Get()
  async getAllInternships() {
    console.log('Fetching all internships');
    return await this.internshipService.findAll();
  }

  @Get(':id')
  async getInternship(@Param('id') id: string) {
    return await this.internshipService.findOne(id);
  }

  @Post()
  async create(@Body() internshipData: any) {
    // The path where the image is saved on the server
    return this.internshipService.create(internshipData);
  }

  @Get()
  async findAll() {
    return this.internshipService.findAll();
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() internshipData: any) {
    return await this.internshipService.update(id, internshipData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.internshipService.remove(id);
  }

}