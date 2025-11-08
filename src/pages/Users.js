import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import { useUsers } from '../hooks/useUsers';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import {
  UserTabs,
  ActiveUsersSection,
  PendingUsersTable
} from '../components/users/UserSections';
import {
  ViewUserDialog,
  UserFormDialog,
  DeleteConfirmationDialog
} from '../components/users/UserDialogs';

const Users = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [successMessage, setSuccessMessage] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formKey, setFormKey] = useState(0); // for resetting form
  
  const {
    users,
    pendingUsers,
    departments,
    loading,
    error,
    actionLoading,
    searchTerm,
    tab,
    activeUserSubTab,
    isAdmin,
    currentUser,
    filteredUsers,
    departmentHeads,
    employees,
    filteredPendingUsers,
    handleApproveUser,
    handleRejectUser,
    handleDeleteUser,
    handleUpdateUser,
    handleAddUser,
    handleStatusChange,
    handleTabChange,
    handleActiveUserSubTabChange,
    handleSearchChange,
    clearError
  } = useUsers();

  // Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Handlers
  const handleView = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormDialogOpen(true);
    setViewDialogOpen(false);
  };
  const handleAdd = () => {
    setEditingUser(null);
    setFormDialogOpen(true);
  };
  const handleDelete = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    setViewDialogOpen(false);
  };
  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        setAdding(true);
        const start = Date.now();
        await handleUpdateUser(userData);
        const elapsed = Date.now() - start;
        if (elapsed < 1500) await new Promise(res => setTimeout(res, 1500 - elapsed));
        setSuccessMessage("User updated successfully.");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setAdding(true);
        const start = Date.now();
        await handleAddUser(userData);
        const elapsed = Date.now() - start;
        if (elapsed < 1500) await new Promise(res => setTimeout(res, 1500 - elapsed));
        setSuccessMessage("User added successfully.");
        setTimeout(() => setSuccessMessage(""), 4000);
        setFormKey(prev => prev + 1); // force form reset
      }
      setAdding(false);
      setFormDialogOpen(false);
      setEditingUser(null);
    } catch (err) {
      setAdding(false);
      throw err;
    }
  };
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    const start = Date.now();
    await handleDeleteUser(selectedUser.id);
    const elapsed = Date.now() - start;
    if (elapsed < 1500) await new Promise(res => setTimeout(res, 1500 - elapsed));
    setSuccessMessage("User deleted successfully.");
    setTimeout(() => setSuccessMessage(""), 4000);
    setDeleting(false);
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleRejectUserWithMessage = async (userId) => {
    try {
      await handleRejectUser(userId);
      setSuccessMessage("User rejected and account deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  useEffect(() => {
    // Real-time updates
    const handleRealtime = () => { if (typeof window !== 'undefined' && window.location) window.location.reload(); };
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

  if (loading) {
    return (
      <LoadingSpinner 
        message="Loading users..." 
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
        title="Users Management"
        subtitle="Manage active users and pending approvals"
        emoji="👥"
        color="info"
        actionButton={isAdmin ? {
          icon: <AddIcon />,
          text: isMobile ? 'Add User' : 'Add New User',
          onClick: handleAdd,
          disabled: actionLoading
        } : null}
      />
      
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, position: 'fixed', top: 24, left: 0, right: 0, zIndex: 2000, width: 'fit-content', mx: 'auto' }} onClose={() => setSuccessMessage("")}>{successMessage}</Alert>
      )}

      {/* Scrollable Content */}
      <Box sx={{ 
        flexGrow: 1, 
        minHeight: 0, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: { xs: 'none', md: 'block' },
        },
        '&::-webkit-scrollbar-track': {
          display: { xs: 'none', md: 'block' },
        },
        '&::-webkit-scrollbar-thumb': {
          display: { xs: 'none', md: 'block' },
        },
        scrollbarWidth: { xs: 'none', md: 'auto' },
        msOverflowStyle: { xs: 'none', md: 'auto' },
      }}>
        <Fade in={true} timeout={800}>
          <Box>
            <UserTabs 
              tab={tab} 
              onTabChange={handleTabChange} 
              pendingUsersCount={filteredPendingUsers.length} 
            />

          {/* Active Users Tab */}
          {tab === 0 && (
              <ActiveUsersSection
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                activeTab={activeUserSubTab}
                onActiveTabChange={handleActiveUserSubTabChange}
                departmentHeads={departmentHeads}
                employees={employees}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                isAdmin={isAdmin}
                actionLoading={actionLoading}
                isMobile={isMobile}
              />
          )}

          {/* Pending Users Tab */}
          {tab === 1 && (
              <PendingUsersTable
                pendingUsers={filteredPendingUsers}
                onApprove={handleApproveUser}
                onReject={handleRejectUserWithMessage}
                actionLoading={actionLoading}
                isMobile={isMobile}
              />
            )}
              </Box>
        </Fade>
                </Box>

      {/* View User Dialog */}
      <ViewUserDialog
        open={viewDialogOpen}
        user={selectedUser}
        onClose={() => setViewDialogOpen(false)}
        onEdit={() => handleEdit(selectedUser)}
        onDelete={() => handleDelete(selectedUser.id)}
        isAdmin={isAdmin}
        actionLoading={actionLoading}
        isMobile={isMobile}
      />

          {/* Add/Edit User Dialog */}
      <UserFormDialog
        key={formKey}
        open={formDialogOpen}
        user={editingUser}
        onClose={() => { setFormDialogOpen(false); setEditingUser(null); }}
        onSubmit={handleFormSubmit}
        actionLoading={actionLoading || adding}
        isMobile={isMobile}
        departments={departments}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        user={selectedUser}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        actionLoading={deleting}
      />

          {/* Global Loading Overlay */}
          {(actionLoading || deleting || adding) && (
            <LoadingSpinner 
              message={deleting ? "Deleting user..." : adding ? "Adding user..." : "Processing..."} 
              fullScreen={true}
              overlay={true}
            />
      )}
    </Box>
  );
};

export default Users; 