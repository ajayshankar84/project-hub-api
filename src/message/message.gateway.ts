import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { MessageService } from './message.service';

const room = (customerId: string) => `doc-room-${customerId}`;

@WebSocketGateway({
  path: '/chat',
  cors: { origin: '*', credentials: false },
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Captured in afterInit() as a reliable fallback when @WebSocketServer() is null
  private ioServer: Server;

  constructor(private readonly messageService: MessageService) { }

  afterInit(server: Server) {
    this.ioServer = server;

    server.use((socket: Socket, next) => {
      try {
        const token =
          (socket.handshake.auth as any)?.token ||
          socket.handshake.headers?.authorization?.split(' ')[1];

        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!);
          socket.data.user = decoded;
        }
      } catch {
        // Token invalid — allow connection anyway, socket.data.user will be undefined
        console.warn(`[chat] socket ${socket.id} sent an invalid token, connecting as guest`);
      }
      next();
    });
  }

  async handleConnection(client: Socket) {
    const role = (client.data.user as any)?.role;
    console.log(`[chat] connected: ${client.id} role=${role ?? 'guest'}`);

    if (role === 'admin') {
      // Special room used to broadcast newCustomerRoom events to all admins
      client.join('admins');

      // Auto-join every existing customer room so the admin sees all conversations
      const customerIds = await this.messageService.getDistinctCustomerIds();
      customerIds.forEach((id) => client.join(room(String(id))));
      console.log(`[chat] admin ${client.id} auto-joined ${customerIds.length} rooms`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[chat] disconnected: ${client.id}`);
  }

  private get io(): Server {
    return this.server ?? this.ioServer;
  }

  /** Called by MessageController after HTTP POST to broadcast in real-time */
  async broadcastToRoom(customerId: string, event: string, data: any) {
    const roomName = room(customerId);
    const socketsInRoom = await this.io?.in(roomName).fetchSockets();
    console.log(`[broadcastToRoom] event=${event} room=${roomName} | sockets in room: ${socketsInRoom?.length ?? 0}`);
    this.io?.to(roomName).emit(event, data);
  }

  @SubscribeMessage('joinDocumentRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: string; userId: string; userName: string },
  ) {
    const { customerId, userId, userName } = data;
    const roomName = room(customerId);
    const isNewRoom = (await this.io.in(roomName).fetchSockets()).length === 0;

    client.join(roomName);

    // Store on socket so sendMessage can use it even without JWT
    client.data.userId = client.data.userId ?? userId;
    client.data.userName = client.data.userName ?? userName;

    // When a brand-new customer room is created, pull all online admins into it
    if (isNewRoom) {
      const allSockets = await this.io.fetchSockets();
      const adminSockets = allSockets.filter((s) => (s.data.user as any)?.role === 'admin');
      adminSockets.forEach((adminSocket) => adminSocket.join(roomName));
      console.log(`[joinDocumentRoom] new room ${roomName} — added ${adminSockets.length} online admin(s)`);

      // Notify all admins a new customer conversation has started
      this.io.to('admins').emit('newCustomerRoom', { customerId, userId, userName });
    }

    const socketsInRoom = await this.io.in(roomName).fetchSockets();
    console.log(`[joinDocumentRoom] socket=${client.id} user=${userId} joined room=${roomName} | total in room: ${socketsInRoom.length}`);

    const history = await this.messageService.getMessagesByCustomer(customerId);
    client.emit('messageHistory', history);
    client.emit('roomJoined', { customerId });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: string; message: string },
  ) {
    const { customerId, message } = data;
    if (!message?.trim()) return;

    const user = client.data.user ?? {};
    const senderId = user.sub ?? user.id ?? client.data.userId ?? 'unknown';
    const senderName = user.username ?? user.name ?? client.data.userName ?? '';

    const saved = await this.messageService.create({
      customerId,
      senderId,
      senderName,
      messages: message,
    });

    const roomName = room(customerId);
    const socketsInRoom = await this.io.in(roomName).fetchSockets();
    console.log(`[sendMessage] room=${roomName} | sockets in room: ${socketsInRoom.length} | emitting receiveMessage`);
    // Broadcast to everyone in the room except the sender
    client.to(roomName).emit('receiveMessage', saved);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: string; isTyping: boolean },
  ) {
    const { customerId, isTyping } = data;
    const user = client.data.user ?? {};
    client.to(room(customerId)).emit('userTyping', {
      senderId: user.sub ?? user.id,
      senderName: user.username ?? user.name,
      isTyping,
    });
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: string; readerId: string },
  ) {
    const { customerId, readerId } = data;
    await this.messageService.markAllAsRead(customerId);
    client.to(room(customerId)).emit('messagesRead', {
      customerId,
      readerId,
      readAt: new Date(),
    });
  }

  @SubscribeMessage('documentStatusUpdate')
  handleDocumentStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      customerId: string;
      documentId: string;
      status: string;
      updatedBy: string;
    },
  ) {
    const { customerId, documentId, status, updatedBy } = data;
    this.io.to(room(customerId)).emit('documentStatusChanged', {
      documentId,
      status,
      updatedBy,
      updatedAt: new Date(),
    });
  }

  @SubscribeMessage('newDocumentUploaded')
  handleNewDocumentUploaded(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: string; document: any },
  ) {
    client.to(room(data.customerId)).emit('documentUploaded', data.document);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: string },
  ) {
    client.leave(room(data.customerId));
  }
}
