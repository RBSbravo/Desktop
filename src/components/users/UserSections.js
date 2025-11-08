import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Tabs,
  Tab,
  Badge,
  useTheme,
  useMediaQuery,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import UserCard from './UserCard';
import {
  getDisplayRole,
  getRoleColor,
  getStatusColor,
  getUserDepartment,
  getUserInitials
} from '../../utils/userUtils';

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

// Search Bar Component
export const UserSearchBar = ({ searchTerm, onSearchChange, isMobile = false }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <TextField
        fullWidth
        placeholder={isMobile ? "Search users..." : "Search users by name, email, or department..."}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
        }}
        sx={{ 
          '& .MuiOutlinedInput-root': { 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          } 
        }}
      />
    </Box>
  );
};

// Main Tabs Component
export const UserTabs = ({ tab, onTabChange, pendingUsersCount, isMobile = false }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ 
      mb: { xs: 2, sm: 3 }, 
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <Tabs 
        value={tab} 
        onChange={onTabChange} 
        indicatorColor="primary" 
        textColor="primary" 
        variant="fullWidth"
        sx={{ 
          '& .MuiTab-root': { 
            fontWeight: 600, 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            minHeight: { xs: 48, sm: 56 },
            padding: { xs: '8px 4px', sm: '12px 16px' }
          } 
        }}
      >
        <Tab 
          label={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <SupervisorAccountIcon fontSize={isMobile ? "small" : "medium"} />
              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {isMobile ? 'Active' : 'Active Users'}
              </Typography>
            </Box>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={pendingUsersCount} color="error">
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 1 },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <PersonIcon fontSize={isMobile ? "small" : "medium"} />
                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {isMobile ? 'Pending' : 'Pending Users'}
                </Typography>
              </Box>
            </Badge>
          } 
        />
      </Tabs>
    </Paper>
  );
};

// Sub-tabs for Active Users
export const ActiveUserSubTabs = ({ activeTab, onTabChange, departmentHeadsCount, employeesCount, isMobile = false }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ 
      mb: { xs: 2, sm: 3 }, 
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <Tabs 
        value={activeTab} 
        onChange={onTabChange} 
        indicatorColor="primary" 
        textColor="primary"
        variant="fullWidth"
        sx={{ 
          '& .MuiTab-root': { 
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minHeight: { xs: 40, sm: 48 },
            padding: { xs: '6px 4px', sm: '8px 12px' }
          } 
        }}
      >
        <Tab 
          label={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <SupervisorAccountIcon fontSize={isMobile ? "small" : "medium"} />
              <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                {isMobile ? `Heads (${departmentHeadsCount})` : `Department Heads (${departmentHeadsCount})`}
              </Typography>
            </Box>
          } 
        />
        <Tab 
          label={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <GroupIcon fontSize={isMobile ? "small" : "medium"} />
              <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                {isMobile ? `Employees (${employeesCount})` : `Employees (${employeesCount})`}
              </Typography>
            </Box>
          } 
        />
      </Tabs>
    </Paper>
  );
};

// Empty State Component
export const EmptyState = ({ icon: Icon, title, subtitle, theme, isMobile = false }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: { xs: 200, sm: 300 }, 
    width: '100%',
    p: { xs: 2, sm: 4 }
  }}>
    <Icon sx={{ 
      fontSize: { xs: 60, sm: 80 }, 
      color: theme.palette.action.disabled, 
      mb: { xs: 1, sm: 2 } 
    }} />
    <Typography 
      variant="h6" 
      color="text.secondary" 
      sx={{ 
        mb: 1,
        fontSize: { xs: '1rem', sm: '1.25rem' },
        textAlign: 'center'
      }}
    >
      {title}
    </Typography>
    <Typography 
      variant="body2" 
      color="text.secondary"
      sx={{ 
        textAlign: 'center',
        fontSize: { xs: '0.875rem', sm: '1rem' }
      }}
    >
      {subtitle}
    </Typography>
  </Box>
);

