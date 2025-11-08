import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Build as CustomIcon
} from '@mui/icons-material';

export const getStatusColor = (status) => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'in progress':
      return 'info';
    case 'failed':
      return 'error';
    case 'scheduled':
      return 'secondary';
    default:
      return 'default';
  }
};

export const getTypeColor = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'task':
      return 'primary';
    case 'ticket':
      return 'success';
    case 'user':
      return 'secondary';
    case 'department':
      return 'info';
    case 'custom':
      return 'warning';
    case 'quarterly':
      return 'primary';
    case 'monthly':
      return 'secondary';
    case 'weekly':
      return 'info';
    case 'annual':
      return 'success';
    default:
      return 'default';
  }
};

export const getTypeIcon = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'task':
      return <AssessmentIcon />;
    case 'ticket':
      return <TrendingUpIcon />;
    case 'user':
      return <PersonIcon />;
    case 'department':
      return <BusinessIcon />;
    case 'custom':
      return <CustomIcon />;
    case 'quarterly':
      return <TrendingUpIcon />;
    case 'monthly':
      return <AssessmentIcon />;
    case 'weekly':
      return <ScheduleIcon />;
    case 'annual':
      return <BusinessIcon />;
    default:
      return <AssessmentIcon />;
  }
};

export const getTypeLabel = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'task':
      return 'Task Report';
    case 'ticket':
      return 'Ticket Report';
    case 'user':
      return 'User Report';
    case 'department':
      return 'Department Report';
    case 'custom':
      return 'Custom Report';
    case 'quarterly':
      return 'Quarterly Report';
    case 'monthly':
      return 'Monthly Report';
    case 'weekly':
      return 'Weekly Report';
    case 'annual':
      return 'Annual Report';
    default:
      return 'Report';
  }
};

export const filterReportsByUser = (reports, user) => {
  // For admin users, show all reports
  if (user.role === 'admin') {
    return reports;
  }
  
  // For other users, filter by generatedBy
  return reports.filter(report => {
    const matchesCurrentUser = report.generatedBy === user.firstname + ' ' + user.lastname || 
                              report.generatedBy === user.email ||
                              report.generatedBy === 'Current User' ||
                              report.generatedBy === 'Admin System';
    return matchesCurrentUser;
  });
};

export const filterReportsByCriteria = (reports, filters) => {
  const { reportTypeFilter, statusFilter } = filters;
  
  return reports.filter(report => {
    const matchesType = reportTypeFilter === 'all' || (report.type?.toLowerCase?.() || '') === reportTypeFilter;
    const matchesStatus = statusFilter === 'all' || (report.status?.toLowerCase?.() || '') === statusFilter;
    return matchesType && matchesStatus;
  });
};

export const getTabReports = (reports, activeTab) => {
  switch (activeTab) {
    case 0: // All Reports
      return reports;
    case 1: // Recent
      return reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reportDate >= weekAgo;
      });
    case 2: // Department Summary - This tab shows department summary, not reports
      return []; // Return empty array since this tab shows department summary instead of reports
    default:
      return reports;
  }
};

export const getInitialNewReport = (mockDepartments) => ({
  title: '', 
  type: 'task', 
  description: '',
  format: 'PDF',
  startDate: '',
  endDate: '',
  customParameters: {}
});

export const resetNewReport = (mockDepartments) => getInitialNewReport(mockDepartments);

// Admin-specific utility functions
export const validateReportParameters = (report, isAdmin) => {
  const errors = [];

  if (!report.title?.trim()) {
    errors.push('Report title is required');
  }

  if (!report.type) {
    errors.push('Report type is required');
  }

  if (!report.description?.trim()) {
    errors.push('Report description is required');
  }

  // Admin-specific validations
  if (isAdmin) {
    if (report.type === 'user' && !report.parameters?.userId) {
      errors.push('User selection is required for user reports');
    }

    if (report.type === 'department' && !report.parameters?.departmentId) {
      errors.push('Department selection is required for department reports');
    }

    if (report.startDate && report.endDate) {
      const start = new Date(report.startDate);
      const end = new Date(report.endDate);
      if (start > end) {
        errors.push('Start date must be before end date');
      }
    }
  }

  return errors;
};

export const formatReportData = (report) => {
  return {
    ...report,
    typeLabel: getTypeLabel(report.type),
    typeColor: getTypeColor(report.type),
    typeIcon: getTypeIcon(report.type),
    formattedDate: new Date(report.createdAt).toLocaleDateString(),
    formattedTime: new Date(report.createdAt).toLocaleTimeString(),
    isRecent: (new Date() - new Date(report.createdAt)) < (7 * 24 * 60 * 60 * 1000) // 7 days
  };
};

export const getReportSummary = (report) => {
  const baseSummary = {
    id: report.id,
    title: report.title,
    type: report.type,
    typeLabel: getTypeLabel(report.type),
    status: report.status,
    generatedBy: report.generatedBy,
    createdAt: report.createdAt,
    description: report.description
  };

  // Add type-specific summary
  switch (report.type) {
    case 'user':
      return {
        ...baseSummary,
        targetUser: report.parameters?.userName || 'Unknown User',
        targetUserId: report.parameters?.userId
      };
    case 'department':
      return {
        ...baseSummary,
        targetDepartment: report.parameters?.departmentName || 'Unknown Department',
        targetDepartmentId: report.parameters?.departmentId
      };
    case 'task':
      return {
        ...baseSummary,
        scope: report.parameters?.global ? 'Global' : 'Filtered',
        dateRange: report.parameters?.startDate && report.parameters?.endDate 
          ? `${report.parameters.startDate} to ${report.parameters.endDate}`
          : 'All Time'
      };
    case 'custom':
      return {
        ...baseSummary,
        customParams: report.parameters?.customParameters || {},
        hasCustomParams: Object.keys(report.parameters?.customParameters || {}).length > 0
      };
    default:
      return baseSummary;
  }
}; 