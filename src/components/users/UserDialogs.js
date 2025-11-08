import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  Typography,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress // <-- add this
} from '@mui/material';
import {
  Email as EmailIcon,
  Business as BusinessIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import LoadingSpinner from '../LoadingSpinner';
import {
  getUserDisplayName,
  getDisplayRole,
  getRoleColor,
  getStatusColor,
  getUserDepartment,
  getUserInitials,
  validateUserForm,
  prepareUserData,
  getDefaultFormData,
  getDepartmentOptions,
  getRoleOptions,
  getStatusOptions
} from '../../utils/userUtils';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator';

// View User Dialog
export const ViewUserDialog = ({ open, user, onClose, onEdit, onDelete, isAdmin, actionLoading, isMobile = false }) => {
  const theme = useTheme();

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '100%', sm: 600 }
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: { xs: 1.5, sm: 2 },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 }
      }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            fontSize: { xs: '1rem', sm: '1.2rem' },
            fontWeight: 600
          }}
        >
          {getUserInitials(user)}
        </Avatar>
        <Box>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600, 
              color: theme.palette.primary.main,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            {getUserDisplayName(user)}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            User Details
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 1 
          }}>
            <EmailIcon color="primary" fontSize={isMobile ? "small" : "medium"} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                Email Address
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 1 
          }}>
            <BusinessIcon color="primary" fontSize={isMobile ? "small" : "medium"} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                Department
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {getUserDepartment(user)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 1 
          }}>
            <SupervisorAccountIcon color="primary" fontSize={isMobile ? "small" : "medium"} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                Role
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={getDisplayRole(user.role)}
                  color={getRoleColor(user.role)}
                  size={isMobile ? "small" : "small"}
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 1 
          }}>
            <PersonIcon color="primary" fontSize={isMobile ? "small" : "medium"} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                Status
              </Typography>
              <Chip
                label={user.status || 'Active'}
                color={getStatusColor(user.status || 'Active')}
                size={isMobile ? "small" : "small"}
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderTop: `1px solid ${theme.palette.divider}`,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 1 }
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{ 
            borderRadius: 2, 
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Close
        </Button>
        {isAdmin && (
          <>
            <Button
              onClick={onEdit}
              variant="contained"
              fullWidth={isMobile}
              sx={{ 
                borderRadius: 2, 
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
              disabled={actionLoading}
            >
              Edit User
            </Button>
            <Button
              onClick={onDelete}
              variant="contained"
              color="error"
              fullWidth={isMobile}
              sx={{ 
                borderRadius: 2, 
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
              disabled={actionLoading}
            >
              Remove User
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Add/Edit User Dialog
export const UserFormDialog = ({ 
  open, 
  user = null, 
  onClose, 
  onSubmit, 
  actionLoading = false,
  isMobile = false,
  departments = []
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState(getDefaultFormData());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");

  // Update form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        firstname: user.firstname || user.firstName || '',
        lastname: user.lastname || user.lastName || '',
        email: user.email || '',
        password: '', // Don't populate password for editing
        role: user.role || 'employee',
        department: user.department_id || getUserDepartment(user),
      });
    } else {
      setFormData(getDefaultFormData());
    }
    setErrors({});
    setTouched({});
  }, [user]);

  // Remove status from touched and validation
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    // Validate this field only
    const validationResult = validateUserForm({ ...formData, [field]: value });
    setErrors(prev => ({ ...prev, [field]: validationResult.errors[field] }));
  };

  // Validate all fields on submit
  const handleSubmit = async () => {
    const validationResult = validateUserForm(formData);
    setErrors(validationResult.errors);
    setTouched(prev => ({
      ...prev,
      firstname: true,
      lastname: true,
      email: true,
      // Only touch password on create; on edit it's hidden/disabled
      ...(user ? {} : { password: true }),
      role: true,
      department: true
    }));
    if (Object.keys(validationResult.errors).length > 0) {
      return;
    }
    const userData = prepareUserData(formData, user);
    setApiError("");
    try {
      await onSubmit(userData);
    } catch (err) {
      setApiError(err.message || "Failed to add user");
    }
  };

  const handleClose = () => {
    setFormData(getDefaultFormData());
    setErrors({});
    setTouched({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '100%', sm: 800, md: 900 },
          minWidth: { sm: 500, md: 600 },
          height: { xs: '100%', sm: 'auto' },
          maxHeight: { xs: '100%', sm: '90vh' }
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: { xs: 1.5, sm: 2 }
      }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.main,
            fontSize: { xs: '1.1rem', sm: '1.5rem' }
          }}
        >
          {user ? 'Edit User' : 'Add New User'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: { xs: 2, sm: 3 } }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          {/* Personal Information Section */}
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            bgcolor: theme.palette.background.default, 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
              Personal Information
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First Name"
                  value={formData.firstname}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  error={touched.firstname && !!errors.firstname}
                  helperText={touched.firstname && errors.firstname}
                  required
                  fullWidth
                  disabled={!!user}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  error={touched.lastname && !!errors.lastname}
                  helperText={touched.lastname && errors.lastname}
                  required
                  fullWidth
                  disabled={!!user}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  required
                  fullWidth
                  disabled={!!user}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Grid>
              {!user && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={touched.password && !!errors.password}
                    helperText={touched.password && (errors.password || (!user ? '' : ''))}
                    required={!user}
                    fullWidth
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                  />
                  <PasswordStrengthIndicator password={formData.password} />
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Role & Department Section */}
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            bgcolor: theme.palette.background.default, 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
              Role & Department
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.role && !!errors.role} required>
                  <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Role
                  </InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    label="Role"
                    sx={{
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                  >
                    {getRoleOptions().map(option => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.department && !!errors.department} required>
                  <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Department
                  </InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    label="Department"
                    sx={{
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                  >
                    {getDepartmentOptions(departments).map(option => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Remove the Account Status section from the form */}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderTop: `1px solid ${theme.palette.divider}`,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 1 }
      }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{ 
            borderRadius: 2, 
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth={isMobile}
          disabled={actionLoading}
          sx={{ 
            borderRadius: 2, 
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            height: 40, // fixed height
            minWidth: 120, // ensure consistent width
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {actionLoading ? (
            <CircularProgress size={22} color="inherit" sx={{ position: 'absolute', left: '50%', top: '50%', marginTop: '-11px', marginLeft: '-11px' }} />
          ) : (
            user ? 'Update User' : 'Add User'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete Confirmation Dialog
export const DeleteConfirmationDialog = ({ 
  open, 
  user, 
  onClose, 
  onConfirm, 
  actionLoading = false,
  isMobile = false
}) => {
  const theme = useTheme();

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '100%', sm: 500 }
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: { xs: 1.5, sm: 2 }
      }}>
        <span style={{ fontWeight: 600, color: theme.palette.error.main, fontSize: '1.1rem', display: 'block' }}>
          Confirm Deletion
        </span>
      </DialogTitle>
      <DialogContent sx={{ pt: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              color: theme.palette.text.secondary
            }}
          >
            Are you sure you want to delete the user:
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 1 
          }}>
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                fontWeight: 600
              }}
            >
              {getUserInitials(user)}
            </Avatar>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {getUserDisplayName(user)}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="body2" 
            color="error" 
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontStyle: 'italic'
            }}
          >
            This action cannot be undone. All user data will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderTop: `1px solid ${theme.palette.divider}`,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 1 }
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{ 
            borderRadius: 2, 
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={actionLoading}
          sx={{ minWidth: 100, height: 40, position: 'relative' }}
        >
          {actionLoading ? (
            <CircularProgress size={22} color="inherit" sx={{ position: 'absolute', left: '50%', top: '50%', marginTop: '-11px', marginLeft: '-11px' }} />
          ) : (
            'Delete'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 