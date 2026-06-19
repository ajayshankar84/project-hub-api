import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { Public } from '../auth/public.decorator';

@Controller('message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly messageGateway: MessageGateway,
    ) { }

    @Post()
    @Public()
    async create(@Body() data: any) {
        const msg = await this.messageService.create(data);
        // Broadcast to the socket room so the admin sees it in real-time
        if (data.customerId) {
            await this.messageGateway.broadcastToRoom(data.customerId, 'receiveMessage', msg);
        }
        return msg;
    }

    @Get('history/:customerId')
    @Public()
    async getHistory(@Param('customerId') customerId: string) {
        return this.messageService.getMessagesByCustomer(customerId);
    }

    @Patch('read/:messageId')
    @Public()
    async markRead(@Param('messageId') messageId: string) {
        return this.messageService.markAsRead(messageId);
    }
}
