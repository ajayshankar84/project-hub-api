import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectDateController } from './project-date.controller';
import { ProjectDateService } from './project-date.service';
import { ProjectDateSchema } from './project-date.model'

@Module({
  imports: [

    MongooseModule.forFeature([{ name: 'ProjectDate', schema: ProjectDateSchema }])
  ],
  controllers: [ProjectDateController],
  providers: [ProjectDateService],
})
export class ProjectDateModule {}