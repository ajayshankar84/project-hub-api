# Socket.IO Integration Guide — Frontend

## 1. Install

```bash
npm install socket.io-client
```

---

## 2. Connect

```typescript
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('https://a-interview.praispranav.com', {
  transports: ['websocket', 'polling'],
  reconnection: true,
});

socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('connect_error', (err) => console.error('Connection error:', err.message));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
```

> No auth token needed for connection. Token is only for REST API calls.

---

## 3. Sequence of Events

### Who creates the room?
**The customer creates the room** by being the first to emit `joinDocumentRoom`.  
The admin joins the same room using the same `customerId`.  
Both sides must be in the room to exchange messages.

```
CUSTOMER side                          ADMIN side
─────────────────────────────────────────────────────────
connect()                              connect()
  │                                      │
  ▼                                      ▼
joinDocumentRoom(customerId)           joinDocumentRoom(customerId)
  │                                      │  (same customerId)
  ▼                                      ▼
← messageHistory []                    ← messageHistory []
← roomJoined                           ← roomJoined
  │                                      │
  ▼                                      ▼
sendMessage / POST /message  ─────►  receiveMessage
receiveMessage  ◄─────────────────── sendMessage / POST /message
```

### Step 1 — Connect (happens automatically on `io(...)`)

```
Client ──connect──► Server
Server ──(connected)──► Client
```

### Step 2 — Customer joins their room

```typescript
// Customer side — use their own _id as customerId
socket.emit('joinDocumentRoom', {
  customerId: '64abc123...',   // Customer MongoDB _id
  userId: 'customer-user-id',
  userName: 'John Doe',
});
```

### Step 2b — Admin joins a customer room

```typescript
// Admin side — use the customer's _id as customerId
socket.emit('joinDocumentRoom', {
  customerId: '64abc123...',   // same Customer _id
  userId: 'admin-user-id',
  userName: 'Admin Name',
});
```

```
Client ──joinDocumentRoom──► Server
Server ──messageHistory──► Client   (full past messages array)
Server ──roomJoined──► Client       ({ customerId })
```

### Step 3 — Send a message

**Option A — via Socket (real-time):**
```typescript
socket.emit('sendMessage', {
  customerId: '64abc123...',
  message: 'Hello!',
});
```

**Option B — via HTTP POST (primary path):**
```typescript
POST /message
Body: { customerId, senderId, senderName, messages: 'Hello!' }
```

Both options trigger `receiveMessage` on everyone in the room.

### Step 4 — Receive messages

```typescript
socket.on('receiveMessage', (msg) => {
  console.log(msg);
  // msg = { _id, customerId, senderId, senderName, messages, status, createdAt }
});
```

### Step 5 — Typing indicator

```typescript
// Send
socket.emit('typing', { customerId: '64abc123...', isTyping: true });
socket.emit('typing', { customerId: '64abc123...', isTyping: false });

// Receive
socket.on('userTyping', ({ senderId, senderName, isTyping }) => { ... });
```

### Step 6 — Mark messages as read

```typescript
socket.emit('markRead', { customerId: '64abc123...', readerId: 'user-id' });

socket.on('messagesRead', ({ customerId, readerId, readAt }) => { ... });
```

### Step 7 — Leave room (on component destroy)

```typescript
socket.emit('leaveRoom', { customerId: '64abc123...' });
```

---

## 4. Admin — Join All Rooms

Admin subscribes to all customer rooms at once (for global notifications):

```typescript
socket.emit('adminJoinAllRooms', { adminId: 'admin-id' });
```

---

## 5. Document Events

```typescript
// Notify others when a document is uploaded
socket.emit('newDocumentUploaded', {
  customerId: '64abc123...',
  document: { /* document object */ },
});

socket.on('documentUploaded', (document) => { ... });

// Admin updates document status
socket.emit('documentStatusUpdate', {
  customerId: '64abc123...',
  documentId: 'doc-id',
  status: 'reviewed',
  updatedBy: 'admin-name',
});

socket.on('documentStatusChanged', ({ documentId, status, updatedBy, updatedAt }) => { ... });
```

---

## 6. Angular Service — Minimal Working Example

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';

const SERVER = 'https://a-interview.praispranav.com';

@Injectable({ providedIn: 'root' })
export class ChatService implements OnDestroy {
  private socket: Socket;

  connect() {
    this.socket = io(SERVER, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    this.socket.on('connect', () => console.log('[socket] connected'));
    this.socket.on('connect_error', (e) => console.error('[socket] error', e.message));
  }

  joinRoom(customerId: string, userId: string, userName: string) {
    this.socket.emit('joinDocumentRoom', { customerId, userId, userName });
  }

  sendMessage(customerId: string, message: string) {
    this.socket.emit('sendMessage', { customerId, message });
  }

  onMessageHistory(cb: (msgs: any[]) => void) {
    this.socket.on('messageHistory', cb);
  }

  onReceiveMessage(cb: (msg: any) => void) {
    this.socket.on('receiveMessage', cb);
  }

  onUserTyping(cb: (data: any) => void) {
    this.socket.on('userTyping', cb);
  }

  sendTyping(customerId: string, isTyping: boolean) {
    this.socket.emit('typing', { customerId, isTyping });
  }

  markRead(customerId: string, readerId: string) {
    this.socket.emit('markRead', { customerId, readerId });
  }

  leaveRoom(customerId: string) {
    this.socket.emit('leaveRoom', { customerId });
  }

  disconnect() {
    this.socket?.disconnect();
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
```

---

## 7. Component Usage

```typescript
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];

  constructor(private chat: ChatService) {}

  ngOnInit() {
    this.chat.connect();
    this.chat.joinRoom(this.customerId, this.userId, this.userName);

    this.chat.onMessageHistory((msgs) => this.messages = msgs);
    this.chat.onReceiveMessage((msg) => this.messages.push(msg));
  }

  send(text: string) {
    this.chat.sendMessage(this.customerId, text);
  }

  ngOnDestroy() {
    this.chat.leaveRoom(this.customerId);
    this.chat.disconnect();
  }
}
```

---

## 8. Critical Rules

| # | Rule |
|---|------|
| 1 | Always emit `joinDocumentRoom` **before** `sendMessage` — both admin and user must join |
| 2 | Use the same `customerId` on both sides — it drives the room name |
| 3 | Listen for `receiveMessage` — fired for **both** socket sends and HTTP POST sends |
| 4 | Message field is `messages` (plural) — `msg.messages` not `msg.message` |
| 5 | Call `leaveRoom` + `disconnect()` on component destroy to avoid ghost connections |
