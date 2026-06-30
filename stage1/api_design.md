## Stage 1

### Core Notification API

Endpoints manage Placements, Events, and Results. Assume auth tokens inject `studentId` into context. Base path: `/api/v1`.

#### POST `/notifications`
Creates a notification payload.
**Request:**
```json
{
  "type": "Placement",
  "title": "Interview Set",
  "message": "Tech Corp interview at 10 AM."
}
```
**Response (201):**
```json
{
  "id": 101,
  "studentId": 1042,
  "type": "Placement",
  "title": "Interview Set",
  "message": "Tech Corp interview at 10 AM.",
  "isRead": false,
  "createdAt": "2026-06-30T10:00:00Z"
}
```

#### GET `/notifications`
Fetches paginated notifications.
**Query:** `?page=1&limit=20`
**Response (200):**
```json
{
  "data": [...],
  "meta": { "page": 1, "total": 45 }
}
```

#### GET `/notifications/unread`
Returns all unread notifications.

#### GET `/notifications/{id}`
Returns a single notification object.

#### PATCH `/notifications/{id}/read`
Marks specific ID as read.

#### PATCH `/notifications/read`
Marks all unread notifications for the user as read.

#### DELETE `/notifications/{id}`
Removes notification from the DB.

### Real-Time Strategy
- **SSE (Server-Sent Events)**: Selected over WebSockets. Notifications are unidirectional (server pushes to client). SSE uses standard HTTP without the overhead of full-duplex TCP connections, completely eliminating API polling load.
