import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  LinearProgress,
  Stack,
  Collapse
} from '@mui/material';
import {
  Assignment as TaskIcon,
  ConfirmationNumber as TicketIcon,
  People as UserIcon,
  Apartment as DepartmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Warning as OverdueIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [collapsedDepartments, setCollapsedDepartments] = useState(new Set());

  useEffect(() => {
    loadDashboardData();

    // Real-time ticket updates
    const handleTicketUpdate = (e) => {
      const updatedTicket = e.detail;
      setRecentTickets((prev) => {
        const exists = prev.some(t => t.id === updatedTicket.id);
        if (exists) {
          return prev.map(t => t.id === updatedTicket.id ? updatedTicket : t);
        } else {
          return [updatedTicket, ...prev].slice(0, 5);
        }
      });
    };
    window.addEventListener('ticket_update', handleTicketUpdate);

    // Real-time task updates
    const handleTaskUpdate = (e) => {
      const updatedTask = e.detail;
      setRecentTasks((prev) => {
        const exists = prev.some(t => t.id === updatedTask.id);
        if (exists) {
          return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
        } else {
          return [updatedTask, ...prev].slice(0, 5);
        }
      });
    };
    window.addEventListener('task_update', handleTaskUpdate);

    // Real-time user, comment, and notification updates
    const handleUserUpdate = () => { loadDashboardData(); };
    const handleCommentUpdate = () => { loadDashboardData(); };
    const handleNotification = () => { loadDashboardData(); };
    window.addEventListener('user_update', handleUserUpdate);
    window.addEventListener('new_comment', handleCommentUpdate);
    window.addEventListener('notification', handleNotification);

    return () => {
      window.removeEventListener('ticket_update', handleTicketUpdate);
      window.removeEventListener('task_update', handleTaskUpdate);
      window.removeEventListener('user_update', handleUserUpdate);
      window.removeEventListener('new_comment', handleCommentUpdate);
      window.removeEventListener('notification', handleNotification);
    };
  }, []);

    const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dashboard stats
      const statsResponse = await api.getDashboardStats();
      const statsData = statsResponse.data || statsResponse;
      
      // Load recent tasks and tickets
      const [tasksResponse, ticketsResponse] = await Promise.all([
        api.getTasks({ limit: 5 }),
        api.getTickets({ limit: 5 })
      ]);
      
      const tasks = tasksResponse.tasks || tasksResponse || [];
      const tickets = ticketsResponse.tickets || ticketsResponse || [];
      
      setDashboardData(statsData);
      setRecentTasks(tasks);
      setRecentTickets(tickets);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
        setLoading(false);
    }
    };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const toggleDepartmentCollapse = (departmentName) => {
    setCollapsedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentName)) {
        newSet.delete(departmentName);
      } else {
        newSet.add(departmentName);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'closed':
        return 'success';
      case 'in progress':
      case 'open':
        return 'warning';
      case 'pending':
        return 'info';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'closed':
        return <CompletedIcon fontSize="small" />;
      case 'in progress':
      case 'open':
        return <PendingIcon fontSize="small" />;
      case 'overdue':
        return <OverdueIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateCompletionRate = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <LoadingSpinner 
        message="Loading dashboard data..." 
        size="large"
      />
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Filter out the logged-in user (admin) from team performance
  const filteredTeamPerformance = (dashboardData?.teamPerformance || []).filter(
    member => member.userId !== user.id
  );

  // Group team members by department
  const groupedByDepartment = {};
  filteredTeamPerformance.forEach(member => {
    const dept = member.departmentName || 'Other';
    if (!groupedByDepartment[dept]) groupedByDepartment[dept] = [];
    groupedByDepartment[dept].push(member);
  });

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <PageHeader
        title="Welcome back"
        subtitle="Here's what's happening in your system today"
        emoji="👋"
        color="primary"
        onRefresh={handleRefresh}
      />

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Total Tickets
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {dashboardData?.totalTickets || 0}
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrendingUpIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                        {dashboardData?.openTickets || 0} open
                      </Typography>
                    </Box>
                    {user.role === 'admin' && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                          {dashboardData?.completedTickets || 0} completed
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'primary.light',
                    borderRadius: '16px',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 60,
                    height: 60
                  }}
                >
                  <TicketIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Total Tasks
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {dashboardData?.totalTasks || 0}
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrendingUpIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                        {(dashboardData?.totalTasks || 0) - (dashboardData?.completedTasks || 0)} pending
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        {dashboardData?.completedTasks || 0} completed
                      </Typography>
                    </Box>
                    {user.role === 'admin' && (dashboardData?.overdueTasks || 0) > 0 && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUpIcon sx={{ color: 'error.main', fontSize: 16 }} />
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                          {dashboardData?.overdueTasks || 0} overdue
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'success.light',
                    borderRadius: '16px',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 60,
                    height: 60
                  }}
                >
                  <TaskIcon sx={{ color: 'success.main', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {dashboardData?.activeUsers || 0}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      Active Users
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'secondary.light',
                    borderRadius: '16px',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 60,
                    height: 60
                  }}
                >
                  <UserIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Departments
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {dashboardData?.departments || 0}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      All active
      </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'info.light',
                    borderRadius: '16px',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 60,
                    height: 60
                  }}
                >
                  <DepartmentIcon sx={{ color: 'info.main', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Admin-specific detailed breakdown */}
      {user.role === 'admin' && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TicketIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ticket Status Breakdown
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                        {dashboardData?.pendingTickets || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Pending
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.dark' }}>
                        {dashboardData?.inProgressTickets || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        In Progress
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                        {dashboardData?.completedTickets || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'error.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.dark' }}>
                        {dashboardData?.declinedTickets || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Declined
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TaskIcon sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Task Status Breakdown
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                        {(dashboardData?.totalTasks || 0) - (dashboardData?.completedTasks || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Pending
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                        {dashboardData?.completedTasks || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Completed
                      </Typography>
                    </Box>
                  </Grid>
                  {(dashboardData?.overdueTasks || 0) > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'error.light', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.dark' }}>
                          {dashboardData?.overdueTasks || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Overdue
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Progress and Status Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SpeedIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  System Performance
                </Typography>
              </Box>
              
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Task Completion Rate
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {calculateCompletionRate(dashboardData?.completedTasks || 0, dashboardData?.totalTasks || 0)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateCompletionRate(dashboardData?.completedTasks || 0, dashboardData?.totalTasks || 0)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  {user.role === 'admin' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {dashboardData?.completedTasks || 0} completed, {(dashboardData?.totalTasks || 0) - (dashboardData?.completedTasks || 0)} pending out of {dashboardData?.totalTasks || 0} total
                      {(dashboardData?.overdueTasks || 0) > 0 && ` (${dashboardData?.overdueTasks || 0} overdue)`}
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Ticket Resolution Rate
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {calculateCompletionRate(dashboardData?.closedTickets || 0, dashboardData?.totalTickets || 0)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateCompletionRate(dashboardData?.closedTickets || 0, dashboardData?.totalTickets || 0)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  {user.role === 'admin' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {dashboardData?.completedTickets || 0} completed, {dashboardData?.declinedTickets || 0} declined out of {dashboardData?.totalTickets || 0} total
                    </Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AssessmentIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/app/tickets')}
                    sx={{ 
                      py: 1.5,
                      borderWidth: 2,
                      fontWeight: 600,
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Create Ticket
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/app/reports')}
                    sx={{ 
                      py: 1.5,
                      borderWidth: 2,
                      fontWeight: 600,
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Create Report
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => navigate('/app/analytics')}
                    sx={{ 
                      py: 1.5,
                      borderWidth: 2,
                      fontWeight: 600,
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    View Analytics
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => navigate('/app/users')}
                    sx={{ 
                      py: 1.5,
                      borderWidth: 2,
                      fontWeight: 600,
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Manage Users
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Performance */}
      {filteredTeamPerformance.length > 0 && (
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TimelineIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Team Performance Overview
              </Typography>
            </Box>
            {/* Group by department */}
            {Object.entries(groupedByDepartment).map(([dept, members]) => {
              const isCollapsed = collapsedDepartments.has(dept);
              // Calculate summary metrics for collapsed view
              const totalMembers = members.length;
              const totalTasksCompleted = members.reduce((sum, m) => sum + (m.tasksCompleted || 0), 0);
              const totalTasksAssigned = members.reduce((sum, m) => sum + (m.tasksAssigned || 0), 0);
              const totalTicketsClosed = members.reduce((sum, m) => sum + (m.ticketsClosed || 0), 0);
              const totalTicketsAssigned = members.reduce((sum, m) => sum + (m.ticketsAssigned || 0), 0);

              return (
                <Box key={dept} sx={{ mb: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {dept}
                      </Typography>
                      {isCollapsed && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={`${totalMembers} Members`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                          <Chip 
                            label={`${totalTasksCompleted}/${totalTasksAssigned} Tasks`} 
                            size="small" 
                            color="success" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                          <Chip 
                            label={`${totalTicketsClosed}/${totalTicketsAssigned} Tickets`} 
                            size="small" 
                            color="info" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        </Box>
                      )}
                    </Box>
                    <IconButton
                      onClick={() => toggleDepartmentCollapse(dept)}
                      sx={{
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.light + '20'
                        }
                      }}
                    >
                      {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={!isCollapsed}>
                    <Grid container spacing={3}>
                  {members.map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={member.userId || index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {member.name}
                      </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1) : ''}
                            {member.departmentName ? ` | ${member.departmentName}` : ''}
                          </Typography>
                      <Stack spacing={2}>
                        {/* Role-based display logic */}
                        {member.role === 'employee' && (
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Tasks Completed
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {member.tasksCompleted}/{member.tasksAssigned}
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={calculateCompletionRate(member.tasksCompleted, member.tasksAssigned)}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        )}
                        
                        {member.role === 'department_head' && (
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Tickets Managed
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {member.ticketsClosed}/{member.ticketsAssigned}
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={calculateCompletionRate(member.ticketsClosed, member.ticketsAssigned)}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        )}
                        
                        {/* Show both for admin view or mixed roles */}
                        {member.role === 'admin' && (
                          <>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Tasks Completed
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {member.tasksCompleted}/{member.tasksAssigned}
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={calculateCompletionRate(member.tasksCompleted, member.tasksAssigned)}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Tickets Closed
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {member.ticketsClosed}/{member.ticketsAssigned}
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={calculateCompletionRate(member.ticketsClosed, member.ticketsAssigned)}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
          </Grid>
                    ))}
                    </Grid>
                  </Collapse>
                </Box>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Tickets and Tasks by Department */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Tickets and Tasks by Department
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={Object.entries(groupedByDepartment).map(([dept, members]) => {
                  // Calculate role-based metrics
                  const departmentHeads = members.filter(m => m.role === 'department_head');
                  const employees = members.filter(m => m.role === 'employee');
                  
                  return {
                    department: dept,
                    tickets: departmentHeads.reduce((sum, m) => sum + (m.ticketsAssigned || 0), 0),
                    tasks: employees.reduce((sum, m) => sum + (m.tasksAssigned || 0), 0),
                    // Add total for reference
                    total: members.reduce((sum, m) => sum + (m.tasksAssigned || 0) + (m.ticketsAssigned || 0), 0)
                  };
                })}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === 'tickets') return [value, 'Tickets Managed (Dept Heads)'];
                      if (name === 'tasks') return [value, 'Tasks Assigned (Employees)'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Department: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="tickets" fill={theme.palette.info.main} name="Tickets Managed" />
                  <Bar dataKey="tasks" fill={theme.palette.success.main} name="Tasks Handled" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 