import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Select, MenuItem, Pagination, List, ListItem, ListItemText, IconButton, Badge } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityInbox from './PriorityInbox';
import { getNotifications } from '../apiClient';
import { logEvent } from '../utils/logger';

export default function Dashboard() {
  const [notifs, setNotifs] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getNotifications(page, filter).then(data => {
      setNotifs(data);
      logEvent('STATE', 'notifications loaded', data.length);
    });
  }, [page, filter]);

  const markRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Student Portal</Typography>
      
      <PriorityInbox items={notifs} />

      <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Inbox</Typography>
          <Select size="small" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
          </Select>
        </Box>

        <List>
          {notifs.map(n => (
            <ListItem key={n.id} divider sx={{ opacity: n.isRead ? 0.5 : 1 }}>
              <ListItemText 
                primary={<Badge color="primary" variant="dot" invisible={n.isRead} sx={{ mr: 2 }}>{n.title}</Badge>}
                secondary={new Date(n.createdAt).toLocaleString()} 
              />
              {!n.isRead && (
                <IconButton onClick={() => markRead(n.id)} color="success">
                  <CheckCircleIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={5} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      </Box>
    </Container>
  );
}
