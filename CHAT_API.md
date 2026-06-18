# Chat WebSocket API

**Server:** `https://a-interview.praispranav.com`  
**Socket.IO path:** `/chat`  
**Transport:** WebSocket (falls back to polling)

---

## Connection

```js
import { io } from 'socket.io-client';

const socket = io('https://a-interview.praispranav.com', {
  path: '/chat',
  transports: ['websocket', 'polling'],
  auth: {
    token: '<JWT_TOKEN>',   // just the token, no "Bearer" prefix
  },
});
```

The server reads the JWT and sets `role` on the socket automatically.  
- If `role === 'admin'` → admin is auto-joined to all existing customer rooms.  
- No manual room-joining or special emit is needed for admins on connect.

---

## Flow Diagram

```
Customer                    Server                       Admin
   |                          |                             |
   |── connect (JWT) ─────────▶|                             |
   |── joinDocumentRoom ───────▶|                             |
   |                           |── (new room?) auto-add ─────▶ all online admins join
   |                           |── newCustomerRoom ───────────▶ admin panel notified
   |◀── messageHistory ────────|                             |
   |◀── roomJoined ────────────|                             |
   |                           |                             |
   |── sendMessage ────────────▶|                             |
   |◀── receiveMessage ─────────|── receiveMessage ───────────▶
   |                           |                             |
   |                           |◀── sendMessage (reply) ──────|
   |◀── receiveMessage ─────────|                             |
```

---

## Admin

### Connect
```js
const socket = io('https://a-interview.praispranav.com', {
  path: '/chat',
  transports: ['websocket', 'polling'],
  auth: { token: '<ADMIN_JWT>' },
  // JWT must contain role: "admin"
});

socket.on('connect', () => {
  // Server auto-joined all existing customer rooms — nothing to emit
});
```

### Listen: new customer room opened
```js
socket.on('newCustomerRoom', ({ customerId, userId, userName }) => {
  // A customer opened a chat after the admin connected
  // Admin is already in the room — no action needed
  // Add this customer to your UI list
});
```

### Listen: incoming message (from any customer)
```js
socket.on('receiveMessage', (message) => {
  // message.customerId  → which customer sent this
  // message.senderId    → sender's user ID
  // message.senderName  → sender's display name
  // message.messages    → message text
  // message.createdAt   → timestamp
});
```

### Reply to a customer
```js
socket.emit('sendMessage', {
  customerId: '<CUSTOMER_ID>',
  message: 'How can I help you?',
});
```

### Load history for a specific customer
```js
// Emit when admin opens a customer's chat window
socket.emit('joinDocumentRoom', {
  customerId: '<CUSTOMER_ID>',
  userId: '<ADMIN_USER_ID>',
  userName: '<ADMIN_NAME>',
});

socket.on('messageHistory', (messages) => {
  // Array of past messages for this customer
});

socket.on('roomJoined', ({ customerId }) => {
  // Confirmed in room
});
```

### Typing indicator
```js
// Send
socket.emit('typing', { customerId: '<CUSTOMER_ID>', isTyping: true });
socket.emit('typing', { customerId: '<CUSTOMER_ID>', isTyping: false });

// Receive (from the other side)
socket.on('userTyping', ({ senderId, senderName, isTyping }) => { });
```

### Mark messages as read
```js
socket.emit('markRead', {
  customerId: '<CUSTOMER_ID>',
  readerId: '<ADMIN_USER_ID>',
});

socket.on('messagesRead', ({ customerId, readerId, readAt }) => { });
```

---

## Customer

### Connect & join room
```js
const socket = io('https://a-interview.praispranav.com', {
  path: '/chat',
  transports: ['websocket', 'polling'],
  auth: { token: '<CUSTOMER_JWT>' },
});

socket.on('connect', () => {
  socket.emit('joinDocumentRoom', {
    customerId: '<THEIR_CUSTOMER_ID>',
    userId: '<THEIR_USER_ID>',
    userName: '<THEIR_NAME>',
  });
});

socket.on('roomJoined', ({ customerId }) => { /* confirmed */ });

socket.on('messageHistory', (messages) => {
  // Load previous messages into UI
});
```

### Send a message
```js
socket.emit('sendMessage', {
  customerId: '<THEIR_CUSTOMER_ID>',
  message: 'I need help with my document.',
});
```

### Receive messages (own + admin replies)
```js
socket.on('receiveMessage', (message) => {
  // message.senderId === ownUserId ? "you" : "admin"
});
```

### Typing indicator
```js
socket.emit('typing', { customerId: '<THEIR_CUSTOMER_ID>', isTyping: true });
socket.on('userTyping', ({ senderId, senderName, isTyping }) => { });
```

### Leave room (optional, e.g. on page close)
```js
socket.emit('leaveRoom', { customerId: '<THEIR_CUSTOMER_ID>' });
```

---

## Document Events

### Notify room of a new document upload
```js
socket.emit('newDocumentUploaded', {
  customerId: '<CUSTOMER_ID>',
  document: { /* document object */ },
});

socket.on('documentUploaded', (document) => { });
```

### Update document status
```js
socket.emit('documentStatusUpdate', {
  customerId: '<CUSTOMER_ID>',
  documentId: '<DOCUMENT_ID>',
  status: 'approved',   // or 'rejected', 'pending', etc.
  updatedBy: '<USER_ID>',
});

socket.on('documentStatusChanged', ({ documentId, status, updatedBy, updatedAt }) => { });
```

---

## Connection Events

```js
socket.on('connect', () => { /* connected */ });
socket.on('disconnect', (reason) => { /* disconnected */ });
socket.on('connect_error', (err) => { console.error(err.message); });
```

---

## Message Object Shape

```ts
{
  _id: string;
  customerId: string;
  senderId: string;
  senderName: string;
  messages: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Summary Table

| Emit (client → server)    | Payload                                          | Response event(s)                        |
|---------------------------|--------------------------------------------------|------------------------------------------|
| `joinDocumentRoom`        | `{ customerId, userId, userName }`               | `roomJoined`, `messageHistory`           |
| `sendMessage`             | `{ customerId, message }`                        | `receiveMessage` (broadcast to room)     |
| `typing`                  | `{ customerId, isTyping }`                       | `userTyping` (to others in room)         |
| `markRead`                | `{ customerId, readerId }`                       | `messagesRead` (to others in room)       |
| `documentStatusUpdate`    | `{ customerId, documentId, status, updatedBy }`  | `documentStatusChanged` (room broadcast) |
| `newDocumentUploaded`     | `{ customerId, document }`                       | `documentUploaded` (to others in room)   |
| `leaveRoom`               | `{ customerId }`                                 | —                                        |

| Listen (server → client)  | Sent when                                        |
|---------------------------|--------------------------------------------------|
| `receiveMessage`          | Any member of the room sends a message           |
| `messageHistory`          | After joining a room                             |
| `roomJoined`              | After successfully joining a room                |
| `newCustomerRoom`         | Admin only — a new customer room was created     |
| `userTyping`              | Someone in the room emits `typing`               |
| `messagesRead`            | Someone in the room emits `markRead`             |
| `documentStatusChanged`   | Someone emits `documentStatusUpdate`             |
| `documentUploaded`        | Someone emits `newDocumentUploaded`              |
