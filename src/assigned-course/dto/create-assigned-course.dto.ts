import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAssignedCourseDto {
  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  courseName?: string;

  // Some clients send "course" instead of "courseName"
  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsOptional()
  @IsString()
  batchName?: string;

  @IsOptional()
  @IsString()
  studentName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  internshipType?: string;

  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
