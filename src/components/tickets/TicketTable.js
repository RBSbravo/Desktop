import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  ConfirmationNumber as TicketIcon,
  PriorityHigh as PriorityHighIcon,
  Remove as PriorityMediumIcon,
  LowPriority as PriorityLowIcon,
} from '@mui/icons-material';
import { getTicketMaturityColor, getTicketMaturityText, formatDate } from '../../utils/ticketUtils';

// Helper component: Only show tooltip if text is truncated
function TruncateTooltip({ title, children, ...props }) {
  const textRef = useRef(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [children, title]);

  if (truncated) {
    return (
      <Tooltip title={title} arrow {...props}>
        <span ref={textRef} style={{ display: 'block', width: '100%' }}>{children}</span>
      </Tooltip>
    );
  }
  return <span ref={textRef} style={{ display: 'block', width: '100%' }}>{children}</span>;
}

const TicketTable = ({ 
  tickets, 
  departments, 
  activeTab, 
  onViewTicket, 
  onEditTicket, 
  onDeleteTicket,
  getStatusColor,
  getStatusIcon,
  getPriorityColor,
  getPriorityIcon,
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

  if (isMobile) {
    return null; // Mobile uses cards instead
  }

  return (
    <TableContainer component={Paper} sx={{ 
      borderRadius: 3, 
      boxShadow: 3, 
      overflowX: 'auto', 
      width: '100%', 
      maxWidth: '100vw', 
      bgcolor: 'background.paper',
      '&::-webkit-scrollbar': {
        display: { xs: 'none', md: 'block' },
      },
      '&::-webkit-scrollbar-track': {
        display: { xs: 'none', md: 'block' },
      },
      '&::-webkit-scrollbar-thumb': {
        display: { xs: 'none', md: 'block' },
      },
      scrollbarWidth: { xs: 'none', md: 'auto' },
      msOverflowStyle: { xs: 'none', md: 'auto' },
    }}>
      <Table size="medium" sx={{ minWidth: { md: 0, lg: 900 }, width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <TableCell padding="checkbox" sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, width: { md: 36, lg: 48 } }}>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, width: { md: 56, lg: 80 } }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, maxWidth: { md: 120, lg: 220 }, minWidth: 80 }}>Title</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, width: { md: 60, lg: 120 }, maxWidth: { md: 80, lg: 160 } }}>Priority</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, width: { md: 60, lg: 120 }, maxWidth: { md: 80, lg: 160 } }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, maxWidth: { md: 80, lg: 160 } }}>
              {activeTab === 0 ? 'Send To' : activeTab === 1 ? 'Sent By' : 'Forwarded To'}
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, maxWidth: { md: 80, lg: 160 } }}>Due Date</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, minWidth: { md: 60, lg: 80 } }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket, idx) => (
            <TableRow key={ticket.id} hover sx={{ bgcolor: idx % 2 === 0 ? 'background.default' : 'background.paper', transition: 'background 0.2s', '&:hover': { bgcolor: 'action.hover' } }}>
              <TableCell padding="checkbox" sx={{ px: { md: 0.5, lg: 2 }, width: { md: 36, lg: 48 } }} />
              <TableCell sx={{ px: { md: 0.5, lg: 2 }, width: { md: 56, lg: 80 } }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: { md: 22, lg: 32 }, height: { md: 22, lg: 32 }, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  {getStatusIcon(ticket.status)}
                </Avatar>
              </TableCell>
              <TableCell sx={{ maxWidth: { md: 120, lg: 220 }, minWidth: 80, px: { md: 0.5, lg: 2 } }}>
                <TruncateTooltip title={ticket.title}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, wordBreak: 'break-word', maxWidth: { md: 110, lg: 200 }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ticket.title}
                  </Typography>
                </TruncateTooltip>
                <TruncateTooltip title={ticket.description}>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: { md: '0.8rem', lg: '0.92rem' }, lineHeight: 1.4, wordBreak: 'break-word', maxWidth: { md: 110, lg: 200 }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ticket.description}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell align="center" sx={{ px: { md: 0.5, lg: 2 }, width: { md: 60, lg: 120 }, maxWidth: { md: 80, lg: 160 } }}>
                <Tooltip title={`Priority: ${ticket.priority}`} arrow>
                  <span>
                    <Chip
                      label={ticket.priority}
                      size="small"
                      color={getPriorityColor(ticket.priority)}
                      icon={getPriorityIcon(ticket.priority)}
                      sx={{ fontSize: { md: '0.65rem', lg: '0.78rem' }, fontWeight: 600, borderRadius: 2, px: 1, height: { md: 16, lg: 22 }, boxShadow: 1, minWidth: { lg: 70 }, justifyContent: 'center' }}
                    />
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell align="center" sx={{ px: { md: 0.5, lg: 2 }, width: { md: 60, lg: 120 }, maxWidth: { md: 80, lg: 160 } }}>
                <Tooltip title={`Status: ${ticket.status.replace('_', ' ')}`} arrow>
                  <span>
                    <Chip
                      label={ticket.status.replace('_', ' ')}
                      size="small"
                      color={getStatusColor(ticket.status)}
                      sx={{ fontSize: { md: '0.65rem', lg: '0.78rem' }, fontWeight: 600, borderRadius: 2, px: 1, height: { md: 16, lg: 22 }, boxShadow: 1, minWidth: { lg: 90 }, justifyContent: 'center' }}
                    />
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ maxWidth: { md: 80, lg: 160 }, px: { md: 0.5, lg: 2 } }}>
                <TruncateTooltip title={activeTab === 0
                  ? (ticket.assignee
                      ? (typeof ticket.assignee === 'object'
                          ? `${ticket.assignee.firstname} ${ticket.assignee.lastname}`
                          : ticket.assignee)
                      : ticket.assigned_to
                        ? (() => {
                            const departmentHead = departments.find(dept => dept.head?.id === ticket.assigned_to);
                            return departmentHead?.head ? `${departmentHead.head.firstname} ${departmentHead.head.lastname}` : 'Unassigned';
                          })()
                        : 'Unassigned')
                  : activeTab === 1
                    ? getUserName(ticket.created_by)
                    : (ticket.forwarded_to_id ? `Forwarded to ${getUserName(ticket.forwarded_to_id)}` : 'Unknown')
                }>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeTab === 0 ? (
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
                </TruncateTooltip>
              </TableCell>
              <TableCell sx={{ maxWidth: { md: 80, lg: 160 }, px: { md: 0.5, lg: 2 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {ticket.due_date && (
                    <Tooltip title={formatDate(ticket.due_date)} arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: { md: 13, lg: 16 } }} color="action" />
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { md: '0.7rem', lg: '0.78rem' }, maxWidth: { md: 60, lg: 70 } }}>
                          {formatDate(ticket.due_date)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                  {(() => {
                    const maturityColor = getTicketMaturityColor(ticket);
                    const maturityText = getTicketMaturityText(ticket);
                    
                    if (!maturityColor || !maturityText) {
                      return null;
                    }
                    
                    return (
                      <Tooltip title={`Maturity: ${maturityText}`} arrow>
                        <span>
                          <Chip
                            label={maturityText}
                            size="small"
                            color={maturityColor}
                            sx={{ 
                              fontSize: { md: '0.6rem', lg: '0.7rem' }, 
                              fontWeight: 600, 
                              borderRadius: 2, 
                              px: 0.5, 
                              height: { md: 14, lg: 18 }, 
                              boxShadow: 1, 
                              minWidth: { lg: 60 }, 
                              justifyContent: 'center' 
                            }}
                          />
                        </span>
                      </Tooltip>
                    );
                  })()}
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ minWidth: { md: 60, lg: 80 }, px: { md: 0.5, lg: 2 } }}>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketTable; 