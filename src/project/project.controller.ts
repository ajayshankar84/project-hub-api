import { Controller, Get, Param, Post, Patch, Delete, Query, ParseIntPipe, Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Public } from '../auth/public.decorator';


@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get()
  
  async findAll() {
    console.log('Project') 
    return this.projectService.findAll();
  }

  @Post()
  
  async create(
    @Body() createData: any
  ) {
    return this.projectService.create(createData);
  }

  @Patch(':id')
  
  async update(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.projectService.update(id, updateData);
  }

  @Delete(':id')
  
  async remove(@Param('id') id: string) {
    return await this.projectService.remove(id);
  }

  @Get('paged/:page/:limit')
  
  async findPaged(
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
    @Query() query: any,
  ) {
    // Destructure query params. Since the frontend 'cleans' empty values, 
    // properties like search, sortBy, or sortDir might be missing (undefined).
    // The service layer handles defaults for these if they are undefined.
    const { search, sortBy, sortDir, status, ...filters } = query || {};
    
    return this.projectService.findPaged(page, limit, search, sortBy, sortDir, status, filters);
  } 

  @Get(':id')
  
  async findOne(@Param('id') id: string) {
    return await this.projectService.findOne(id);
  }

  @Get('mobile/:mobile')
  
  async findByMobile(@Param('mobile') mobile: string) {
    return await this.projectService.findByMobile(mobile);
  }

  @Get('customer/:customerId')
  
  async findByCustomerId(@Param('customerId') customerId: string) {
    return await this.projectService.findByCustomerId(customerId);
  }

  @Patch(':id/status')
  
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string // Expecting a body like { "status": "newStatusValue" }
  ) {
    return this.projectService.updateProjectStatus(id, status);
  }

}