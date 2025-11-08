import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Assignment as TaskIcon,
  Comment as CommentIcon,
  Update as UpdateIcon,
  MarkEmailUnread as UnreadIcon,
  Done as ReadIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import {
  fetchNotifications,
  fetchUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../services/api';
import { useNavigate } from 'react-router-dom';

const getIcon = (type) => {
  switch (type) {
    case 'task':
      return <TaskIcon color="primary" />;
    case 'comment':
      return <CommentIcon color="secondary" />;
    case 'update':
      return <UpdateIcon color="info" />;
    case 'file_uploaded':
      return <UploadIcon color="success" />;
    default:
      return <NotificationsIcon />;
  }
};

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return then.toLocaleDateString();
};

const NotificationContainer = ({ open, onClose, onUnreadCountChange, notifications, setNotifications }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
    // eslint-disable-next-line
  }, [open]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : []);
      if (onUnreadCountChange) {
        const unread = (Array.isArray(data) ? data : []).filter(n => !n.isRead).length;
        onUnreadCountChange(unread);
      }
    } catch (error) {
      setNotifications([]);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    if (onUnreadCountChange) {
      const unread = notifications.filter(n => !n.isRead && n.id !== id).length;
      onUnreadCountChange(unread);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    if (onUnreadCountChange) onUnreadCountChange(0);
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter(n => n.id !== id));
    if (onUnreadCountChange) {
      const unread = notifications.filter(n => !n.isRead && n.id !== id).length;
      onUnreadCountChange(unread);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    const ticketId = notification.ticketId || notification.ticket_id;
    const taskId = notification.taskId || notification.task_id;
    if (notification.type === 'pending_user') {
      navigate('/app/users');
      onClose && onClose();
    } else if (ticketId) {
      navigate(`/app/tickets/${ticketId}`);
      onClose && onClose();
    } else if (taskId) {
      navigate(`/app/tasks/${taskId}`);
      onClose && onClose();
    }
  };

  const filteredNotifications =
    tab === 0
      ? notifications
      : tab === 1
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.isRead);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" component="div">Notifications</Typography>
        <Box>
          <Button size="small" onClick={handleMarkAllAsRead} disabled={notifications.every(n => n.isRead)}>
            Mark all as read
          </Button>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent 
        sx={{ 
          pt: 0, 
          maxHeight: '60vh', 
          overflowY: 'auto', 
          scrollbarWidth: 'none', 
          '&::-webkit-scrollbar': { display: 'none' } 
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label={`All (${notifications.length})`} />
          <Tab label={`Unread (${notifications.filter((n) => !n.isRead).length})`} />
          <Tab label={`Read (${notifications.filter((n) => n.isRead).length})`} />
        </Tabs>
        <Divider sx={{ mb: 2 }} />
        <List sx={{
          overflowY: 'auto',
          maxHeight: '45vh',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {loading ? (
            <ListItem>
              <ListItemText primary="Loading notifications..." />
            </ListItem>
          ) : filteredNotifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications." />
            </ListItem>
          ) : (
            filteredNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    py: 2,
                    backgroundColor: !notification.isRead
                      ? theme.palette.action.selected
                      : 'inherit',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    cursor: 'pointer',
                  }}
                  secondaryAction={
                    <Box>
                      {!notification.isRead && (
                        <Tooltip title="Mark as read">
                          <IconButton onClick={e => { e.stopPropagation(); handleMarkAsRead(notification.id); }}>
                            <UnreadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton onClick={e => { e.stopPropagation(); handleDelete(notification.id); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: !notification.isRead ? 600 : 400 }}
                        >
                          {notification.message}
                        </Typography>
                        <Chip
                          label={notification.isRead ? 'Read' : 'Unread'}
                          color={notification.isRead ? 'default' : 'primary'}
                          size="small"
                          icon={notification.isRead ? <ReadIcon fontSize="small" /> : <UnreadIcon fontSize="small" />}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {getTimeAgo(notification.createdAt)}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationContainer; 