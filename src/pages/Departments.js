import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Fab,
  Avatar,
  Chip,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Snackbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Group as GroupIcon, 
  Person as PersonIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Info as InfoIcon,
  Business as BusinessIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Search as SearchIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
} from '../services/api';
import PageHeader from '../components/PageHeader';

// Helper component: Only show tooltip if text is truncated
function TruncateTooltip({ title, children, ...props }) {
  const textRef = useRef(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const el = textRef.current;
      if (el) {
        const isTruncated = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
        setTruncated(isTruncated);
      }
    };

    // Check immediately
    checkTruncation();
    
    // Check again after a small delay to ensure proper detection
    const timer = setTimeout(checkTruncation, 100);
    
    return () => clearTimeout(timer);
  }, [children, title]);

  if (truncated) {
    return (
      <Tooltip title={title} arrow {...props}>
        <span ref={textRef} style={{ display: 'block', width: '100%' }}>{children}</span>
      </Tooltip>
    );
  }
  return <span ref={textRef} style={{ display: 'block', width: '100%' }}>{children}</span>;
}

// Department Table Component
const DepartmentTable = ({ departments, isAdmin, onView, onEdit, onDelete, isMobile, theme }) => {
  const getDepartmentHeadName = (dept) => {
    if (dept.head && (dept.head.firstname || dept.head.lastname)) {
      return `${dept.head.firstname || ''} ${dept.head.lastname || ''}`.trim();
    }
    return dept.headName || 'No Head Assigned';
  };

  if (isMobile) {
    // Mobile card layout
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {departments.map((dept) => (
          <Card
            key={dept.id}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              cursor: 'pointer',
              '&:hover': { bgcolor: theme.palette.action.hover },
            }}
            onClick={() => onView(dept)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: theme.palette.primary.main,
                  mr: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <BusinessIcon />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {dept.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {getDepartmentHeadName(dept)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label="Active"
                size="small"
                color="success"
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  height: 24
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              justifyContent: 'flex-end',
            }}>
              <Tooltip title="View Details">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(dept);
                  }}
                  size="small"
                  sx={{ color: theme.palette.primary.main }}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isAdmin && (
                <>
                  <Tooltip title="Edit Department">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(dept);
                      }}
                      size="small"
                      sx={{ color: theme.palette.info.main }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Department">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(dept);
                      }}
                      size="small"
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop table layout
  return (
    <TableContainer component={Paper} sx={{ 
      borderRadius: 3, 
      boxShadow: 3, 
      overflowX: 'auto', 
      width: '100%', 
      bgcolor: theme.palette.background.paper,
      '&::-webkit-scrollbar': {
        height: 8,
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.action.hover,
        borderRadius: 4,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.action.disabled,
        borderRadius: 4,
        '&:hover': {
          backgroundColor: theme.palette.action.active,
        },
      },
    }}>
      <Table size="medium" sx={{ width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 2, 
            bgcolor: theme.palette.background.paper, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
          }}>
            <TableCell sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              maxWidth: 200, 
              minWidth: 150 
            }}>
              Department
            </TableCell>
            <TableCell sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              minWidth: 120, 
              maxWidth: 200 
            }}>
              Department Head
            </TableCell>
            <TableCell sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              minWidth: 200, 
              maxWidth: 400 
            }}>
              Description
            </TableCell>
            <TableCell sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              width: 100, 
              minWidth: 80 
            }}>
              Status
            </TableCell>
            <TableCell sx={{ 
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: { md: '0.92rem', lg: '1rem' }, 
              borderBottom: '2px solid', 
              borderColor: theme.palette.divider, 
              px: { md: 0.5, lg: 2 }, 
              minWidth: 120, 
              maxWidth: 180, 
              whiteSpace: 'nowrap' 
            }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((dept, idx) => (
            <TableRow 
              key={dept.id} 
              hover 
              sx={{ 
                bgcolor: idx % 2 === 0 ? theme.palette.background.default : theme.palette.background.paper, 
                transition: 'background 0.2s', 
                '&:hover': { bgcolor: theme.palette.action.hover },
                cursor: 'pointer'
              }}
              onClick={() => onView(dept)}
            >
              <TableCell sx={{ maxWidth: 200, minWidth: 150, px: { md: 0.5, lg: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <Avatar
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <BusinessIcon />
                  </Avatar>
                  <Typography 
                    variant="subtitle1" 
                    noWrap 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: { md: '0.85rem', lg: '0.9rem' }, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      textAlign: 'center',
                      maxWidth: 120
                    }}
                  >
                    {dept.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ maxWidth: 200, minWidth: 120, px: { md: 0.5, lg: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <SupervisorAccountIcon 
                    fontSize="small" 
                    sx={{ color: theme.palette.text.secondary }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    noWrap 
                    sx={{ 
                      fontSize: { md: '0.75rem', lg: '0.8rem' }, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap', 
                      textAlign: 'center' 
                    }}
                  >
                    {getDepartmentHeadName(dept)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ maxWidth: 400, minWidth: 200, px: { md: 0.5, lg: 2 } }}>
                <TruncateTooltip title={dept.description || 'No description available'}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    noWrap 
                    sx={{ 
                      fontSize: { md: '0.75rem', lg: '0.8rem' }, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap', 
                      textAlign: 'center',
                      fontStyle: dept.description ? 'normal' : 'italic'
                    }}
                  >
                    {dept.description || 'No description available'}
                  </Typography>
                </TruncateTooltip>
              </TableCell>
              <TableCell sx={{ width: 100, minWidth: 80, px: { md: 0.5, lg: 2 } }}>
                <Chip
                  label="Active"
                  size="small"
                  color="success"
                  sx={{ 
                    fontSize: { md: '0.65rem', lg: '0.7rem' }, 
                    fontWeight: 600, 
                    borderRadius: 2, 
                    px: 1, 
                    height: { md: 20, lg: 24 }, 
                    boxShadow: 1, 
                    minWidth: 60, 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'center'
                  }}
                />
              </TableCell>
              <TableCell sx={{ minWidth: 120, maxWidth: 180, px: { md: 0.5, lg: 2 }, whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Tooltip title="View Details">
                    <span>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(dept);
                        }}
                        size="small"
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: 'transparent',
                          '&:hover': { bgcolor: theme.palette.primary.light },
                          p: 0.5
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  {isAdmin && (
                    <>
                      <Tooltip title="Edit Department">
                        <span>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(dept);
                            }}
                            size="small"
                            sx={{
                              color: theme.palette.info.main,
                              bgcolor: 'transparent',
                              '&:hover': { bgcolor: theme.palette.info.light },
                              p: 0.5
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete Department">
                        <span>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(dept);
                            }}
                            size="small"
                            sx={{
                              color: theme.palette.error.main,
                              bgcolor: 'transparent',
                              '&:hover': { bgcolor: theme.palette.error.light },
                              p: 0.5
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Departments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Mock admin role check
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    setLoading(true);
    fetchDepartments()
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load departments.');
        setLoading(false);
      });
    // Real-time updates
    const handleRealtime = () => { fetchDepartments().then(data => setDepartments(data)); };
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

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewDept({ name: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDept((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDepartment = async () => {
    if (!newDept.name) return;
    setLoading(true);
    try {
      const created = await addDepartment({
        name: newDept.name,
        description: newDept.description
      });
      setDepartments(prev => [...prev, created]);
      setNewDept({ name: '', description: '' }); // Reset form
      handleCloseDialog();
      showSnackbar(`Department "${created.name}" added successfully!`, 'success');
    } catch {
      setError('Failed to add department.');
      showSnackbar('Failed to add department.', 'error');
    }
    setLoading(false);
  };

  const handleEditClick = (dept) => {
    setSelectedDept(dept);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (dept) => {
    setSelectedDept(dept);
    setDeleteDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedDept((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    setLoading(true);
    try {
      const updated = await updateDepartment({
        id: selectedDept.id,
        name: selectedDept.name,
        description: selectedDept.description
      });
      setDepartments(prev => prev.map(d => d.id === updated.id ? updated : d));
      setEditDialogOpen(false);
      setSelectedDept(null);
      showSnackbar(`Department "${updated.name}" updated successfully!`, 'success');
    } catch {
      setError('Failed to update department.');
      showSnackbar('Failed to update department.', 'error');
    }
    setLoading(false);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    const deptName = selectedDept.name; // Store name before deletion
    try {
      await deleteDepartment(selectedDept.id);
      setDepartments(prev => prev.filter(d => d.id !== selectedDept.id));
      setDeleteDialogOpen(false);
      setSelectedDept(null);
      showSnackbar(`Department "${deptName}" deleted successfully!`, 'success');
    } catch (err) {
      setError(err.message || 'Failed to delete department.');
      showSnackbar('Failed to delete department.', 'error');
    }
    setLoading(false);
  };

  const handleViewClick = (dept) => {
    // Try to find department head name if available
    let headName = '';
    if (dept.head && (dept.head.firstname || dept.head.lastname)) {
      headName = `${dept.head.firstname || ''} ${dept.head.lastname || ''}`.trim();
    } else if (dept.headName) {
      headName = dept.headName;
    }
    setSelectedDept({ ...dept, headName });
    setViewDialogOpen(true);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = dept.name?.toLowerCase().includes(searchLower);
    const descriptionMatch = dept.description?.toLowerCase().includes(searchLower);
    const headNameMatch = dept.head?.firstname?.toLowerCase().includes(searchLower) ||
                         dept.head?.lastname?.toLowerCase().includes(searchLower) ||
                         dept.headName?.toLowerCase().includes(searchLower);
    
    return nameMatch || descriptionMatch || headNameMatch;
  });

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <PageHeader
        title="Department Management"
        subtitle="Organize and manage company departments"
        emoji="🏢"
        color="primary"
        actionButton={isAdmin ? {
          icon: <AddIcon />,
          text: "Add Department",
          onClick: handleOpenDialog,
          disabled: loading
        } : null}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search departments by name, description, or department head..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : filteredDepartments.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220, width: '100%' }}>
          <GroupIcon sx={{ fontSize: 64, color: theme.palette.action.disabled }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            {searchTerm ? 'No departments found matching your search.' : 'No departments found.'}
          </Typography>
          {searchTerm && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria.
            </Typography>
          )}
        </Box>
      ) : (
        <DepartmentTable
          departments={filteredDepartments}
          isAdmin={isAdmin}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isMobile={isMobile}
          theme={theme}
        />
      )}
      {/* Add Department Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Department Name"
              name="name"
              value={newDept.name}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newDept.description}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddDepartment}>Add</Button>
        </DialogActions>
      </Dialog>
      {/* Edit Department Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Department Name"
              name="name"
              value={selectedDept?.name || ''}
              onChange={handleEditChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={selectedDept?.description || ''}
              onChange={handleEditChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Department Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the department <b>{selectedDept?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
      {/* View Department Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <GroupIcon sx={{ color: theme.palette.primary.main, fontSize: 36 }} />
          <Box>
            <TruncateTooltip title={selectedDept?.name}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.25rem' }}>
              {selectedDept?.name}
            </Typography>
            </TruncateTooltip>
            <Typography variant="body2" color="text.secondary">
              Department Details
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              <InfoIcon color="primary" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Department ID
                </Typography>
                <TruncateTooltip title={selectedDept?.id}>
                  <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedDept?.id}
                </Typography>
                </TruncateTooltip>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              <GroupIcon color="primary" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Department Name
                </Typography>
                <TruncateTooltip title={selectedDept?.name}>
                  <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedDept?.name}
                </Typography>
                </TruncateTooltip>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              <PersonIcon color="primary" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Department Head
                </Typography>
                <TruncateTooltip title={selectedDept?.headName || 'No Department Head Assigned'}>
                  <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedDept?.headName || 'No Department Head Assigned'}
                </Typography>
                </TruncateTooltip>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              <InfoIcon color="primary" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Description
                </Typography>
                <TruncateTooltip title={selectedDept?.description || 'No description provided.'}>
                  <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedDept?.description || 'No description provided.'}
                </Typography>
                </TruncateTooltip>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={() => setViewDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Departments; 