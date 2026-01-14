import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InternshipService } from './internship.service';


@Controller('internship')
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}

  @Get()
  async getAllInternships() {
    return await this.internshipService.findAll();
  }

  @Get(':id')
  async getInternship(@Param('id') id: string) {
    return await this.internshipService.findOne(id);
  }

 @Post()
  async create( @Body() internshipData: any) {
    // The path where the image is saved on the server
    return this.internshipService.create(internshipData);
  }

  @Get()
  async findAll() {
    return this.internshipService.findAll();
  }

  
}