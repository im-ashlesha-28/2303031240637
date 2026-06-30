-- Query Analysis
-- Sequential scan on 5 million rows is O(N) and thrashes disk I/O.
-- A B-Tree index changes this to O(log N). Since 95% of notifications are read, a partial index is optimal.

CREATE INDEX idx_unread_only ON notifications (studentID, createdAt ASC) WHERE isRead = false;

-- Placement notifs in last 7 days:
SELECT u.email FROM users u
JOIN notifications n ON u.id = n.student_id
WHERE n.type = 'Placement' AND n.created_at >= CURRENT_DATE - INTERVAL '7 days';