// User Table Component
export const UserTable = ({ users, onEdit, onDelete, onView, isAdmin, actionLoading, isMobile = false }) => {
  const theme = useTheme();

  if (isMobile) {
    // Mobile card layout for small screens
  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {users.map((user, index) => (
          <Paper
            key={user.id}
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: theme.palette.primary.main,
                  mr: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {getUserInitials(user)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {`${user.firstname || ''} ${user.lastname || ''}`.trim() || '-'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user.email || '-'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label={getDisplayRole(user.role)}
                size="small"
                color={getRoleColor(user.role)}
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  height: 24
                }}
              />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {getUserDepartment(user)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              justifyContent: 'flex-end',
            }}>
              <Tooltip title="View Details">
                <IconButton
                  onClick={() => onView(user)}
                  size="small"
                  sx={{ color: theme.palette.primary.main }}
                >
                  <PersonIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isAdmin && (
                <>
                  <Tooltip title="Edit User">
                    <IconButton
                      onClick={() => onEdit(user)}
                      disabled={actionLoading}
                      size="small"
                      sx={{ color: theme.palette.info.main }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton
                      onClick={() => onDelete(user.id)}
                      disabled={actionLoading}
                      size="small"
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  // Desktop table layout
  return (
    <TableContainer component={Paper} sx={{ 
      borderRadius: 3, 
      boxShadow: 3, 
      overflowX: 'auto', 
      width: '100%', 
      bgcolor: theme.palette.background.paper,
      '&::-webkit-scrollbar': {
        height: 8,
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.action.hover,
        borderRadius: 4,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.action.disabled,
        borderRadius: 4,
        '&:hover': {
          backgroundColor: theme.palette.action.active,
        },
      },
    }}>
      <Table size="medium" sx={{ width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 2, 
            bgcolor: theme.palette.background.paper, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
          }}>
            <TableCell align="center" sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              maxWidth: 120, 
              minWidth: 60 
            }}>
              Name
            </TableCell>
            <TableCell align="center" sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              maxWidth: 120, 
              minWidth: 60 
            }}>
              Email
            </TableCell>
            <TableCell align="center" sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              width: 80, 
              minWidth: 70, 
              maxWidth: 100, 
              pr: 2 
            }}>
              Role
            </TableCell>
            <TableCell align="center" sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              minWidth: 160, 
              maxWidth: 320 
            }}>
              Department
            </TableCell>
            <TableCell align="center" sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              minWidth: 120, 
              maxWidth: 180, 
              pr: { md: 2, lg: 3 }, 
              whiteSpace: 'nowrap' 
            }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow 
              key={user.id} 
              hover 
              sx={{ 
                bgcolor: idx % 2 === 0 ? theme.palette.background.default : theme.palette.background.paper, 
                transition: 'background 0.2s', 
                '&:hover': { 
                  bgcolor: theme.palette.action.hover 
                } 
              }}
            >
              <TableCell align="center" sx={{ 
                textAlign: 'center', 
                maxWidth: 120, 
                minWidth: 60, 
                px: { md: 0.5, lg: 2 } 
              }}>
                <TruncateTooltip title={`${user.firstname || ''} ${user.lastname || ''}`.trim() || '-'}>
                  <Typography 
                    variant="subtitle1" 
                    noWrap 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: { md: '0.92rem', lg: '1rem' }, 
                      wordBreak: 'break-word', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      textAlign: 'center' 
                    }}
                  >
                    {`${user.firstname || ''} ${user.lastname || ''}`.trim() || '-'}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell align="center" sx={{ 
                textAlign: 'center', 
                maxWidth: 120, 
                minWidth: 60, 
                px: { md: 0.5, lg: 2 } 
              }}>
                <TruncateTooltip title={user.email || '-'}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    noWrap 
                    sx={{ 
                      fontSize: { md: '0.8rem', lg: '0.92rem' }, 
                      lineHeight: 1.4, 
                      wordBreak: 'break-word', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      textAlign: 'center' 
                    }}
                  >
                    {user.email || '-'}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell align="center" sx={{ 
                textAlign: 'center', 
                width: 80, 
                minWidth: 70, 
                maxWidth: 100, 
                pr: 2 
              }}>
                <Tooltip title={getDisplayRole(user.role)} arrow>
                  <Chip
                    label={getDisplayRole(user.role)}
                    size="small"
                    color={getRoleColor(user.role)}
                    sx={{ 
                      fontSize: { md: '0.65rem', lg: '0.78rem' }, 
                      fontWeight: 600, 
                      borderRadius: 2, 
                      px: 1, 
                      height: { md: 16, lg: 22 }, 
                      boxShadow: 1, 
                      minWidth: 50, 
                      justifyContent: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center'
                    }}
                  />
                </Tooltip>
              </TableCell>
              <TableCell align="center" sx={{ 
                textAlign: 'center', 
                maxWidth: 320, 
                minWidth: 160, 
                px: { md: 0.5, lg: 2 } 
              }}>
                <TruncateTooltip title={getUserDepartment(user)}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    noWrap 
                    sx={{ 
                      fontSize: '0.78rem', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap', 
                      textAlign: 'center' 
                    }}
                  >
                    {getUserDepartment(user)}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell align="center" sx={{ 
                textAlign: 'center', 
                minWidth: 120, 
                maxWidth: 180, 
                px: { md: 0.5, lg: 2 }, 
                pr: { md: 2, lg: 3 }, 
                whiteSpace: 'nowrap' 
              }}>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Tooltip title="View Details">
                    <span>
                      <IconButton
                        onClick={() => onView(user)}
                        size="small"
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: 'transparent',
                          '&:hover': {
                            bgcolor: theme.palette.primary.light,
                          },
                          p: 0.5
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  {isAdmin && (
                    <>
                      <Tooltip title="Edit User">
                        <span>
                          <IconButton
                            onClick={() => onEdit(user)}
                            disabled={actionLoading}
                            size="small"
                            sx={{
                              color: theme.palette.info.main,
                              bgcolor: 'transparent',
                              '&:hover': {
                                bgcolor: theme.palette.info.light,
                              },
                              '&:disabled': {
                                color: theme.palette.action.disabled,
                                bgcolor: 'transparent',
                              },
                              p: 0.5
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <span>
                          <IconButton
                            onClick={() => onDelete(user.id)}
                            disabled={actionLoading}
                            size="small"
                            sx={{
                              color: theme.palette.error.main,
                              bgcolor: 'transparent',
                              '&:hover': {
                                bgcolor: theme.palette.error.light,
                              },
                              '&:disabled': {
                                color: theme.palette.action.disabled,
                                bgcolor: 'transparent',
                              },
                              p: 0.5
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Active Users Section
export const ActiveUsersSection = ({ 
  searchTerm, 
  onSearchChange, 
  activeTab, 
  onActiveTabChange, 
  departmentHeads, 
  employees, 
  onEdit, 
  onDelete, 
  onView, 
  isAdmin, 
  actionLoading,
  isMobile = false
}) => {
  const theme = useTheme();

  return (
    <>
      <UserSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
        isMobile={isMobile}
      />
      
      <ActiveUserSubTabs 
        activeTab={activeTab}
        onTabChange={onActiveTabChange}
        departmentHeadsCount={departmentHeads.length}
        employeesCount={employees.length}
        isMobile={isMobile}
      />

      {/* Department Heads */}
      {activeTab === 0 && (
        departmentHeads.length === 0 ? (
          <EmptyState 
            icon={SupervisorAccountIcon}
            title="No department heads found."
            subtitle={searchTerm ? 'Try adjusting your search criteria.' : 'No department heads have been added yet.'}
            theme={theme}
            isMobile={isMobile}
          />
        ) : (
          <UserTable
            users={departmentHeads}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            isAdmin={isAdmin}
            actionLoading={actionLoading}
            isMobile={isMobile}
          />
        )
      )}

      {/* Employees */}
      {activeTab === 1 && (
        employees.length === 0 ? (
          <EmptyState 
            icon={GroupIcon}
            title="No employees found."
            subtitle={searchTerm ? 'Try adjusting your search criteria.' : 'No employees have been added yet.'}
            theme={theme}
            isMobile={isMobile}
          />
        ) : (
          <UserTable
            users={employees}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            isAdmin={isAdmin}
            actionLoading={actionLoading}
            isMobile={isMobile}
          />
        )
      )}
    </>
  );
};

// Pending Users Table Component
export const PendingUsersTable = ({ 
  pendingUsers, 
  onApprove, 
  onReject, 
  actionLoading,
  isMobile: isMobileProp = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [userToReject, setUserToReject] = useState(null);

  const handleRejectClick = (userId) => {
    const user = pendingUsers.find(u => u.id === userId);
    setUserToReject(user);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (userToReject) {
      onReject(userToReject.id);
      setRejectDialogOpen(false);
      setUserToReject(null);
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setUserToReject(null);
  };

  if (pendingUsers.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: { xs: 150, sm: 200 }, 
        width: '100%',
        p: { xs: 2, sm: 4 }
      }}>
        <PersonIcon sx={{ 
          fontSize: { xs: 48, sm: 64 }, 
          color: theme.palette.action.disabled 
        }} />
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            mt: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textAlign: 'center'
          }}
        >
          No pending users found.
        </Typography>
      </Box>
    );
  }

  // Mobile card layout for pending users (small screens only)
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pendingUsers.map((user, index) => (
          <Paper
            key={user.id}
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: theme.palette.primary.main,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                  mr: 2
                }}
              >
                {getUserInitials(user)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {`${user.firstname || ''} ${user.lastname || ''}`.trim() || '-'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user.email || '-'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  bgcolor: theme.palette[getRoleColor(user.role)].main,
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {getDisplayRole(user.role)}
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {getUserDepartment(user)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              gap: 1.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Box
                component="button"
                onClick={() => onApprove(user.id)}
                disabled={actionLoading}
                sx={{ 
                  flex: 1,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.75,
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: theme.palette.success.dark,
                  },
                  '&:disabled': {
                    bgcolor: theme.palette.action.disabled,
                    cursor: 'not-allowed'
                  }
                }}
              >
                Approve
              </Box>
              <Box
                component="button"
                onClick={() => handleRejectClick(user.id)}
                disabled={actionLoading}
                sx={{ 
                  flex: 1,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.75,
                  bgcolor: 'transparent',
                  color: theme.palette.error.main,
                  border: `1px solid ${theme.palette.error.main}`,
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: theme.palette.error.main,
                    color: 'white',
                  },
                  '&:disabled': {
                    borderColor: theme.palette.action.disabled,
                    color: theme.palette.action.disabled,
                    cursor: 'not-allowed'
                  }
                }}
              >
                Reject
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  // Desktop table layout - only on md and up
  return (
    <>
    <TableContainer component={Paper} sx={{ 
      borderRadius: 3, 
      boxShadow: 3, 
      overflowX: 'unset', 
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
      <Table size="medium" sx={{ width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <TableCell align="center" sx={{ textAlign: 'center', fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, maxWidth: 120, minWidth: 60 }}>Name</TableCell>
            <TableCell align="center" sx={{ textAlign: 'center', fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, maxWidth: 120, minWidth: 60 }}>Email</TableCell>
            <TableCell align="center" sx={{ textAlign: 'center', fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, width: 80, minWidth: 70, maxWidth: 100, pr: 2 }}>Role</TableCell>
            <TableCell align="center" sx={{ textAlign: 'center', fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, minWidth: 160, maxWidth: 320 }}>Department</TableCell>
            <TableCell align="center" sx={{ textAlign: 'center', fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, borderBottom: '2px solid', borderColor: 'divider', px: { md: 0.5, lg: 2 }, minWidth: 120, maxWidth: 180, pr: { md: 2, lg: 3 }, whiteSpace: 'nowrap' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingUsers.map((user, idx) => (
            <TableRow key={user.id} hover sx={{ bgcolor: idx % 2 === 0 ? 'background.default' : 'background.paper', transition: 'background 0.2s', '&:hover': { bgcolor: 'action.hover' } }}>
              <TableCell align="center" sx={{ textAlign: 'center', maxWidth: 120, minWidth: 60, px: { md: 0.5, lg: 2 } }}>
                <TruncateTooltip title={`${user.firstname || ''} ${user.lastname || ''}`.trim() || '-'}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, fontSize: { md: '0.92rem', lg: '1rem' }, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                    {`${user.firstname || ''} ${user.lastname || ''}`.trim() || '-'}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell align="center" sx={{ textAlign: 'center', maxWidth: 120, minWidth: 60, px: { md: 0.5, lg: 2 } }}>
                <TruncateTooltip title={user.email || '-'}>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: { md: '0.8rem', lg: '0.92rem' }, lineHeight: 1.4, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                    {user.email || '-'}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell align="center" sx={{ textAlign: 'center', width: 80, minWidth: 70, maxWidth: 100, pr: 2 }}>
                <Tooltip title={getDisplayRole(user.role)} arrow>
                  <Chip
                    label={getDisplayRole(user.role)}
                    size="small"
                    color={getRoleColor(user.role)}
                    sx={{ 
                      fontSize: { md: '0.65rem', lg: '0.78rem' }, 
                      fontWeight: 600, 
                      borderRadius: 2, 
                      px: 1, 
                      height: { md: 16, lg: 22 }, 
                      boxShadow: 1, 
                      minWidth: 50, 
                      justifyContent: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center'
                    }}
                  />
                </Tooltip>
              </TableCell>
              <TableCell align="center" sx={{ textAlign: 'center', maxWidth: 320, minWidth: 160, px: { md: 0.5, lg: 2 } }}>
                <TruncateTooltip title={getUserDepartment(user)}>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {getUserDepartment(user)}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell align="center" sx={{ textAlign: 'center', minWidth: 120, maxWidth: 180, px: { md: 0.5, lg: 2 }, pr: { md: 2, lg: 3 }, whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'nowrap',
                    justifyContent: 'center',
                    bgcolor: 'transparent',
                    borderRadius: 1.5,
                    px: 0.5,
                    py: 0.5,
                    boxShadow: 'none',
                  }}>
                    <Tooltip title="Approve User">
                      <span>
                        <IconButton
                          onClick={() => onApprove(user.id)}
                          disabled={actionLoading}
                          size="small"
                          sx={{
                            color: theme.palette.success.main,
                            bgcolor: 'transparent',
                            '&:hover': {
                              bgcolor: theme.palette.success.light,
                            },
                            '&:disabled': {
                              color: theme.palette.action.disabled,
                              bgcolor: 'transparent',
                            },
                            p: 0.5
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Reject User">
                      <span>
                        <IconButton
                          onClick={() => handleRejectClick(user.id)}
                          disabled={actionLoading}
                          size="small"
                          sx={{
                            color: theme.palette.error.main,
                            bgcolor: 'transparent',
                            '&:hover': {
                              bgcolor: theme.palette.error.light,
                            },
                            '&:disabled': {
                              color: theme.palette.action.disabled,
                              bgcolor: 'transparent',
                            },
                            p: 0.5,
                            ml: 0.5
                          }}
                        >
                          <CloseIcon fontSize="small" />
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

    {/* Reject Confirmation Dialog */}
    <Dialog
      open={rejectDialogOpen}
      onClose={handleRejectCancel}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
    >
      <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>
        Reject User Account
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to reject this user account?
        </Typography>
        {userToReject && (
          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 1, 
            border: '1px solid',
            borderColor: 'grey.300'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              User Details:
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {userToReject.firstname} {userToReject.lastname}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {userToReject.email}
            </Typography>
            <Typography variant="body2">
              <strong>Role:</strong> {getDisplayRole(userToReject.role)}
            </Typography>
            <Typography variant="body2">
              <strong>Department:</strong> {getUserDepartment(userToReject)}
            </Typography>
          </Box>
        )}
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ⚠️ Warning: Rejecting this user will permanently delete their account and all associated data.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleRejectCancel}
          disabled={actionLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleRejectConfirm}
          variant="contained"
          color="error"
          disabled={actionLoading}
        >
          {actionLoading ? 'Deleting...' : 'Reject & Delete Account'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}; 