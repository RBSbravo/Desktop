import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  TableChart as TableChartIcon,
  GridOn as GridOnIcon,
  PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';
import { getStatusColor, getTypeColor, getTypeIcon, getTypeLabel } from '../../utils/reportUtils';

const ReportCard = ({ 
  report, 
  isAdmin, 
  onView, 
  onDelete, 
  onDownload 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getReportTypeColor = (type) => {
    return getTypeColor(type);
  };

  const getReportTypeIcon = (type) => {
    return getTypeIcon(type);
  };

  const getReportTypeLabel = (type) => {
    return getTypeLabel(type);
  };

  const getReportTarget = (report) => {
    if (report.type === 'user') {
      // Try to get user name from parameters first
      if (report.parameters?.userName) {
        return report.parameters.userName;
      }
      // Fallback: try to extract from report title or description
      if (report.title && report.title.includes('User Report -')) {
        const match = report.title.match(/User Report - (.+?) -/);
        if (match) {
          return match[1];
        }
      }
      if (report.description && report.description.includes('Generated user report for')) {
        const match = report.description.match(/Generated user report for (.+)/);
        if (match) {
          return match[1];
        }
      }
      return 'User Report';
    }
    if (report.type === 'department') {
      // Try to get department name from parameters first
      if (report.parameters?.departmentName) {
        return report.parameters.departmentName;
      }
      // Fallback: try to extract from report title or description
      if (report.title && report.title.includes('Department Report -')) {
        const match = report.title.match(/Department Report - (.+?) -/);
        if (match) {
          return match[1];
        }
      }
      if (report.description && report.description.includes('Generated department report for')) {
        const match = report.description.match(/Generated department report for (.+)/);
        if (match) {
          return match[1];
        }
      }
      return 'Department Report';
    }
    if (report.type === 'task') {
      return report.parameters?.global ? 'All Departments' : 'Filtered';
    }
    if (report.type === 'ticket') {
      return report.parameters?.global ? 'All Departments' : 'Filtered';
    }
    if (report.type === 'custom') {
      return 'Custom Scope';
    }
    return 'N/A';
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
      onClick={() => onView(report)}
    >
      <CardContent sx={{ 
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
                bgcolor: theme.palette[getReportTypeColor(report.type)]?.main || theme.palette.primary.main,
                width: { xs: 48, sm: 60 },
                height: { xs: 48, sm: 60 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600
              }}
            >
              {getReportTypeIcon(report.type)}
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
                  whiteSpace: 'nowrap',
                  color: theme.palette.primary.main
                }}
              >
                {report.title}
              </Typography>
            </Box>
          </Box>
          {isAdmin && (
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <Tooltip title="Delete">
                <IconButton
                  size={isMobile ? "small" : "small"}
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(report.id);
                  }}
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
            label={getReportTypeLabel(report.type)}
            color={getReportTypeColor(report.type)}
            size={isMobile ? "small" : "small"}
            icon={getReportTypeIcon(report.type)}
            sx={{ 
              mr: { xs: 0, sm: 1 }, 
              mb: { xs: 0.5, sm: 1 }, 
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 20, sm: 24 }
            }}
          />
          <Chip
            label={report.status}
            color={getStatusColor(report.status)}
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
            {getReportTarget(report)}
          </Typography>
        </Box>
        
        {report.description && (
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
            "{report.description}"
          </Typography>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 1.5, sm: 2 }
        }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {report.generatedBy}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
            {new Date(report.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportCard; 