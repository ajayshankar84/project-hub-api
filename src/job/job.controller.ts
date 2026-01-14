import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JobService } from './job.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';


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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/jobs',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@UploadedFile() file: any, @Body() jobData: any) {
    // The path where the image is saved on the server
    const imagePath = file ? file.path : '';
    return this.jobService.create(jobData, imagePath);
  }

  @Get()
  async findAll() {
    return this.jobService.findAll();
  }

  
}