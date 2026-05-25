
import { Body, Controller, NotFoundException, Param, Post, Get, Put, InternalServerErrorException } from '@nestjs/common';
import { CourseDetailService } from './course-detail.service';

@Controller('course-detail')
export class CourseDetailController {
  constructor(private readonly courseDetailService: CourseDetailService) { }

  @Get()
  async getAllCourses() {
    return await this.courseDetailService.findAll();
  }

  @Get('/:courseId')
  async getCourseDetailByCourseId(@Param('courseId') courseId: string) {
    return this.courseDetailService.findByCourseId(courseId);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    try {
      return await this.courseDetailService.update(id, updateData);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while updating course detail');
    }
  }
}
