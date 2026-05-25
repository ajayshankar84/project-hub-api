import { Body, Controller, Param, Post , Get} from '@nestjs/common';
import { AssignedCourseService } from './assigned-course.service';
import { CreateAssignedCourseDto } from './dto/create-assigned-course.dto';
import { FindAssignedCourseByMobileDto } from './dto/find-assigned-course-by-mobile.dto';

@Controller('assigned-course')
export class AssignedCourseController {
  constructor(private readonly assignedCourseService: AssignedCourseService) {}

  @Post('list')
  async getAllAssignedCourses() {
    return await this.assignedCourseService.findAllPost();
  }

  @Get(':by-id')
  async getAssignedCourse(@Param('by-id') id: string) {
    return await this.assignedCourseService.findOne(id);
  }

  @Post('create')
  async createAssignedCourse(@Body() createAssignedCourseDtos: CreateAssignedCourseDto[]) {
    return await this.assignedCourseService.createMany(createAssignedCourseDtos);
  }

  @Get(':by-mobile')
  async getAssignedCoursesByMobile(@Param('by-mobile') byMobile: string) {
    return await this.assignedCourseService.findByMobile(byMobile);
  }

  
}
