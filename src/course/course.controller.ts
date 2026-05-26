import { Body, Controller, Get, Param, Post, Put, Delete, UploadedFile, UseInterceptors, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CourseService } from './course.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';


@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Get()
  async findAll() {
    return this.courseService.findAll();
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
    try {
      console.log('Received courseData:', courseData);
      console.log('Type of courseData:', typeof courseData);
      console.log('File received:', file?.filename);

      // If courseData is a JSON string (common frontend mistake), parse it
      let parsedData = courseData;
      if (typeof courseData === 'string') {
        try {
          parsedData = JSON.parse(courseData);
          console.log('Parsed JSON data:', parsedData);
        } catch (e) {
          throw new BadRequestException('Invalid JSON format in course data');
        }
      }

      // Ensure numeric fields are converted properly
      const processedData = {
        ...parsedData,
        price: parsedData.price ? Number(parsedData.price) : undefined,
        discount: parsedData.discount ? Number(parsedData.discount) : 0,
        finalPrice: parsedData.finalPrice ? Number(parsedData.finalPrice) : undefined,
        rating: parsedData.rating ? Number(parsedData.rating) : undefined,
      };

      const imagePath = file ? file.path : '';
      return await this.courseService.create(processedData, imagePath);
    } catch (error) {
      console.error('Full error:', error); // 👈 See actual validation error
      if (error instanceof BadRequestException) throw error;
      // Re-throw the actual mongoose error for debugging
      throw new InternalServerErrorException('An error occurred while creating course');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/courses',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async update(@Param('id') id: string, @UploadedFile() file: any, @Body() updateData: any) {
    try {
      // If updateData is a JSON string (common when using FormData), parse it
      let parsedData = updateData;
      if (typeof updateData === 'string') {
        try {
          parsedData = JSON.parse(updateData);
        } catch (e) {
          throw new BadRequestException('Invalid JSON format in update data');
        }
      }

      // Ensure numeric fields are converted properly
      const processedData = {
        ...parsedData,
        price: parsedData.price !== undefined ? Number(parsedData.price) : undefined,
        discount: parsedData.discount !== undefined ? Number(parsedData.discount) : undefined,
        finalPrice: parsedData.finalPrice !== undefined ? Number(parsedData.finalPrice) : undefined,
        rating: parsedData.rating !== undefined ? Number(parsedData.rating) : undefined,
      };

      const data = { ...processedData };
      if (file) {
        data.imagePath = file.path;
      }

      return await this.courseService.update(id, data);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while updating course');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.courseService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while deleting course');
    }
  }
}