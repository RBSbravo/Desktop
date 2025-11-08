import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  useTheme,
  Paper,
  Stack,
  Avatar,
  LinearProgress,
  useMediaQuery,
  IconButton,
  Collapse
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  ConfirmationNumber as TicketIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { api } from '../../services/api';

const DepartmentSummary = ({ startDate, endDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [departments, setDepartments] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedDepartments, setCollapsedDepartments] = useState(new Set());

  useEffect(() => {
    loadDepartmentSummary();
  }, [startDate, endDate]);

  const toggleDepartmentCollapse = (departmentId) => {
    setCollapsedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  const loadDepartmentSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all departments
      const departmentsResponse = await api.getDepartments();
      const departmentsData = departmentsResponse.data || departmentsResponse;
      setDepartments(departmentsData);

      // Determine date range - use provided dates or default to last 30 days
      const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const defaultEndDate = new Date().toISOString().split('T')[0];
      
      const startDateToUse = startDate || defaultStartDate;
      const endDateToUse = endDate || defaultEndDate;

      // Load stats for each department
      const stats = {};
      for (const dept of departmentsData) {
                  try {
            // Get department analytics with date range
            const analyticsResponse = await api.getDepartmentAnalytics(dept.id, {
              startDate: startDateToUse,
              endDate: endDateToUse
            });
            
            const analyticsData = analyticsResponse.data || analyticsResponse;
            
            // Get detailed task and ticket data for this department
            let detailedTaskData = [];
            let detailedTicketData = [];
            let allTickets = []; // Declare allTickets at the top level
            
            try {
              // Fetch tasks for this department
              const tasksResponse = await api.getTasks();
              const allTasks = tasksResponse.data || tasksResponse;
              
              // Filter tasks by department and date range
              detailedTaskData = allTasks.filter(task => {
                // First check if task is within date range
                const taskDate = new Date(task.createdAt || task.created_at);
                const startDateObj = new Date(startDateToUse);
                const endDateObj = new Date(endDateToUse);
                
                const isWithinDateRange = taskDate >= startDateObj && taskDate <= endDateObj;
                if (!isWithinDateRange) return false;
                
                // Then check department criteria
                // Check various possible department fields
                const taskDepartmentId = task.departmentId || task.department_id;
                const taskDepartmentName = task.department || task.departmentName;
                const assignedToDepartmentId = task.assignedTo?.departmentId || task.assignedTo?.department_id;
                const createdByDepartmentId = task.createdBy?.departmentId || task.createdBy?.department_id;
                const assignedToDepartmentName = task.assignedTo?.department || task.assignedTo?.departmentName;
                const createdByDepartmentName = task.createdBy?.department || task.createdBy?.departmentName;
                
                // Match by department ID
                const matchesDepartmentId = taskDepartmentId === dept.id || 
                                          assignedToDepartmentId === dept.id || 
                                          createdByDepartmentId === dept.id;
                
                // Match by department name
                const matchesDepartmentName = taskDepartmentName === dept.name || 
                                           assignedToDepartmentName === dept.name || 
                                           createdByDepartmentName === dept.name;
                
                // Match by department ID string comparison (in case IDs are strings)
                const matchesDepartmentIdString = String(taskDepartmentId) === String(dept.id) || 
                                                String(assignedToDepartmentId) === String(dept.id) || 
                                                String(createdByDepartmentId) === String(dept.id);
                
                return matchesDepartmentId || matchesDepartmentName || matchesDepartmentIdString;
              });
            } catch (taskErr) {
              console.error(`Error loading tasks for department ${dept.id}:`, taskErr);
            }
            
            try {
              // Fetch tickets for this department
              const ticketsResponse = await api.getTickets();
              allTickets = ticketsResponse.data || ticketsResponse; // Assign to the top-level variable
              
              // Check if allTickets is an array
              if (!Array.isArray(allTickets)) {
                detailedTicketData = [];
                allTickets = []; // Reset to empty array if not valid
              }
              
              // Filter tickets by department and date range
              detailedTicketData = allTickets.filter(ticket => {
                // First check if ticket is within date range
                const ticketDate = new Date(ticket.createdAt || ticket.created_at);
                const startDateObj = new Date(startDateToUse);
                const endDateObj = new Date(endDateToUse);
                
                const isWithinDateRange = ticketDate >= startDateObj && ticketDate <= endDateObj;
                if (!isWithinDateRange) return false;
                
                // Then check department criteria
                const matchesDepartmentId = ticket.departmentId === dept.id;
                const matchesDepartmentName = ticket.department === dept.name;
                const matchesAssignedToDepartment = ticket.assignedTo?.departmentId === dept.id;
                const matchesCreatedByDepartment = ticket.createdBy?.departmentId === dept.id;
                const matchesDepartmentField = ticket.departmentId === dept.id || ticket.department === dept.name;
                
                return matchesDepartmentId || matchesDepartmentName || matchesAssignedToDepartment || matchesCreatedByDepartment || matchesDepartmentField;
              });
            } catch (ticketErr) {
              console.error(`Error loading tickets for department ${dept.id}:`, ticketErr);
              allTickets = []; // Reset to empty array on error
            }
            
            // Calculate detailed statistics
            const taskStats = {
              total: detailedTaskData.length,
              completed: detailedTaskData.filter(task => task.status === 'completed').length,
              pending: detailedTaskData.filter(task => task.status === 'pending').length,
              inProgress: detailedTaskData.filter(task => task.status === 'in progress').length,
              overdue: detailedTaskData.filter(task => {
                if (task.dueDate && task.status !== 'completed') {
                  return new Date(task.dueDate) < new Date();
                }
                return false;
              }).length
            };
            
            const ticketStats = {
              total: detailedTicketData.length,
              resolved: detailedTicketData.filter(ticket => ticket.status === 'completed').length,
              pending: detailedTicketData.filter(ticket => ticket.status === 'pending').length,
              inProgress: detailedTicketData.filter(ticket => ticket.status === 'in progress').length,
              declined: detailedTicketData.filter(ticket => ticket.status === 'declined').length
            };
            
            // Apply proper department filtering for tickets
            if (allTickets.length > 0) {
              // Filter tickets by department and date range using multiple criteria
              const departmentTickets = allTickets.filter(ticket => {
                // First check if ticket is within date range
                const ticketDate = new Date(ticket.createdAt || ticket.created_at);
                const startDateObj = new Date(startDateToUse);
                const endDateObj = new Date(endDateToUse);
                
                const isWithinDateRange = ticketDate >= startDateObj && ticketDate <= endDateObj;
                if (!isWithinDateRange) return false;
                // Check various possible department fields
                const ticketDepartmentId = ticket.departmentId || ticket.department_id;
                const ticketDepartmentName = ticket.department || ticket.departmentName;
                const assignedToDepartmentId = ticket.assignedTo?.departmentId || ticket.assignedTo?.department_id;
                const createdByDepartmentId = ticket.createdBy?.departmentId || ticket.createdBy?.department_id;
                const assignedToDepartmentName = ticket.assignedTo?.department || ticket.assignedTo?.departmentName;
                const createdByDepartmentName = ticket.createdBy?.department || ticket.createdBy?.departmentName;
                
                // Match by department ID
                const matchesDepartmentId = ticketDepartmentId === dept.id || 
                                          assignedToDepartmentId === dept.id || 
                                          createdByDepartmentId === dept.id;
                
                // Match by department name
                const matchesDepartmentName = ticketDepartmentName === dept.name || 
                                           assignedToDepartmentName === dept.name || 
                                           createdByDepartmentName === dept.name;
                
                // Match by department ID string comparison (in case IDs are strings)
                const matchesDepartmentIdString = String(ticketDepartmentId) === String(dept.id) || 
                                                String(assignedToDepartmentId) === String(dept.id) || 
                                                String(createdByDepartmentId) === String(dept.id);
                
                return matchesDepartmentId || matchesDepartmentName || matchesDepartmentIdString;
              });
              
              // Update detailed ticket data and stats
              detailedTicketData = departmentTickets;
              ticketStats.total = departmentTickets.length;
              ticketStats.resolved = departmentTickets.filter(ticket => ticket.status === 'completed').length;
              ticketStats.pending = departmentTickets.filter(ticket => ticket.status === 'pending').length;
              ticketStats.inProgress = departmentTickets.filter(ticket => ticket.status === 'in progress').length;
              ticketStats.declined = departmentTickets.filter(ticket => ticket.status === 'declined').length;
            }
            

          
          // Merge analytics data with detailed stats
          stats[dept.id] = {
            ...analyticsData,
            departmentStats: {
              ...analyticsData.departmentStats,
              // Override with detailed counts if available
              totalTasks: taskStats.total,
              completedTasks: taskStats.completed,
              pendingTasks: taskStats.pending,
              inProgressTasks: taskStats.inProgress,
              overdueTasks: taskStats.overdue,
              totalTickets: ticketStats.total,
              resolvedTickets: ticketStats.resolved,
              pendingTickets: ticketStats.pending,
              inProgressTickets: ticketStats.inProgress,
              declinedTickets: ticketStats.declined
            },
            detailedTaskData,
            detailedTicketData,
            taskStats,
            ticketStats
          };
        } catch (err) {
          console.error(`Error loading stats for department ${dept.id}:`, err);
          // Set default stats if API fails
          stats[dept.id] = {
            departmentStats: {
              totalEmployees: 0,
              activeEmployees: 0,
              totalTasks: 0,
              completedTasks: 0,
              pendingTasks: 0,
              inProgressTasks: 0,
              overdueTasks: 0,
              totalTickets: 0,
              resolvedTickets: 0,
              pendingTickets: 0,
              inProgressTickets: 0,
              declinedTickets: 0,
              departmentEfficiency: 0,
              averageTaskCompletionTime: 0
            },
            taskMetrics: [],
            ticketMetrics: [],
            userPerformance: [],
            detailedTaskData: [],
            detailedTicketData: [],
            taskStats: { total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0 },
            ticketStats: { total: 0, resolved: 0, pending: 0, inProgress: 0, declined: 0 }
          };
        }
      }
      
      setDepartmentStats(stats);
    } catch (err) {
      setError('Failed to load department summary');
      console.error('Error loading department summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return '0 days';
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'success';
    if (efficiency >= 60) return 'warning';
    return 'error';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'resolved':
        return 'success';
      case 'pending':
      case 'in progress':
        return 'warning';
      case 'overdue':
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        sx={{ 
          mb: { xs: 2, sm: 3 }, 
          fontWeight: 600, 
          color: theme.palette.text.primary,
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Department Summary Overview
      </Typography>
      
      {departments.map((dept, index) => {
        const stats = departmentStats[dept.id]?.departmentStats || {};
        const taskMetrics = departmentStats[dept.id]?.taskMetrics || [];
        const ticketMetrics = departmentStats[dept.id]?.ticketMetrics || [];
        const taskStats = departmentStats[dept.id]?.taskStats || {};
        const ticketStats = departmentStats[dept.id]?.ticketStats || {};
        
        return (
          <Paper key={dept.id} sx={{ 
            mb: { xs: 2, sm: 3 }, 
            borderRadius: { xs: 1, sm: 2 }, 
            overflow: 'hidden' 
          }}>
            {/* Department Header */}
            <Box sx={{ 
              p: { xs: 2, sm: 3 }, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}10)`,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary,
                    textAlign: isMobile ? 'center' : 'left'
                  }}
                >
                  {dept.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 1,
                    textAlign: isMobile ? 'center' : 'left'
                  }}
                >
                  Department ID: {dept.id}
                </Typography>
                {collapsedDepartments.has(dept.id) && (
                  <Box sx={{ 
                    mt: 1, 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}>
                    <Chip 
                      label={`${stats.totalEmployees || 0} Employees`} 
                      size="small" 
                      color="info" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                    <Chip 
                      label={`${stats.totalTasks || taskStats.total || 0} Tasks`} 
                      size="small" 
                      color="warning" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                    <Chip 
                      label={`${stats.totalTickets || ticketStats.total || 0} Tickets`} 
                      size="small" 
                      color="error" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </Box>
                )}
              </Box>
              <IconButton
                onClick={() => toggleDepartmentCollapse(dept.id)}
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light + '20'
                  }
                }}
              >
                {collapsedDepartments.has(dept.id) ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Box>

            {/* Department Content - Collapsible */}
            <Collapse in={!collapsedDepartments.has(dept.id)}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                {/* Employee Stats */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.info.main}10, ${theme.palette.info.light}05)`,
                    border: `1px solid ${theme.palette.info.main}20`,
                    minHeight: isMobile ? 160 : 180
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.info.main, 
                        mx: 'auto', 
                        mb: 1,
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 }
                      }}>
                        <PeopleIcon />
                      </Avatar>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        sx={{ 
                          fontWeight: 700, 
                          color: theme.palette.info.main,
                          fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                      >
                        {stats.totalEmployees || 0}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Total Employees
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      >
                        {stats.activeEmployees || 0} Active
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Task Stats */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}10, ${theme.palette.warning.light}05)`,
                    border: `1px solid ${theme.palette.warning.main}20`,
                    minHeight: isMobile ? 160 : 180
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.warning.main, 
                        mx: 'auto', 
                        mb: 1,
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 }
                      }}>
                        <AssignmentIcon />
                      </Avatar>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        sx={{ 
                          fontWeight: 700, 
                          color: theme.palette.warning.main,
                          fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                      >
                        {stats.totalTasks || taskStats.total || 0}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Total Tasks
                      </Typography>
                      <Box sx={{ 
                        mt: 1, 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5, 
                        justifyContent: 'center',
                        maxHeight: '60px',
                        overflow: 'hidden'
                      }}>
                        <Chip 
                          label={`${stats.completedTasks || taskStats.completed || 0} Completed`} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: 20, sm: 24 },
                            '& .MuiChip-label': { px: 0.5 }
                          }}
                        />
                        <Chip 
                          label={`${stats.pendingTasks || taskStats.pending || 0} Pending`} 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: 20, sm: 24 },
                            '& .MuiChip-label': { px: 0.5 }
                          }}
                        />
                        {taskStats.inProgress > 0 && (
                          <Chip 
                            label={`${taskStats.inProgress} In Progress`} 
                            size="small" 
                            color="info" 
                            variant="outlined"
                            sx={{ 
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 20, sm: 24 },
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        )}
                        {taskStats.overdue > 0 && (
                          <Chip 
                            label={`${taskStats.overdue} Overdue`} 
                            size="small" 
                            color="error" 
                            variant="outlined"
                            sx={{ 
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 20, sm: 24 },
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Ticket Stats */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.error.main}10, ${theme.palette.error.light}05)`,
                    border: `1px solid ${theme.palette.error.main}20`,
                    minHeight: isMobile ? 160 : 180
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.error.main, 
                        mx: 'auto', 
                        mb: 1,
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 }
                      }}>
                        <TicketIcon />
                      </Avatar>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        sx={{ 
                          fontWeight: 700, 
                          color: theme.palette.error.main,
                          fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                      >
                        {stats.totalTickets || ticketStats.total || 0}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Total Tickets
                      </Typography>
                      <Box sx={{ 
                        mt: 1, 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5, 
                        justifyContent: 'center',
                        maxHeight: '60px',
                        overflow: 'hidden'
                      }}>
                        <Chip 
                          label={`${stats.resolvedTickets || ticketStats.resolved || 0} Resolved`} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: 20, sm: 24 },
                            '& .MuiChip-label': { px: 0.5 }
                          }}
                        />
                        <Chip 
                          label={`${stats.pendingTickets || ticketStats.pending || 0} Pending`} 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: 20, sm: 24 },
                            '& .MuiChip-label': { px: 0.5 }
                          }}
                        />
                        {ticketStats.inProgress > 0 && (
                          <Chip 
                            label={`${ticketStats.inProgress} In Progress`} 
                            size="small" 
                            color="info" 
                            variant="outlined"
                            sx={{ 
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 20, sm: 24 },
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        )}
                        {ticketStats.declined > 0 && (
                          <Chip 
                            label={`${ticketStats.declined} Declined`} 
                            size="small" 
                            color="error" 
                            variant="outlined"
                            sx={{ 
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 20, sm: 24 },
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Efficiency Stats */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.success.main}10, ${theme.palette.success.light}05)`,
                    border: `1px solid ${theme.palette.success.main}20`,
                    minHeight: isMobile ? 160 : 180
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.success.main, 
                        mx: 'auto', 
                        mb: 1,
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 }
                      }}>
                        <SpeedIcon />
                      </Avatar>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        sx={{ 
                          fontWeight: 700, 
                          color: theme.palette.success.main,
                          fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                      >
                        {stats.departmentEfficiency?.toFixed(1) || 0}%
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Efficiency Rate
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={stats.departmentEfficiency || 0} 
                        color={getEfficiencyColor(stats.departmentEfficiency)}
                        sx={{ 
                          mt: 1, 
                          height: { xs: 4, sm: 6 }, 
                          borderRadius: { xs: 2, sm: 3 } 
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Additional Metrics */}
              <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    fontWeight: 600,
                    textAlign: isMobile ? 'center' : 'left'
                  }}
                >
                  Performance Metrics
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      bgcolor: 'background.paper', 
                      borderRadius: 1, 
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: isMobile ? 'center' : 'left'
                    }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Average Task Completion Time
                      </Typography>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        sx={{ 
                          fontWeight: 600, 
                          mt: 1,
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        {formatDuration(stats.averageTaskCompletionTime)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      bgcolor: 'background.paper', 
                      borderRadius: 1, 
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: isMobile ? 'center' : 'left'
                    }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Task Completion Rate
                      </Typography>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        sx={{ 
                          fontWeight: 600, 
                          mt: 1,
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        {stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      bgcolor: 'background.paper', 
                      borderRadius: 1, 
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: isMobile ? 'center' : 'left'
                    }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Ticket Resolution Rate
                      </Typography>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        sx={{ 
                          fontWeight: 600, 
                          mt: 1,
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        {stats.totalTickets > 0 ? ((stats.resolvedTickets / stats.totalTickets) * 100).toFixed(1) : 0}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Detailed Numerical Breakdown */}
              <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    fontWeight: 600,
                    textAlign: isMobile ? 'center' : 'left'
                  }}
                >
                  Detailed Numerical Breakdown
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {/* Task Breakdown */}
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      border: `1px solid ${theme.palette.warning.main}20`,
                      background: `linear-gradient(135deg, ${theme.palette.warning.main}05, ${theme.palette.warning.light}02)`
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.warning.main,
                          mb: 1,
                          textAlign: isMobile ? 'center' : 'left'
                        }}
                      >
                        Task Statistics
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              Total Tasks
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                              {stats.totalTasks || taskStats.total || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              Completed
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                              {stats.completedTasks || taskStats.completed || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              Pending
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                              {stats.pendingTasks || taskStats.pending || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              In Progress
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                              {taskStats.inProgress || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        {taskStats.overdue > 0 && (
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                              <Typography variant="caption" color="text.secondary">
                                Overdue
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                                {taskStats.overdue}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Ticket Breakdown */}
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      border: `1px solid ${theme.palette.error.main}20`,
                      background: `linear-gradient(135deg, ${theme.palette.error.main}05, ${theme.palette.error.light}02)`
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.error.main,
                          mb: 1,
                          textAlign: isMobile ? 'center' : 'left'
                        }}
                      >
                        Ticket Statistics
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              Total Tickets
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                              {stats.totalTickets || ticketStats.total || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              Resolved
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                              {stats.resolvedTickets || ticketStats.resolved || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              Pending
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                              {stats.pendingTickets || ticketStats.pending || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                            <Typography variant="caption" color="text.secondary">
                              In Progress
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                              {ticketStats.inProgress || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        {ticketStats.declined > 0 && (
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                              <Typography variant="caption" color="text.secondary">
                                Declined
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                                {ticketStats.declined}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              </CardContent>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
};

export default DepartmentSummary; 