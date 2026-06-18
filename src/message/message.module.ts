import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageSchema } from './message.model';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway]
})
export class MessageModule {}
