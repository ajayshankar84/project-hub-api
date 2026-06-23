import { Controller, Get, Param, Post, Patch, Delete, Query, ParseIntPipe, Body } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Public } from '../auth/public.decorator';


@Controller('ticket')
@Public()
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Get()
  
  async findAll() {
    console.log('Ticket') 
    return this.ticketService.findAll();
  }

  @Post()
  
  async create(
    @Body() createData: any
  ) {
    return this.ticketService.create(createData);
  }

  @Patch(':id')
  
  async update(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.ticketService.update(id, updateData);
  }

  @Delete(':id')
  
  async remove(@Param('id') id: string) {
    return await this.ticketService.remove(id);
  }

 

}