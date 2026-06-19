import { Controller, Get, Param, Post, Patch, Delete, Query, ParseIntPipe, Body } from '@nestjs/common';
import { ProjectDateService } from './project-date.service';
import { Public } from '../auth/public.decorator';


@Controller('project-date')
export class ProjectDateController {
  constructor(private readonly projectDateService: ProjectDateService) { }

  @Get()
  async findAll() {
    return this.projectDateService.findAll();
  }

  @Post()
  
  async create(
    @Body() createData: any
  ) {
    return this.projectDateService.create(createData);
  }
}