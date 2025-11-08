import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Avatar,
  InputAdornment,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Help as HelpIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Apartment as DepartmentIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon2,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FileUpload as FileUploadIcon,
  Comment as CommentIcon,
  Forward as ForwardIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import PageHeader from '../components/PageHeader';
import { changePassword, api } from '../services/api';
import DesktopRateLimitAlert from '../components/RateLimitAlert';
import { handleDesktopApiError, desktopRateLimitHandler } from '../utils/rateLimitHandler';
import passwordValidator from '../utils/passwordValidator';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [currentTab, setCurrentTab] = useState(0);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || ''
  });
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [settings, setSettings] = useState({
    autoSave: true,
  });

  // Change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordRateLimitData, setPasswordRateLimitData] = useState(null);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAccountFieldChange = (field, value) => {
    setAccountForm(prev => ({ ...prev, [field]: value }));
    if (accountError) setAccountError('');
  };

  const handleAccountEditToggle = () => setIsEditingAccount(true);
  const handleAccountCancel = () => {
    setAccountForm({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || ''
    });
    setIsEditingAccount(false);
    setAccountError('');
  };

  const handleAccountSave = async () => {
    setIsSavingAccount(true);
    setAccountError('');
    try {
      const payload = {
        firstname: (accountForm.firstname || '').trim(),
        lastname: (accountForm.lastname || '').trim(),
        email: (accountForm.email || '').trim()
      };
      await api.users.updateUser({ id: user.id, ...payload });
      const updatedUser = { ...user, ...payload };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditingAccount(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (e) {
      setAccountError(e.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear success message when user starts typing
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
    
    // Clear general error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const validatePasswords = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = passwordValidator.validate(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.errors[0];
      }
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    // Check if we can retry (not rate limited)
    if (!desktopRateLimitHandler.canRetry('changePassword')) {
      const remainingTime = desktopRateLimitHandler.getRemainingRetryTime('changePassword');
      setPasswordError(`Please wait ${Math.ceil(remainingTime / 1000)} seconds before trying again.`);
      return;
    }
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsChangingPassword(true);
    setPasswordError('');
    setPasswordRateLimitData(null);
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordSuccess(true);
      desktopRateLimitHandler.clearRetryTimer('changePassword');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
      
      // Clear success message and logout after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
        
        // Clear user data and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      const errorInfo = handleDesktopApiError(error);
      
      if (errorInfo.type === 'rate_limit') {
        setPasswordRateLimitData(error.rateLimitData || { error: error.message });
        desktopRateLimitHandler.setRetryTimer('changePassword', errorInfo.retryTime);
        setPasswordError(errorInfo.message);
      } else {
        setPasswordError(errorInfo.message);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <PageHeader
        title="Settings"
        subtitle="Customize your application preferences"
        emoji="⚙️"
        color="primary"
      />

      {showSaveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<PersonIcon />} label="Account" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<HelpIcon />} label="User Guide" />
          </Tabs>

          {/* Account Settings */}
          <TabPanel value={currentTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      mr: 2 
                    }}
                  >
                    {user.firstname?.[0]}{user.lastname?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {user.firstname} {user.lastname}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {user.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 0 }}>
                    Account Information
                  </Typography>
                    {!isEditingAccount ? (
                    <Button variant="outlined" onClick={handleAccountEditToggle} startIcon={<EditIcon />}>Edit</Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button onClick={handleAccountCancel} startIcon={<CloseIcon />}>Cancel</Button>
                        <Button variant="contained" onClick={handleAccountSave} disabled={isSavingAccount} startIcon={<SaveIcon />}>
                        {isSavingAccount ? 'Saving...' : 'Save'}
                      </Button>
                    </Box>
                  )}
                </Box>
                {accountError && (
                  <Alert severity="error" sx={{ mb: 2 }}>{accountError}</Alert>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={isEditingAccount ? accountForm.firstname : (user.firstname || '')}
                      onChange={(e) => handleAccountFieldChange('firstname', e.target.value)}
                      disabled={!isEditingAccount}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={isEditingAccount ? accountForm.lastname : (user.lastname || '')}
                      onChange={(e) => handleAccountFieldChange('lastname', e.target.value)}
                      disabled={!isEditingAccount}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={isEditingAccount ? accountForm.email : (user.email || '')}
                      onChange={(e) => handleAccountFieldChange('email', e.target.value)}
                      disabled={!isEditingAccount}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Role"
                      value={user.role || ''}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={user.department?.name || user.department || 'N/A'}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>




          {/* Security Settings */}
          <TabPanel value={currentTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                
                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Password changed successfully! You will be logged out for security.
                  </Alert>
                )}

                <DesktopRateLimitAlert
                  isOpen={!!passwordRateLimitData}
                  onClose={() => setPasswordRateLimitData(null)}
                  rateLimitData={passwordRateLimitData}
                  endpoint="changePassword"
                  onRetry={() => {
                    setPasswordRateLimitData(null);
                    setPasswordError('');
                  }}
                />
                
                {passwordError && !passwordRateLimitData && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}
                
                <TextField
                  fullWidth
                  type={showPasswords.current ? 'text' : 'password'}
                  label="Current Password"
                  variant="outlined"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  type={showPasswords.new ? 'text' : 'password'}
                  label="New Password"
                  variant="outlined"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <PasswordStrengthIndicator password={passwordData.newPassword} />
                
                <TextField
                  fullWidth
                  type={showPasswords.confirm ? 'text' : 'password'}
                  label="Confirm New Password"
                  variant="outlined"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  startIcon={isChangingPassword ? <CircularProgress size={20} /> : <SecurityIcon />}
                >
                  {isChangingPassword ? 'Changing Password...' : 'Update Password'}
                </Button>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  After changing your password, you will be automatically logged out for security purposes.
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>

          {/* User Guide */}
          <TabPanel value={currentTab} index={2}>
            <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                📚 Desktop Application User Guide
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem' }}>
                Welcome to the Desktop Application of Ticketing and Task Management System! This comprehensive guide will help you navigate and utilize all features effectively on your desktop application.
              </Typography>

              {/* Navigation Overview */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Navigation & Layout
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Sidebar Navigation
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Dashboard</strong> - System overview with interactive charts and real-time data
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Analytics</strong> - Performance insights with charts and user statistics
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Reports</strong> - Generate and view detailed reports with export options
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Tickets</strong> - Submit, view, and manage support tickets with advanced filtering
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Users</strong> - Manage team members and user accounts (Admin/Department Head only)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Departments</strong> - Manage organizational departments (Add and Remove)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Settings</strong> - Account settings and this user guide
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Desktop Application Features
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Responsive Design</strong> - Adapts to different window sizes
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Theme Support</strong> - Light and dark mode themes
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Real-time Updates</strong> - Live data updates and notifications
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Interactive Charts</strong> - Recharts integration for data visualization
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Advanced Filtering</strong> - Complex filter combinations
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Dashboard Guide */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Dashboard Overview
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    The dashboard provides a comprehensive system overview of status and performance metrics with interactive charts and real-time data.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Key Metrics Cards
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Total Tickets</strong> - All system tickets
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Open Tickets</strong> - Currently active tickets
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Closed Tickets</strong> - Completed tickets
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Overdue Tickets</strong> - Tickets past due date
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Total Tasks</strong> - All system tasks
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Completed Tasks</strong> - Finished tasks
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Overdue Tasks</strong> - Tasks past due date
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Active Users</strong> - Currently online users
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Interactive Charts
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Performance Trends</strong> - Bar charts showing ticket/task trends
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Department Breakdown</strong> - Visual department statistics
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Real-time Updates</strong> - Live data refresh capabilities
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Responsive Charts</strong> - Charts adapt to window size
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Tickets Management */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ConfirmationNumberIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tickets Management
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Submit, track, and manage support tickets with comprehensive workflow management and advanced filtering options.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Creating Tickets
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          1. Click <strong>"New Ticket"</strong> button
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          2. Enter ticket title and description
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          3. Select priority level (Low, Medium, High)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          4. Choose target department
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          5. Set due date
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          6. Upload supporting files
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          7. Click <strong>"Create Ticket"</strong>
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Ticket Operations
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>View</strong> - See full ticket details
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Edit</strong> - Modify ticket information
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Forward</strong> - Send to another department
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Comments</strong> - Add updates and remarks
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>File Management</strong> - Upload/download files
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Status Tracking</strong> - Monitor progress
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: 'primary.main' }}>
                    Advanced Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Filtering & Search
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Status Filter</strong> - Filter by ticket status
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Priority Filter</strong> - Filter by priority level
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Department Filter</strong> - Filter by department
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Date Range</strong> - Filter by creation date
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Search</strong> - Search by title or description
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Analytics Guide */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AnalyticsIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Analytics & Reporting
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Access comprehensive analytics and generate detailed reports to track performance and make data-driven decisions.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Analytics Features
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Performance Charts</strong> - Line, bar, and pie charts
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Time Range Filters</strong> - Month, 6 months, year options
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Department Filters</strong> - Filter by specific departments
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>User Performance</strong> - Individual user statistics and metrics
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Real-time Data</strong> - Live updates and refresh capabilities
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Report Generation
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Report Types</strong> - User, Department, Task, Ticket, Custom reports
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Department Summary</strong> - Comprehensive department reports
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Export Options</strong> - PDF and Image formats only
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Date Ranges</strong> - Flexible time period selection
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Filtering</strong> - Advanced report filtering options
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* User Management */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      User Management
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Manage team members, departments, and organizational structure with comprehensive user management tools.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        User Operations
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Add Users</strong> - Create new user accounts
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Edit Users</strong> - Modify user information
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>View Details</strong> - Access user profiles
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Department Assignment</strong> - Assign users to departments
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Approve/Reject</strong> - Manage pending user registrations
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Department Management
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Create Departments</strong> - Add new organizational units
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Edit Departments</strong> - Modify department information
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Assign Heads</strong> - Set department heads
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Delete Departments</strong> - Remove organizational units
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>View Department Details</strong> - Access department information
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* File Management */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FileUploadIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      File Management
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Upload, manage, and organize files for tasks and tickets with desktop-optimized file handling.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Supported File Types
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>PDF Documents</strong> - PDF files only
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Images</strong> - JPG, PNG, GIF, WEBP, BMP
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        File Operations
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Drag & Drop</strong> - Drag files directly into the application
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Browse Files</strong> - Click to open file browser
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Download</strong> - Click download icon
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Preview</strong> - View files in browser
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Delete</strong> - Remove unwanted files
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Size Limit</strong> - Max 10MB per file
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      <strong>Important:</strong> Only PDF and image files are accepted for uploads. When uploading or deleting files during task/ticket editing, you must provide remarks explaining the changes.
                    </Typography>
                  </Alert>
                </AccordionDetails>
              </Accordion>

              {/* Rate Limiting Guide */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SpeedIcon sx={{ mr: 2, color: 'warning.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Rate Limiting & Security
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Our system implements rate limiting to ensure security and optimal performance for all users.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Rate Limit Features
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Smart Detection</strong> - Automatically detects rate limit violations
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Visual Timer</strong> - Shows countdown timer for retry availability
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Progress Bar</strong> - Visual progress indicator for wait time
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Auto Retry</strong> - Automatically enables retry when timer expires
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>User-Friendly Messages</strong> - Clear explanations of rate limits
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Actual Rate Limits
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Login Attempts</strong> - 5 attempts per 15 minutes
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Password Reset</strong> - 3 attempts per hour
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Change Password</strong> - 3 attempts per 15 minutes
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>General API</strong> - 100 requests per 15 minutes
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Registration</strong> - 5 attempts per 15 minutes
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      <strong>Tip:</strong> If you encounter rate limiting, wait for the timer to complete before retrying. The system will automatically enable the retry button when the cooldown period ends.
                    </Typography>
                  </Alert>
                </AccordionDetails>
              </Accordion>

              {/* Desktop Features */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Desktop-Specific Features
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    The desktop application is optimized for productivity with advanced features designed for desktop users.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Advanced Features
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Data Export</strong> - Export to PDF and Image formats
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Advanced Filtering</strong> - Complex filter combinations
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Real-time Updates</strong> - Live data synchronization
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Responsive Design</strong> - Adapts to different screen sizes
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Interactive Charts</strong> - Recharts integration for data visualization
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Tips & Best Practices */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tips & Best Practices
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Desktop Usage Tips
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Use Full Screen</strong> - Maximize windows for better data viewing
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Refresh Data</strong> - Use refresh buttons for real-time updates
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Filter Data</strong> - Use advanced filters for better data management
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Export Reports</strong> - Generate PDF and Image exports
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Theme Toggle</strong> - Switch between light and dark modes
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Productivity Tips
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Use Filters</strong> - Filter data to focus on relevant items
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Real-time Updates</strong> - Monitor live data changes
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Interactive Charts</strong> - Use charts for data visualization
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Regular Updates</strong> - Keep the application updated
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Support Information */}
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HelpIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Support & Troubleshooting
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    If you need additional assistance or have questions not covered in this guide, please contact your system administrator or IT support team.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Common Issues
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Application Not Loading</strong> - Check internet connection and restart
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Login Problems</strong> - Verify credentials and check rate limits
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Performance Issues</strong> - Close other applications and restart
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>File Upload Issues</strong> - Check file size and format requirements
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Display Problems</strong> - Check display settings and resolution
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Getting Help
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>IT Support</strong> - For technical issues and account problems
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>Department Head</strong> - For workflow and task-related questions
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>System Admin</strong> - For system-wide issues and permissions
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • <strong>User Guide</strong> - This comprehensive guide for self-help
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      <strong>Thank you for using the Desktop Application of Ticketing and Task Management System!</strong> This guide is regularly updated to reflect new features and improvements.
                    </Typography>
                  </Alert>
                </AccordionDetails>
              </Accordion>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Global Save button removed: actions are handled inline for better UX */}
    </Box>
  );
};

export default Settings; 