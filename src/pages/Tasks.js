import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { fetchTasks, addTask, updateTask, deleteTask } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { getPriorityColor, getStatusColor } from '../utils/sharedUtils';

const Tasks = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: ''
  });

  useEffect(() => {
    loadTasks();

    // Real-time task updates
    const handleTaskUpdate = (e) => {
      const updatedTask = e.detail;
      setTasks((prev) => {
        const exists = prev.some(t => t.id === updatedTask.id);
        if (exists) {
          return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
        } else {
          return [updatedTask, ...prev];
        }
      });
    };
    window.addEventListener('task_update', handleTaskUpdate);

    // Real-time new comments (placeholder, actual logic may be in CommentSection)
    const handleNewComment = (e) => {
      const comment = e.detail;
      // Optionally, update comments state if managed here
    };
    window.addEventListener('new_comment', handleNewComment);

    return () => {
      window.removeEventListener('task_update', handleTaskUpdate);
      window.removeEventListener('new_comment', handleNewComment);
    };
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignee: task.assignee || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        dueDate: task.dueDate || ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        assignee: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'Medium',
      status: 'Pending',
      dueDate: ''
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setActionLoading(true);
    try {
      if (editingTask) {
        const updatedTask = await updateTask({
          id: editingTask.id,
          ...formData
        });
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      } else {
        const newTask = await addTask(formData);
        setTasks(prevTasks => [...prevTasks, newTask]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setActionLoading(true);
    try {
      const updatedTask = await updateTask({ id: taskId, status: newStatus });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner 
        message="Loading tasks..." 
        size="large"
      />
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <PageHeader
        title="Tasks Management"
        subtitle="Create, track, and manage project tasks"
        emoji="📋"
        color="success"
        actionButton={{
          icon: <AddIcon />,
          text: "Add Task",
          onClick: () => handleOpenDialog(),
          disabled: actionLoading
        }}
      />

      {!loading && tasks.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220, width: '100%' }}>
          <ScheduleIcon sx={{ fontSize: 64, color: theme.palette.action.disabled }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No tasks found.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(task)}
                          disabled={actionLoading}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(task.id)}
                          disabled={actionLoading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {task.assignee}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Due: {task.dueDate}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </Box>

                  {task.status !== 'Completed' && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleStatusChange(task.id, 'Completed')}
                      disabled={actionLoading}
                      sx={{ mt: 1 }}
                    >
                      Mark Complete
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={actionLoading}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={actionLoading}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Assignee"
            fullWidth
            variant="outlined"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            disabled={actionLoading}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              disabled={actionLoading}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              disabled={actionLoading}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            disabled={actionLoading}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : (editingTask ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks; 