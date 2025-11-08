import { useState, useEffect } from 'react';
import { fetchReports, addReport, updateReport, deleteReport, fetchUsers, fetchDepartments } from '../services/api';
import reportService from '../services/reportService';
import { filterReportsByUser, filterReportsByCriteria, getTabReports, getInitialNewReport, resetNewReport } from '../utils/reportUtils';
import { mockDepartments } from '../data/mockData';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState(getInitialNewReport(mockDepartments));
  
  // Filters and tabs
  const [activeTab, setActiveTab] = useState(0);
  const [reportTypeFilter, setReportTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Report view dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Admin-specific state
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  // Load reports and admin data on mount
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      if (isMounted) {
        await loadReports();
        if (isAdmin) {
          await loadAdminData();
        }
      }
    };
    
    initializeData();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - runs only once on mount

  // Refresh reports when window regains focus (handles page refresh scenarios)
  useEffect(() => {
    const handleFocus = () => {
      forceRefreshReports();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Force refresh function for when we need to bypass the comparison logic
  const forceRefreshReports = async () => {
    setIsLoadingReports(true);
    setLoading(true);
    try {
      const data = await fetchReports();
      
      // Remove duplicates based on ID and composite key (title+type+creator+parameters)
      const byId = new Map();
      data.forEach(r => byId.set(r.id, r));
      const byComposite = new Map();
      data.forEach(r => {
        const paramsKey = JSON.stringify(r.parameters || {});
        const key = `${r.title}::${r.type}::${r.createdBy}::${paramsKey}`;
        const prev = byComposite.get(key);
        if (!prev || new Date(r.createdAt) > new Date(prev.createdAt)) {
          byComposite.set(key, r);
        }
      });
      const uniqueReports = Array.from(byComposite.values());
      
      // Always update state without comparison
      setReports(uniqueReports);
      setError(null);
    } catch (error) {
      console.error('Error force refreshing reports:', error);
      setError('Failed to refresh reports.');
    } finally {
      setLoading(false);
      setIsLoadingReports(false);
    }
  };

  // Load admin-specific data
  const loadAdminData = async () => {
    try {
      // Load users for user reports
      const usersData = await fetchUsers();
      setUsers(usersData.filter(u => u.role === 'employee' || u.role === 'department_head'));
      
      // Load departments for department reports from the API
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Fallback to mock data if API fails
      setDepartments(mockDepartments);
    }
  };

  const loadReports = async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingReports) {
      return;
    }
    
    setIsLoadingReports(true);
    setLoading(true);
    try {
      const data = await fetchReports();
      
      // Remove duplicates based on ID and composite key (title+type+creator+parameters)
      const byId = new Map();
      data.forEach(r => byId.set(r.id, r));
      const byComposite = new Map();
      data.forEach(r => {
        const paramsKey = JSON.stringify(r.parameters || {});
        const key = `${r.title}::${r.type}::${r.createdBy}::${paramsKey}`;
        const prev = byComposite.get(key);
        if (!prev || new Date(r.createdAt) > new Date(prev.createdAt)) {
          byComposite.set(key, r);
        }
      });
      const uniqueReports = Array.from(byComposite.values());
      
      // Update state with new data
      setReports(prevReports => {
        // Simple comparison by ID count and IDs to avoid unnecessary re-renders
        const prevIds = new Set(prevReports.map(r => r.id));
        const newIds = new Set(uniqueReports.map(r => r.id));
        
        // Check if the sets are identical
        if (prevIds.size === newIds.size && [...prevIds].every(id => newIds.has(id))) {
          return prevReports;
        }
        
        return uniqueReports;
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
      setIsLoadingReports(false);
    }
  };

  const handleNewReportChange = (e) => {
    const { name, value } = e.target;
    setNewReport(prev => ({ ...prev, [name]: value }));
    
    // Reset dependent fields when report type changes
    if (name === 'type') {
      setSelectedUserId('');
      setSelectedDepartmentId('');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    window.dispatchEvent(new CustomEvent('show_snackbar', { detail: { message, severity } }));
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleAddReport = async (customSelectedFields = null) => {
    if (!newReport.title || !newReport.type || !newReport.description) return;
    
    // Validate admin-specific requirements
    if (newReport.type === 'user' && !selectedUserId) {
      setError('Please select a user for user reports.');
      return;
    }
    if (newReport.type === 'department' && !selectedDepartmentId) {
      setError('Please select a department for department reports.');
      return;
    }
    
    setLoading(true);
    try {
      // Get selected user/department names
      const selectedUser = users.find(u => u.id === selectedUserId);
      const selectedDepartment = departments.find(d => d.id === selectedDepartmentId);
      
      // Prepare parameters for report generation
      const parameters = {
        title: newReport.title,
        description: newReport.description,
        startDate: newReport.startDate || dateRange.startDate,
        endDate: newReport.endDate || dateRange.endDate,
        ...(newReport.type === 'user' && selectedUser ? { 
          userId: selectedUserId,
          userName: `${selectedUser.firstname} ${selectedUser.lastname}`
        } : {}),
        ...(newReport.type === 'department' && selectedDepartment ? { 
          departmentId: selectedDepartmentId,
          departmentName: selectedDepartment.name
        } : {}),
        ...(newReport.type === 'custom' ? { 
          selectedFields: customSelectedFields ? Object.keys(customSelectedFields).filter(key => customSelectedFields[key]) : ['totalTasks', 'totalTickets', 'totalUsers'],
          filters: {}
        } : {})
      };

      // Generate report using the new service
      let generatedReport;
      switch (newReport.type) {
        case 'ticket':
          generatedReport = await reportService.generateTicketReport(parameters);
          break;
        case 'task':
          generatedReport = await reportService.generateTaskReport(parameters);
          break;
        case 'user':
          generatedReport = await reportService.generateUserReport(parameters);
          break;
        case 'department':
          generatedReport = await reportService.generateDepartmentReport(parameters);
          break;
        case 'custom':
          generatedReport = await reportService.generateCustomReport(parameters);
          break;
        default:
          throw new Error('Invalid report type');
      }

      // The report is already saved to database by the backend
      // Reload reports from database to get the latest data including the new report
      // Add a small delay to ensure the database transaction is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      await loadReports();
      setIsNewReportDialogOpen(false);
      setNewReport(resetNewReport(mockDepartments));
      setSelectedUserId('');
      setSelectedDepartmentId('');
      setError(null);
      showSnackbar('Report generated successfully!', 'success');
    } catch (error) {
      setError('Failed to generate report.');
      showSnackbar('Failed to generate report.', 'error');
    } finally {
      await delay(1500);
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    setLoading(true);
    
    try {
      await deleteReport(reportId);
      
      // Update local state immediately for instant UI feedback
      setReports(prev => prev.filter(r => r.id !== reportId));
      
      // Clear any errors and show success
      setError(null);
      showSnackbar('Report deleted successfully!', 'success');
      
    } catch (error) {
      console.error('Error deleting report:', error);
      setError('Failed to delete report.');
      showSnackbar(`Failed to delete report: ${error.message}`, 'error');
      
      // If deletion failed, reload to get accurate state
      await delay(500);
      await loadReports();
      
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (report) => {
    setSelectedReport(report);
    setReportLoading(true);
    setViewDialogOpen(true);
    
    try {
      // Always regenerate the report data using the saved parameters
      // This ensures we get the most up-to-date data
      const parameters = report.parameters || {};
      
      let generatedReport;
      switch (report.type) {
        case 'ticket':
          generatedReport = await reportService.generateTicketReport(parameters);
          break;
        case 'task':
          generatedReport = await reportService.generateTaskReport(parameters);
          break;
        case 'user':
          generatedReport = await reportService.generateUserReport(parameters);
          break;
        case 'department':
          generatedReport = await reportService.generateDepartmentReport(parameters);
          break;
        case 'custom':
          generatedReport = await reportService.generateCustomReport(parameters);
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      setReportData(generatedReport);
    } catch (error) {
      console.error('Error loading report data:', error);
      setReportData(null);
      showSnackbar('Failed to load report data.', 'error');
    } finally {
      setReportLoading(false);
    }
  };

  const handleEditReport = async (report) => {
    // TODO: Implement report editing logic
    try {
      // await updateReport(report); // Uncomment when implemented
      showSnackbar('Report updated successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to update report.', 'error');
    } finally {
      await delay(1500);
    }
  };

  const handleCloseNewReportDialog = () => {
    setIsNewReportDialogOpen(false);
    setNewReport(resetNewReport(mockDepartments));
    setSelectedUserId('');
    setSelectedDepartmentId('');
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedReport(null);
    setReportData(null);
  };

  // Filter reports by user and criteria
  const userFilteredReports = filterReportsByUser(reports, user);
  const filteredReports = filterReportsByCriteria(userFilteredReports, {
    reportTypeFilter,
    statusFilter
  });
  const tabReports = getTabReports(filteredReports, activeTab);

  return {
    // State
    reports: tabReports,
    loading,
    error,
    isNewReportDialogOpen,
    newReport,
    activeTab,
    reportTypeFilter,
    statusFilter,
    dateRange,
    showFilters,
    viewDialogOpen,
    selectedReport,
    reportData,
    reportLoading,
    isAdmin,
    users,
    departments,
    selectedUserId,
    selectedDepartmentId,
    
    // Actions
    setActiveTab,
    setReportTypeFilter,
    setStatusFilter,
    setDateRange,
    setShowFilters,
    setIsNewReportDialogOpen,
    handleNewReportChange,
    handleAddReport,
    handleDeleteReport,
    handleViewReport,
    handleEditReport,
    handleCloseNewReportDialog,
    handleCloseViewDialog,
    setSelectedUserId,
    setSelectedDepartmentId,
    loadReports,
    forceRefreshReports
  };
}; 