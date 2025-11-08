import { useState, useEffect, useCallback } from 'react';
import {
  fetchUsers,
  fetchPendingUsers,
  addUser,
  updateUser,
  deleteUser,
  approvePendingUser,
  rejectPendingUser,
  getDepartments,
  updateDepartment
} from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState(0);
  const [activeUserSubTab, setActiveUserSubTab] = useState(0);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin';

  // Load initial data
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, pendingData, departmentsData] = await Promise.all([
        fetchUsers(),
        fetchPendingUsers(),
        getDepartments()
      ]);
      setUsers(usersData);
      setPendingUsers(pendingData);
      setDepartments(departmentsData);
      setError(null);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and process users
  const filteredUsers = users.filter(user =>
    user.id !== currentUser.id &&
    (user.status === 'approved' || user.status === 'active') &&
    (`${user.firstname || ''} ${user.lastname || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department?.name || user.departmentId || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const departmentHeads = filteredUsers.filter(user => user.role === 'department_head');
  const employees = filteredUsers.filter(user => user.role === 'employee');
  const filteredPendingUsers = pendingUsers.filter(user =>
    user.id !== currentUser.id && user.status === 'pending'
  );

  // User operations
  const handleApproveUser = useCallback(async (userId) => {
    setActionLoading(true);
    try {
      await approvePendingUser(userId);
      const user = pendingUsers.find(u => u.id === userId);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      setUsers(prev => [...prev, { ...user, status: 'Active' }]);
      setError(null);
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user.');
    } finally {
      setActionLoading(false);
    }
  }, [pendingUsers]);

  const handleRejectUser = useCallback(async (userId) => {
    setActionLoading(true);
    try {
      const response = await rejectPendingUser(userId);
      // User is automatically deleted from backend, so remove from both lists
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      setError(null);
      return response;
    } catch (err) {
      console.error('Error rejecting user:', err);
      setError('Failed to reject user.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleDeleteUser = useCallback(async (userId) => {
    setActionLoading(true);
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setError(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleUpdateUser = useCallback(async (userData) => {
    setActionLoading(true);
    try {
      const previous = users.find(u => u.id === userData.id);
      const updated = await updateUser(userData);
      // If role is department_head, ensure department head assignment is updated
      if (updated.role === 'department_head' && updated.departmentId && previous?.departmentId !== updated.departmentId) {
        try {
          await updateDepartment({ id: updated.departmentId, headId: updated.id });
          if (previous?.departmentId && previous.departmentId !== updated.departmentId) {
            await updateDepartment({ id: previous.departmentId, headId: null });
          }
        } catch (e) {
          console.warn('Failed to sync department head assignment:', e?.message || e);
        }
      }
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setError(null);
      return updated;
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleAddUser = useCallback(async (userData) => {
    setActionLoading(true);
    try {
      const created = await addUser(userData);
      setUsers(prev => [...prev, created]);
      setError(null);
      return created;
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleStatusChange = useCallback(async (userId, newStatus) => {
    setActionLoading(true);
    try {
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      
      const updated = await updateUser({ ...user, status: newStatus });
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setError(null);
      return updated;
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [users]);

  // Tab management
  const handleTabChange = useCallback((event, newValue) => {
    setTab(newValue);
    if (newValue === 0) {
      setActiveUserSubTab(0);
    }
  }, []);

  const handleActiveUserSubTabChange = useCallback((event, newValue) => {
    setActiveUserSubTab(newValue);
  }, []);

  // Search management
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Error management
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
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
    
    // Filtered data
    filteredUsers,
    departmentHeads,
    employees,
    filteredPendingUsers,
    
    // Actions
    loadUsers,
    handleApproveUser,
    handleRejectUser,
    handleDeleteUser,
    handleUpdateUser,
    handleAddUser,
    handleStatusChange,
    
    // UI handlers
    handleTabChange,
    handleActiveUserSubTabChange,
    handleSearchChange,
    clearError,
  };
}; 