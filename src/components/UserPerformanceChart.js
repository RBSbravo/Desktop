import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { api } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const UserPerformanceChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [performanceData, setPerformanceData] = useState(null);
  const [dateRange, setDateRange] = useState('6months');

  useEffect(() => {
    loadUsers();
    // Real-time updates
    const handleRealtime = () => {
      if (selectedUser) loadUserPerformance();
    };
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
  }, [selectedUser, dateRange]);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers();
      // The API returns data directly, not wrapped in response.data
      const usersData = response.data || response;
      setUsers(usersData);
      if (usersData && usersData.length > 0) {
        setSelectedUser(usersData[0].id);
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    }
  };

  const loadUserPerformance = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const startDate = getStartDate(dateRange);
      const endDate = new Date().toISOString().split('T')[0];
      
      const response = await api.getUserPerformance(selectedUser, {
        startDate,
        endDate
      });
      
      // The API returns data directly, not wrapped in response.data
      const performanceData = response.data || response;
      setPerformanceData(performanceData);
    } catch (err) {
      setError('Failed to load user performance data');
      console.error('Error loading user performance:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range) => {
    const date = new Date();
    switch (range) {
      case '1month':
        date.setMonth(date.getMonth() - 1);
        break;
      case '3months':
        date.setMonth(date.getMonth() - 3);
        break;
      case '6months':
        date.setMonth(date.getMonth() - 6);
        break;
      case '1year':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setMonth(date.getMonth() - 6);
    }
    return date.toISOString().split('T')[0];
  };

  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown User';
  };

  if (loading && !performanceData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        User Performance Analytics
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  label="Select User"
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstname} {user.lastname} ({user.role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Date Range"
                >
                  <MenuItem value="1month">Last Month</MenuItem>
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="6months">Last 6 Months</MenuItem>
                  <MenuItem value="1year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {performanceData && (
        <>
          {/* User Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Performance Summary - {getUserName(selectedUser)}
                </Typography>
                <Chip 
                  label={users.find(u => u.id === selectedUser)?.role || 'Unknown'} 
                  size="small" 
                  variant="outlined"
                  sx={{ ml: 1 }}
                  color="primary"
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {performanceData.totalTasks || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Tasks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {performanceData.completedTasks || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Completed Tasks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {performanceData.totalTickets || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Tickets
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {performanceData.efficiency || 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Efficiency Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <Grid container spacing={3}>
            {/* Task Performance Bar Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Task Performance Over Time
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData.taskPerformance || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#00C49F" name="Completed" />
                      <Bar dataKey="pending" fill="#FFBB28" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Radar Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={performanceData.metrics || []}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          {performanceData.recentActivity && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Grid container spacing={2}>
                  {performanceData.recentActivity.map((activity, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {activity.type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {activity.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            label={activity.status} 
                            size="small" 
                            color={activity.status === 'completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default UserPerformanceChart; 