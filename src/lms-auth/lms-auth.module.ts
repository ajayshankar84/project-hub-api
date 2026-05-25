import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LMSAuthController } from './lms-auth.controller';
import { LMSAuthService } from './lms-auth.service';
import { LMSAuthSchema } from './lms-auth.model'

@Module({
  imports: [

    MongooseModule.forFeature([{ name: 'LMSAuth', schema: LMSAuthSchema }])
  ],
  controllers: [LMSAuthController],
  providers: [LMSAuthService],
})
export class LMSAuthModule {}