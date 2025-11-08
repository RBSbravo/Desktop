import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Avatar,
  useTheme,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Assignment as TaskIcon,
  ConfirmationNumber as TicketIcon,
  Build as CustomIcon,
  ExpandMore as ExpandMoreIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
} from '@mui/icons-material';

const NewReportDialog = ({
  open,
  onClose,
  newReport,
  onNewReportChange,
  onAddReport,
  loading,
  isAdmin,
  users,
  departments,
  selectedUserId,
  selectedDepartmentId,
  onSelectedUserIdChange,
  onSelectedDepartmentIdChange
}) => {
  const theme = useTheme();
  
  // State for custom report field selection
  const [selectedFields, setSelectedFields] = React.useState({
    // Ticket Metrics
    totalTickets: false,
    pendingTickets: false,
    inProgressTickets: false,
    completedTickets: false,
    declinedTickets: false,
    ticketResolutionRate: false,
    averageTicketResolutionTime: false,
    
    // Task Metrics
    totalTasks: false,
    pendingTasks: false,
    inProgressTasks: false,
    completedTasks: false,
    overdueTasks: false,
    taskCompletionRate: false,
    averageTaskCompletionTime: false
  });

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'ticket':
        return <TicketIcon color="error" />;
      case 'task':
        return <TaskIcon color="primary" />;
      case 'user':
        return <PersonIcon color="secondary" />;
      case 'department':
        return <BusinessIcon color="info" />;
      case 'custom':
        return <CustomIcon color="warning" />;
      default:
        return <AssessmentIcon />;
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case 'ticket':
        return 'error';
      case 'task':
        return 'primary';
      case 'user':
        return 'secondary';
      case 'department':
        return 'info';
      case 'custom':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Handle custom report field selection
  const handleFieldSelection = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle select all for a category
  const handleSelectAll = (category) => {
    const categoryFields = {
      ticketMetrics: ['totalTickets', 'pendingTickets', 'inProgressTickets', 'completedTickets', 'declinedTickets', 'ticketResolutionRate', 'averageTicketResolutionTime'],
      taskMetrics: ['totalTasks', 'pendingTasks', 'inProgressTasks', 'completedTasks', 'overdueTasks', 'taskCompletionRate', 'averageTaskCompletionTime']
    };

    const fields = categoryFields[category] || [];
    const allSelected = fields.every(field => selectedFields[field]);
    
    setSelectedFields(prev => {
      const newState = { ...prev };
      fields.forEach(field => {
        newState[field] = !allSelected;
      });
      return newState;
    });
  };

  // Reset field selection when report type changes
  React.useEffect(() => {
    if (newReport.type !== 'custom') {
      setSelectedFields({
        totalTickets: false,
        pendingTickets: false,
        inProgressTickets: false,
        completedTickets: false,
        declinedTickets: false,
        ticketResolutionRate: false,
        averageTicketResolutionTime: false,
        totalTasks: false,
        pendingTasks: false,
        inProgressTasks: false,
        completedTasks: false,
        overdueTasks: false,
        taskCompletionRate: false,
        averageTaskCompletionTime: false
      });
    }
  }, [newReport.type]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <AssessmentIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
        <Box sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
          Generate New Report
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 5 }}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Report Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                label="Report Type"
                name="type"
                value={newReport.type}
                onChange={onNewReportChange}
              >
                <MenuItem value="ticket">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TicketIcon color="error" />
                    Ticket Reports
                  </Box>
                </MenuItem>
                <MenuItem value="task">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TaskIcon color="primary" />
                    Task Reports
                  </Box>
                </MenuItem>
                <MenuItem value="user">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="secondary" />
                    User Reports
                  </Box>
                </MenuItem>
                <MenuItem value="department">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="info" />
                    Department Reports
                  </Box>
                </MenuItem>
                <MenuItem value="custom">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CustomIcon color="warning" />
                    Custom Reports
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Report Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Report Name"
              name="title"
              value={newReport.title}
              onChange={onNewReportChange}
              variant="outlined"
              required
            />
          </Grid>

          {/* User Selection for User Reports */}
          {newReport.type === 'user' && isAdmin && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Select User</InputLabel>
                <Select
                  label="Select User"
                  value={selectedUserId}
                  onChange={(e) => onSelectedUserIdChange(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {user.firstname?.[0]}{user.lastname?.[0]}
                        </Avatar>
                        {user.firstname} {user.lastname} ({user.role})
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Department Selection for Department Reports */}
          {newReport.type === 'department' && isAdmin && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Select Department</InputLabel>
                <Select
                  label="Select Department"
                  value={selectedDepartmentId}
                  onChange={(e) => onSelectedDepartmentIdChange(e.target.value)}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon color="info" />
                        {dept.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Date Range */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              name="startDate"
              value={newReport.startDate || ''}
              onChange={onNewReportChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              name="endDate"
              value={newReport.endDate || ''}
              onChange={onNewReportChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newReport.description}
              onChange={onNewReportChange}
              multiline
              rows={3}
              variant="outlined"
              placeholder="Describe what this report will contain..."
            />
          </Grid>

          {/* Custom Report Field Selection */}
          {newReport.type === 'custom' && (
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: theme.palette.background.default, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CustomIcon color="warning" />
                    Custom Report Fields
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedFields(prev => {
                          const newState = {};
                          Object.keys(prev).forEach(key => {
                            newState[key] = true;
                          });
                          return newState;
                        });
                      }}
                      sx={{ fontSize: '0.75rem', px: 1 }}
                    >
                      Select All
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedFields(prev => {
                          const newState = {};
                          Object.keys(prev).forEach(key => {
                            newState[key] = false;
                          });
                          return newState;
                        });
                      }}
                      sx={{ fontSize: '0.75rem', px: 1 }}
                    >
                      Deselect All
                    </Button>
                  </Box>
                </Box>


                {/* Ticket Metrics */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TicketIcon color="error" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Ticket Metrics
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAll('ticketMetrics');
                        }}
                        sx={{ ml: 'auto', fontSize: '0.7rem' }}
                      >
                        {['totalTickets', 'pendingTickets', 'inProgressTickets', 'completedTickets', 'declinedTickets', 'ticketResolutionRate', 'averageTicketResolutionTime'].every(field => selectedFields[field]) ? 'Deselect All' : 'Select All'}
                      </Button>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.totalTickets} onChange={() => handleFieldSelection('totalTickets')} color="error" />}
                            label="Total Tickets"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.pendingTickets} onChange={() => handleFieldSelection('pendingTickets')} color="error" />}
                            label="Pending Tickets"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.inProgressTickets} onChange={() => handleFieldSelection('inProgressTickets')} color="error" />}
                            label="In Progress Tickets"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.completedTickets} onChange={() => handleFieldSelection('completedTickets')} color="error" />}
                            label="Completed Tickets"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.declinedTickets} onChange={() => handleFieldSelection('declinedTickets')} color="error" />}
                            label="Declined Tickets"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.ticketResolutionRate} onChange={() => handleFieldSelection('ticketResolutionRate')} color="error" />}
                            label="Resolution Rate"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.averageTicketResolutionTime} onChange={() => handleFieldSelection('averageTicketResolutionTime')} color="error" />}
                            label="Avg Resolution Time"
                          />
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>

                {/* Task Metrics */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TaskIcon color="primary" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Task Metrics
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAll('taskMetrics');
                        }}
                        sx={{ ml: 'auto', fontSize: '0.7rem' }}
                      >
                        {['totalTasks', 'pendingTasks', 'inProgressTasks', 'completedTasks', 'overdueTasks', 'taskCompletionRate', 'averageTaskCompletionTime'].every(field => selectedFields[field]) ? 'Deselect All' : 'Select All'}
                      </Button>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.totalTasks} onChange={() => handleFieldSelection('totalTasks')} color="primary" />}
                            label="Total Tasks"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.pendingTasks} onChange={() => handleFieldSelection('pendingTasks')} color="primary" />}
                            label="Pending Tasks"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.inProgressTasks} onChange={() => handleFieldSelection('inProgressTasks')} color="primary" />}
                            label="In Progress Tasks"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.completedTasks} onChange={() => handleFieldSelection('completedTasks')} color="primary" />}
                            label="Completed Tasks"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.overdueTasks} onChange={() => handleFieldSelection('overdueTasks')} color="primary" />}
                            label="Overdue Tasks"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.taskCompletionRate} onChange={() => handleFieldSelection('taskCompletionRate')} color="primary" />}
                            label="Completion Rate"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={<Checkbox checked={selectedFields.averageTaskCompletionTime} onChange={() => handleFieldSelection('averageTaskCompletionTime')} color="primary" />}
                            label="Avg Completion Time"
                          />
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>

                


                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  {Object.values(selectedFields).filter(field => field).length} of {Object.keys(selectedFields).length} fields selected. Select at least one field to generate the custom report.
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Report Type Info */}
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2, 
              bgcolor: theme.palette.background.default, 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {getReportTypeIcon(newReport.type)}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {newReport.type.charAt(0).toUpperCase() + newReport.type.slice(1)} Report
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {newReport.type === 'ticket' && 'Generate comprehensive ticket analytics including resolution times and status breakdowns.'}
                {newReport.type === 'task' && 'Generate comprehensive task analytics and performance metrics across all departments.'}
                {newReport.type === 'user' && 'Analyze individual user performance, task completion rates, and productivity metrics.'}
                {newReport.type === 'department' && 'Get detailed department analytics including team performance and resource utilization.'}
                {newReport.type === 'custom' && 'Create custom reports with specific parameters and data filters.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={() => onAddReport(selectedFields)}
          startIcon={<AssessmentIcon />}
          sx={{ borderRadius: 2, px: 3 }}
          disabled={
            loading || 
            !newReport.title || 
            !newReport.type || 
            !newReport.description ||
            (newReport.type === 'user' && !selectedUserId) ||
            (newReport.type === 'department' && !selectedDepartmentId) ||
            (newReport.type === 'custom' && !Object.values(selectedFields).some(field => field))
          }
        >
          Generate Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewReportDialog; 