## Stage 4: High Load Mitigation

Database chokes during mass result announcements. 

1. **Read Replicas**
   - Route `GET` queries to read-only replica instances. Master handles `INSERT`/`UPDATE`.
   - *Trade-off*: Eventual consistency due to replication lag.

2. **Redis Caching**
   - Cache unread counts in Redis. UI fetches from RAM instead of hitting Postgres.
   - *Trade-off*: Hard cache invalidation logic; thundering herd risk when TTL expires.

3. **Event-Driven Push**
   - Use SSE so the UI never polls. Server publishes to Redis Pub/Sub, which pushes down to connected clients.
   - *Trade-off*: High connection management overhead on API servers.
