import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Forward as ForwardIcon } from '@mui/icons-material';
import { getUsers, forwardTicket } from '../../services/api';

const ForwardTicketButton = ({ ticket, onForward, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadRecipients();
    }
  }, [open]);

  const loadRecipients = async () => {
    try {
      // Fetch all users first
      const allUsersRes = await getUsers();
      const allUsers = allUsersRes.data || allUsersRes || [];
      
      // Filter department heads from all users
      const deptHeads = allUsers.filter(user => 
        user.role === 'department_head' || 
        user.role === 'Department Head' || 
        user.role === 'department_head'
      );
      
      // Format the recipients - only department heads
      const allRecipients = deptHeads.map(user => ({
        ...user,
        displayName: `${user.firstname} ${user.lastname} (Dept Head)`
      }));
      
      // If no department heads found, show a message
      if (allRecipients.length === 0) {
        setError('No department heads found in the system');
      } else {
        setRecipients(allRecipients);
      }
    } catch (error) {
      console.error('Error loading recipients:', error);
      setError('Failed to load recipients');
    }
  };

  const handleForward = async () => {
    if (!selectedRecipient || !reason.trim()) {
      setError('Please select a recipient and provide a reason');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await forwardTicket(ticket.id, {
        toUserId: selectedRecipient,
        reason: reason.trim()
      });
      
      onForward && onForward();
      setOpen(false);
      setSelectedRecipient('');
      setReason('');
    } catch (error) {
      console.error('Error forwarding ticket:', error);
      setError(error.response?.data?.error || 'Failed to forward ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecipient('');
    setReason('');
    setError('');
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ForwardIcon />}
        onClick={() => setOpen(true)}
        disabled={disabled}
        sx={{ mr: 1 }}
      >
        Forward
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Forward Ticket #{ticket?.id}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Forwarding ticket to a department head
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Forward To</InputLabel>
            <Select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              label="Forward To"
              disabled={loading}
            >
              {recipients.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Reason for Forwarding"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleForward} 
            variant="contained"
            disabled={!selectedRecipient || !reason.trim() || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Forward Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForwardTicketButton; 