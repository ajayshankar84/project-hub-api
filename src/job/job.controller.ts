import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JobService } from './job.service';
import { JobModel } from './job.model';


@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getAllJobs() {
    return await this.jobService.findAll();
  }

  @Get(':id')
  async getJob(@Param('id') id: string) {
    return await this.jobService.findOne(id);
  }

 @Post()
  async create(@Body() jobData: any) {
    console.log('job controller:',jobData);
    return this.jobService.create(jobData);
  }

  // @Get()
  // async findAll() {
  //   return this.jobService.findAll();
  // }

  
}