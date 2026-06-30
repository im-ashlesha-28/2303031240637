import React, { useMemo } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import { extractTopPriority } from '../utils/sorter';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function PriorityInbox({ items }) {
  const priorityItems = useMemo(() => extractTopPriority(items.filter(n => !n.isRead)), [items]);

  if (!priorityItems.length) return null;

  return (
    <Card sx={{ mb: 3, borderLeft: '5px solid #d32f2f' }}>
      <CardContent>
        <Typography variant="h6" color="error" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <WarningAmberIcon sx={{ mr: 1 }} /> Action Required
        </Typography>
        <List disablePadding>
          {priorityItems.map(n => (
            <ListItem key={n.id} sx={{ bgcolor: '#f9f9f9', mb: 1, borderRadius: 1 }}>
              <ListItemText primary={n.title} secondary={new Date(n.createdAt).toLocaleDateString()} />
              <Chip label={n.type} size="small" color={n.type === 'Placement' ? 'primary' : 'default'} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
