import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketSchema } from './ticket.model'

@Module({
  imports: [

    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }])
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}