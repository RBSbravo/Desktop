import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  ConfirmationNumber as TicketsIcon,
  Assignment as TasksIcon,
  Apartment as DepartmentsIcon
} from '@mui/icons-material';
import { api } from '../services/api';

const StatCard = ({ title, value, icon, trend, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                color={trend > 0 ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 500 }}
              >
                {Math.abs(trend)}% from last month
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {React.cloneElement(icon, { 
            sx: { color: `${color}.main`, fontSize: 24 } 
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboardStats();
    // Real-time updates
    const handleRealtime = () => { loadDashboardStats(); };
    window.addEventListener('user_update', handleRealtime);
    window.addEventListener('new_comment', handleRealtime);
    window.addEventListener('notification', handleRealtime);
    window.addEventListener('ticket_update', handleRealtime);
    window.addEventListener('task_update', handleRealtime);
    return () => {
      window.removeEventListener('user_update', handleRealtime);
      window.removeEventListener('new_comment', handleRealtime);
      window.removeEventListener('notification', handleRealtime);
      window.removeEventListener('ticket_update', handleRealtime);
      window.removeEventListener('task_update', handleRealtime);
    };
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getDashboardStats();
      // The API returns data directly, not wrapped in response.data
      const statsData = response.data || response;
      setStats(statsData);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={<PeopleIcon />}
            trend={stats.userGrowth || 0}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Tickets"
            value={stats.activeTickets || 0}
            icon={<TicketsIcon />}
            trend={stats.ticketGrowth || 0}
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks || 0}
            icon={<TasksIcon />}
            trend={stats.taskGrowth || 0}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Departments"
            value={stats.totalDepartments || 0}
            icon={<DepartmentsIcon />}
            trend={stats.departmentGrowth || 0}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Additional Stats */}
      {stats.recentActivity && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Grid container spacing={2}>
            {stats.recentActivity.map((activity, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {activity.type}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {activity.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={activity.status} 
                        size="small" 
                        color={activity.status === 'completed' ? 'success' : 'warning'}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DashboardStats; 