import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { getTicketMaturityColor, getTicketMaturityText, formatDate } from '../../utils/ticketUtils';

const TicketCard = ({ 
  ticket, 
  departments, 
  activeTab, 
  onViewTicket, 
  onEditTicket, 
  onDeleteTicket,
  getPriorityColor,
  getPriorityIcon,
  getStatusColor,
  getTicketFiles,
  users = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to get user name by ID
  const getUserName = (userId) => {
    if (!userId) return 'Unknown';
    const user = users.find(u => u.id === userId);
    if (user) {
      return `${user.firstname} ${user.lastname}`.trim() || user.email || user.username || userId;
    }
    return userId;
  };

  if (!isMobile) {
    return null; // Desktop uses table instead
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}>
              {ticket.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              {ticket.description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={ticket.priority}
            size="small"
            color={getPriorityColor(ticket.priority)}
            icon={getPriorityIcon(ticket.priority)}
            sx={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: 2 }}
          />
          <Chip
            label={ticket.status.replace('_', ' ')}
            size="small"
            color={getStatusColor(ticket.status)}
            sx={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: 2 }}
          />
          {(() => {
            const maturityColor = getTicketMaturityColor(ticket);
            const maturityText = getTicketMaturityText(ticket);
            
            if (!maturityColor || !maturityText) {
              return null;
            }
            
            return (
              <Chip
                label={maturityText}
                size="small"
                color={maturityColor}
                sx={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: 2 }}
              />
            );
          })()}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>{activeTab === 0 ? 'Send To' : activeTab === 1 ? 'Sent By' : 'Forwarded To'}:</strong> {activeTab === 0 ? (
              ticket.assignee ? (
                typeof ticket.assignee === 'object' 
                  ? `${ticket.assignee.firstname} ${ticket.assignee.lastname}`
                  : ticket.assignee
              ) : ticket.assigned_to ? (
                (() => {
                  const departmentHead = departments.find(dept => dept.head?.id === ticket.assigned_to);
                  return departmentHead?.head ? `${departmentHead.head.firstname} ${departmentHead.head.lastname}` : 'Unassigned';
                })()
              ) : 'Unassigned'
            ) : activeTab === 1 ? (
              getUserName(ticket.created_by)
            ) : (
              ticket.forwarded_to_id ? `Forwarded to ${getUserName(ticket.forwarded_to_id)}` : 'Unknown'
            )}
          </Typography>
          {ticket.due_date && (
            <Typography variant="body2" color="text.secondary">
              <strong>Due Date:</strong> {formatDate(ticket.due_date)}
            </Typography>
          )}
        </Box>

        {getTicketFiles(ticket.id).length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AttachFileIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {getTicketFiles(ticket.id).length} file(s) attached
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2, flexWrap: 'wrap', justifyContent: 'flex-end', bgcolor: 'action.selected', borderRadius: 2, px: 1, py: 0.5, boxShadow: 1 }}>
            <Tooltip title="View Details">
              <span>
                <IconButton 
                  color="primary" 
                  size="small" 
                  onClick={() => onViewTicket(ticket)}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit Ticket">
              <span>
                <IconButton 
                  color="secondary" 
                  size="small" 
                  onClick={() => onEditTicket(ticket)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete Ticket">
              <span>
                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={() => onDeleteTicket(ticket)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard; 