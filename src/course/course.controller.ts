import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';


@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getAllCourses() {
    return await this.courseService.findAll();
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }

 @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/courses',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@UploadedFile() file: any, @Body() courseData: any) {
    // The path where the image is saved on the server
    const imagePath = file ? file.path : '';
    return this.courseService.create(courseData, imagePath);
  }

  @Get()
  async findAll() {
    return this.courseService.findAll();
  }

  
}