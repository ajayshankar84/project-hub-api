// auth.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@UseGuards(JwtAuthGuard)   // 👈 protect all routes by default
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  async getAllInternships() {
    console.log('Fetching all internships');
    return await this.authService.findAll();
  }

  @Get(':id')
  async getInternship(@Param('id') id: string) {
    return await this.authService.findOne(id);
  }

  @Get('by-mobile/:mobile')
  async getInternshipByMobile(@Param('mobile') mobile: string) {
    console.log('Fetching internship by mobile:', mobile);
    return await this.authService.findByMobile(mobile);
  }

  @Public()  // 👈 registration should be public
  @Post('create')
  async create(@Body() internshipData: any) {
    return this.authService.create(internshipData);
  }


  @Post('reset-password')
  async resetPassword(@Body() data: any) {
    return await this.authService.resetPassword(data);
  }


  @Public()  // 👈 login is public
  @Post('login')
  async login(@Body() loginData: any) {
    return await this.authService.login(loginData);
  }

  // Protected routes (no @Public)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() internshipData: any) {
    return await this.authService.update(id, internshipData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authService.remove(id);
  }
}