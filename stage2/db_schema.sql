-- Database Selection: PostgreSQL
-- Relational integrity is mandatory for linking notifications to users. Postgres JSONB supports flexible payloads, and declarative partitioning scales perfectly for time-series data.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE notifications (
    id BIGSERIAL,
    student_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) PARTITION BY RANGE (created_at);

-- Partition by month to prevent table bloat
CREATE TABLE notifs_2026_07 PARTITION OF notifications FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- Base index
CREATE INDEX idx_student_date ON notifications (student_id, created_at DESC);
-- Partial index for fast unread queries
CREATE INDEX idx_unread ON notifications (student_id, created_at DESC) WHERE is_read = FALSE;

-- Scaling Fixes
-- Disk Bloat: Monthly partitions allow DROP TABLE for old data instead of heavy DELETE sweeps.
-- Vacuum Overhead: High update volume (marking as read) creates dead tuples. Tune autovacuum_vacuum_scale_factor down to keep sweeps frequent and lightweight.
-- Connection Spikes: Deploy PgBouncer to multiplex API connections.
