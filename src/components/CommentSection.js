import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { fetchComments, addComment, deleteComment } from '../services/api';
import { formatDateTime } from '../utils/ticketUtils';

/**
 * CommentSection Component for Desktop App
 * Props:
 * - entityId: string (ticketId)
 * - user: current user object
 * - users: array of all users for name resolution
 */
const CommentSection = ({ entityId, user, users = [] }) => {
  const theme = useTheme();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadComments = async () => {
    if (!entityId) return;
    
    setLoading(true);
    try {
      const data = await fetchComments(entityId);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [entityId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !entityId) return;
    
    setSubmitting(true);
    setErrorMsg('');
    
    try {
      await addComment(entityId, { content: comment.trim() });
      setComment('');
      loadComments(); // Reload comments to show the new one
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMsg(error.message || 'Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (commentId) => {
    setDeleteId(commentId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId || !entityId) return;
    
    try {
      await deleteComment(entityId, deleteId);
      setConfirmOpen(false);
      setDeleteId(null);
      loadComments(); // Reload comments
    } catch (error) {
      console.error('Error deleting comment:', error);
      setErrorMsg(error.message || 'Failed to delete comment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return formatDateTime(dateString);
  };

  const getAuthorName = (comment) => {
    // Helper function to get user name by ID
    const getUserName = (userId) => {
      if (!userId) return 'Unknown User';
      const user = users.find(u => u.id === userId);
      if (user) {
        return `${user.firstname} ${user.lastname}`.trim() || user.email || user.username || userId;
      }
      return userId;
    };

    // Try to get author name from various possible fields
    const authorId = comment.author_id || comment.authorId || comment.user_id || comment.userId;
    
    if (authorId) {
      return getUserName(authorId);
    }
    
    if (comment.author) {
      if (typeof comment.author === 'object') {
        return `${comment.author.firstname || comment.author.firstName || ''} ${comment.author.lastname || comment.author.lastName || ''}`.trim() || 
               comment.author.username || 
               comment.author.email || 
               'Unknown User';
      }
      return comment.author;
    }
    
    return comment.author_name || comment.user_name || 'Unknown User';
  };

  const isOwnComment = (comment) => {
    if (!user) return false;
    return comment.author_id === user.id || 
           comment.authorId === user.id || 
           (comment.author && comment.author.id === user.id);
  };

  const canDeleteComment = (comment) => {
    if (!user) return false;
    
    // Don't allow deletion of remarks-comments (update type comments)
    if (comment.comment_type === 'update' || 
        (comment.content && comment.content.startsWith('📝 **Task Updated**'))) {
      return false;
    }
    
    // Only allow users to delete their own regular comments
    return comment.author_id === user.id || 
           comment.authorId === user.id || 
           (comment.author && comment.author.id === user.id);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
        Comments ({comments.length})
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List dense sx={{ 
          maxHeight: 300, 
          overflowY: 'auto', 
          mb: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '&::-webkit-scrollbar-track': {
            display: 'none'
          },
          '&::-webkit-scrollbar-thumb': {
            display: 'none'
          },
        }}>
          {comments.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No comments yet. Be the first to add a comment!
              </Typography>
            </Box>
          ) : (
            comments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    px: 2, 
                    py: 1.5,
                    bgcolor: isOwnComment(comment) ? 'primary.light' + '10' : 'transparent',
                    border: isOwnComment(comment) ? `1px solid ${theme.palette.primary.light}` : 'none',
                    borderRadius: isOwnComment(comment) ? 1 : 0,
                    '&:hover': {
                      bgcolor: isOwnComment(comment) ? 'primary.light' + '15' : 'action.hover',
                    }
                  }}
                  secondaryAction={
                    canDeleteComment(comment) && (
                      <IconButton 
                        edge="end" 
                        aria-label="delete comment"
                        onClick={() => handleDelete(comment.id)}
                        size="small"
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: theme.palette.error.light + '20',
                            color: theme.palette.error.dark,
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem'
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: theme.palette.text.primary
                          }} 
                          component="span"
                        >
                          {getAuthorName(comment)}
                          {isOwnComment(comment) && (
                            <Typography 
                              component="span" 
                              sx={{ 
                                ml: 1, 
                                fontSize: '0.75rem', 
                                color: 'primary.main',
                                fontWeight: 500,
                                bgcolor: 'primary.light' + '20',
                                px: 0.5,
                                py: 0.1,
                                borderRadius: 0.5
                              }}
                            >
                              You
                            </Typography>
                          )}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          component="span"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {formatDate(comment.created_at || comment.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        component="span"
                        sx={{ 
                          lineHeight: 1.5,
                          fontSize: '0.875rem'
                        }}
                      >
                        {comment.comment_type === 'update' ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Ticket Updated
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Remarks:
                            </Typography>
                            <Box
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: '#f5f5f5',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                borderLeft: `3px solid #e0e0e0`,
                                display: 'inline-block',
                                width: '100%'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'normal', mb: 0.5, color: theme.palette.text.secondary }}>
                                Remarks:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                                {comment.content.split('\n').slice(2).join('\n').replace('Remarks:\n', '')}
                              </Typography>
                            </Box>
                          </Box>
                        ) : comment.comment_type === 'forward' ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Ticket Forwarded
                            </Typography>
                            <Box
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: '#f5f5f5',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                borderLeft: `3px solid #e0e0e0`,
                                display: 'inline-block',
                                width: '100%'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'normal', mb: 0.5, color: theme.palette.text.secondary }}>
                                <strong>To:</strong> {comment.content.split('\n')[2]?.replace('To: ', '')}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'normal', mb: 0.5, color: theme.palette.text.secondary }}>
                                <strong>Reason:</strong>
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                                {comment.content.split('\n')[3]?.replace('Reason: ', '')}
                              </Typography>
                            </Box>
                          </Box>
                        ) : comment.comment_type === 'response' ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Forward Response
                            </Typography>
                            <Box
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: '#f5f5f5',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                borderLeft: `3px solid #e0e0e0`,
                                display: 'inline-block',
                                width: '100%'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'normal', mb: 0.5, color: theme.palette.text.secondary }}>
                                <strong>Action:</strong> {comment.content.split('\n')[2]?.replace('Action: ', '')}
                              </Typography>
                              {comment.content.split('\n')[3] && (
                                <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                                  {comment.content.split('\n')[3]}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        ) : (
                          comment.content
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < comments.length - 1 && (
                  <Divider variant="inset" component="li" sx={{ mx: 2 }} />
                )}
              </React.Fragment>
            ))
          )}
        </List>
      )}
      
      <Box component="form" onSubmit={handleAddComment} sx={{ 
        display: 'flex', 
        gap: 1, 
        mt: 2,
        alignItems: 'flex-end'
      }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
          multiline
          rows={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={submitting || !comment.trim()}
          startIcon={<SendIcon />}
          sx={{ 
            minWidth: 80,
            borderRadius: 2,
            px: 2,
            py: 1.5
          }}
        >
          Post
        </Button>
      </Box>
      
      {errorMsg && (
        <Typography 
          color="error" 
          variant="body2" 
          sx={{ 
            mt: 1, 
            p: 1, 
            bgcolor: 'error.light' + '10',
            borderRadius: 1,
            border: `1px solid ${theme.palette.error.light}`
          }}
        >
          {errorMsg}
        </Typography>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          color: 'error.main', 
          fontWeight: 700 
        }}>
          <DeleteIcon color="error" sx={{ fontSize: 24 }} />
          Delete Comment
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '1rem' }}>
            Are you sure you want to delete this comment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Button 
            onClick={() => setConfirmOpen(false)}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={confirmDelete}
            sx={{ minWidth: 100 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentSection; 