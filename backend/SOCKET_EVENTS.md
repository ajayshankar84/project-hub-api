# Socket.IO Event Reference — `/chat` namespace

## Connection

- **Namespace:** default (`/`) — connects at `io('http://localhost:3000')`
- **Also works with:** `io('http://localhost:3000/chat')` if you migrate the frontend later
- **Room format:** `doc-room-{customerId}`
- **Auth token:** pass as `socket.handshake.auth.token` or `Authorization: Bearer <token>` header *(optional for now, enforced once frontend wires it in)*

---

## Client → Server Events

| Event | Payload |
|---|---|
| `joinDocumentRoom` | `{ customerId, userId, userName }` |
| `sendMessage` | `{ customerId, message }` |
| `typing` | `{ customerId, isTyping }` |
| `markRead` | `{ customerId, readerId }` |
| `leaveRoom` | `{ customerId }` |
| `documentStatusUpdate` | `{ customerId, documentId, status, updatedBy }` |
| `adminJoinAllRooms` | `{ adminId }` |
| `newDocumentUploaded` | `{ customerId, document }` |

---

## Server → Client Events

| Event | Payload | Sent to |
|---|---|---|
| `messageHistory` | `ChatMessage[]` | Joining socket only |
| `roomJoined` | `{ customerId }` | Joining socket only |
| `receiveMessage` | `ChatMessage` (full object with `_id`) | Entire room |
| `userTyping` | `{ senderId, senderName, isTyping }` | Room (excluding sender) |
| `messagesRead` | `{ customerId, readerId, readAt }` | Room (excluding sender) |
| `documentStatusChanged` | `{ documentId, status, updatedBy, updatedAt }` | Entire room |
| `documentUploaded` | document payload | Room (excluding sender) |
| `connect_error` | `Error` | Socket only (on bad token) |

---

## Notes

- `receiveMessage` fires on **both** socket `sendMessage` and HTTP `POST /message` — no need to handle them separately on the client.
- `adminJoinAllRooms` subscribes the admin socket to every active customer room derived from the messages collection.
- `documentStatusUpdate` broadcasts to the **entire** room (including sender) so both admin and client see the status change.
