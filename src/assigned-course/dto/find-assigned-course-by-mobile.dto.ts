import { IsNotEmpty, IsString } from 'class-validator';

export class FindAssignedCourseByMobileDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;
}

