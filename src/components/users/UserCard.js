import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import {
  getUserDisplayName,
  getDisplayRole,
  getRoleColor,
  getStatusColor,
  getUserDepartment,
  getUserInitials
} from '../../utils/userUtils';

const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  onView, 
  isAdmin = false, 
  actionLoading = false,
  isMobile = false
}) => {
  const theme = useTheme();

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(user);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(user.id);
  };

  const handleView = () => {
    onView?.(user);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        cursor: 'pointer'
      }}
      onClick={handleView}
    >
      <CardContent sx={{ 
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: { xs: 1.5, sm: 2 } 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: 1,
            minWidth: 0
          }}>
            <Avatar 
              sx={{ 
                mr: { xs: 1.5, sm: 2 }, 
                bgcolor: theme.palette.primary.main,
                width: { xs: 48, sm: 60 },
                height: { xs: 48, sm: 60 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600
              }}
            >
              {getUserInitials(user)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '0.875rem', sm: '1.25rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {getUserDisplayName(user)}
              </Typography>
              <Typography 
                color="textSecondary" 
                variant="body2" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <EmailIcon fontSize={isMobile ? "small" : "small"} />
                {user.email}
              </Typography>
            </Box>
          </Box>
          {isAdmin && (
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <Tooltip title="Edit">
                <IconButton
                  size={isMobile ? "small" : "small"}
                  onClick={handleEdit}
                  disabled={actionLoading}
                  sx={{ 
                    color: theme.palette.primary.main,
                    p: { xs: 0.5, sm: 0.75 }
                  }}
                >
                  <EditIcon fontSize={isMobile ? "small" : "small"} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size={isMobile ? "small" : "small"}
                  color="error"
                  onClick={handleDelete}
                  disabled={actionLoading}
                  sx={{ p: { xs: 0.5, sm: 0.75 } }}
                >
                  <DeleteIcon fontSize={isMobile ? "small" : "small"} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        
        <Box sx={{ 
          mb: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 0.5, sm: 1 }
        }}>
          <Chip
            label={getDisplayRole(user.role)}
            color={getRoleColor(user.role)}
            size={isMobile ? "small" : "small"}
            sx={{ 
              mr: { xs: 0, sm: 1 }, 
              mb: { xs: 0.5, sm: 1 }, 
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 20, sm: 24 }
            }}
          />
          <Chip
            label={user.status || 'Active'}
            color={getStatusColor(user.status || 'Active')}
            size={isMobile ? "small" : "small"}
            sx={{ 
              mr: { xs: 0, sm: 1 }, 
              mb: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 20, sm: 24 }
            }}
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 1.5, sm: 2 },
          flex: 1
        }}>
          <BusinessIcon 
            fontSize={isMobile ? "small" : "small"} 
            sx={{ 
              mr: 1, 
              color: theme.palette.text.secondary,
              flexShrink: 0
            }} 
          />
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {getUserDepartment(user)}
          </Typography>
        </Box>
        
        {user.description && (
          <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ 
              mb: { xs: 1.5, sm: 2 }, 
              fontStyle: 'italic',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4
            }}
          >
            "{user.description}"
          </Typography>
        )}
        
        <Box 
          sx={{ 
            mt: 'auto',
            pt: { xs: 1.5, sm: 2 },
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ 
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            View Details
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard; 