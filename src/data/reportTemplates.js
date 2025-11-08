// Report Templates Configuration
export const reportTemplates = {
  task: {
    name: 'Task Performance Report',
    description: 'Comprehensive analysis of task completion, productivity, and performance metrics',
    icon: 'Assessment',
    category: 'Performance',
    parameters: {
      dateRange: { required: true, type: 'daterange' },
      departmentId: { required: false, type: 'select', label: 'Department' },
      assignedTo: { required: false, type: 'select', label: 'Assigned To' },
      status: { required: false, type: 'multiselect', label: 'Status', options: ['pending', 'in_progress', 'completed', 'cancelled'] },
      priority: { required: false, type: 'multiselect', label: 'Priority', options: ['high', 'medium', 'low'] },
      includeComments: { required: false, type: 'boolean', label: 'Include Comments', default: true },
      includeAttachments: { required: false, type: 'boolean', label: 'Include Attachments', default: false }
    },
    sections: ['summary', 'trends', 'details', 'performance'],
    exportFormats: ['pdf', 'excel', 'csv'],
    scheduleOptions: ['weekly', 'monthly', 'quarterly']
  },

  user: {
    name: 'User Performance Report',
    description: 'Detailed analysis of individual user performance, productivity, and activity',
    icon: 'People',
    category: 'Performance',
    parameters: {
      dateRange: { required: true, type: 'daterange' },
      userId: { required: true, type: 'select', label: 'User' },
      includeActivity: { required: false, type: 'boolean', label: 'Include Activity Log', default: true },
      includeComments: { required: false, type: 'boolean', label: 'Include Comments', default: true },
      includeMetrics: { required: false, type: 'boolean', label: 'Include Performance Metrics', default: true }
    },
    sections: ['summary', 'performance', 'activity', 'trends'],
    exportFormats: ['pdf', 'excel'],
    scheduleOptions: ['monthly', 'quarterly']
  },

  department: {
    name: 'Department Analytics Report',
    description: 'Comprehensive department-level analytics including efficiency, workload, and team performance',
    icon: 'Business',
    category: 'Analytics',
    parameters: {
      dateRange: { required: true, type: 'daterange' },
      departmentId: { required: true, type: 'select', label: 'Department' },
      includeTeamMetrics: { required: false, type: 'boolean', label: 'Include Team Metrics', default: true },
      includeWorkload: { required: false, type: 'boolean', label: 'Include Workload Analysis', default: true },
      includeEfficiency: { required: false, type: 'boolean', label: 'Include Efficiency Metrics', default: true }
    },
    sections: ['summary', 'analytics', 'metrics', 'trends'],
    exportFormats: ['pdf', 'excel', 'csv'],
    scheduleOptions: ['weekly', 'monthly', 'quarterly']
  },

  custom: {
    name: 'Custom Report',
    description: 'Create a custom report with your own parameters and data selection',
    icon: 'TrendingUp',
    category: 'Custom',
    parameters: {
      dateRange: { required: true, type: 'daterange' },
      dataSources: { required: true, type: 'multiselect', label: 'Data Sources', options: ['tasks', 'users', 'departments', 'tickets'] },
      filters: { required: false, type: 'object', label: 'Custom Filters' },
      grouping: { required: false, type: 'select', label: 'Group By', options: ['none', 'department', 'user', 'status', 'priority'] },
      sorting: { required: false, type: 'select', label: 'Sort By', options: ['date', 'name', 'status', 'priority'] }
    },
    sections: ['summary', 'details', 'custom'],
    exportFormats: ['pdf', 'excel', 'csv'],
    scheduleOptions: ['weekly', 'monthly', 'quarterly', 'annual']
  }
};

// Report Categories
export const reportCategories = [
  {
    id: 'performance',
    name: 'Performance Reports',
    description: 'Reports focused on productivity and performance metrics',
    templates: ['task', 'user']
  },
  {
    id: 'analytics',
    name: 'Analytics Reports',
    description: 'Comprehensive analytics and insights reports',
    templates: ['department']
  },
  {
    id: 'custom',
    name: 'Custom Reports',
    description: 'User-defined custom reports',
    templates: ['custom']
  }
];

// Default Report Parameters
export const defaultReportParameters = {
  dateRange: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    endDate: new Date() // Today
  },
  format: 'pdf',
  includeCharts: true,
  includeTables: true,
  includeSummary: true
};

// Report Schedule Options
export const scheduleOptions = {
  weekly: {
    name: 'Weekly',
    description: 'Generate report every week',
    cron: '0 9 * * 1', // Every Monday at 9 AM
    frequency: 'weekly'
  },
  monthly: {
    name: 'Monthly',
    description: 'Generate report every month',
    cron: '0 9 1 * *', // First day of month at 9 AM
    frequency: 'monthly'
  },
  quarterly: {
    name: 'Quarterly',
    description: 'Generate report every quarter',
    cron: '0 9 1 */3 *', // First day of every 3rd month at 9 AM
    frequency: 'quarterly'
  },
  annual: {
    name: 'Annual',
    description: 'Generate report every year',
    cron: '0 9 1 1 *', // January 1st at 9 AM
    frequency: 'annual'
  }
};

// Export Format Options
export const exportFormats = {
  pdf: {
    name: 'PDF',
    description: 'Portable Document Format',
    icon: 'PictureAsPdf',
    mimeType: 'application/pdf',
    extension: 'pdf'
  },
  excel: {
    name: 'Excel',
    description: 'Microsoft Excel Spreadsheet',
    icon: 'TableChart',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx'
  },
  csv: {
    name: 'CSV',
    description: 'Comma-Separated Values',
    icon: 'TableChart',
    mimeType: 'text/csv',
    extension: 'csv'
  }
};

// Report Status Options
export const reportStatuses = {
  pending: {
    name: 'Pending',
    description: 'Report is queued for generation',
    color: 'warning',
    icon: 'Schedule'
  },
  generating: {
    name: 'Generating',
    description: 'Report is currently being generated',
    color: 'info',
    icon: 'Sync'
  },
  completed: {
    name: 'Completed',
    description: 'Report has been generated successfully',
    color: 'success',
    icon: 'CheckCircle'
  },
  failed: {
    name: 'Failed',
    description: 'Report generation failed',
    color: 'error',
    icon: 'Error'
  },
  scheduled: {
    name: 'Scheduled',
    description: 'Report is scheduled for automatic generation',
    color: 'primary',
    icon: 'Schedule'
  }
};

// Helper Functions
export const getReportTemplate = (templateId) => {
  return reportTemplates[templateId] || null;
};

export const getReportCategory = (categoryId) => {
  return reportCategories.find(cat => cat.id === categoryId) || null;
};

export const getScheduleOption = (scheduleId) => {
  return scheduleOptions[scheduleId] || null;
};

export const getExportFormat = (formatId) => {
  return exportFormats[formatId] || null;
};

export const getReportStatus = (statusId) => {
  return reportStatuses[statusId] || null;
};

export const validateReportParameters = (templateId, parameters) => {
  const template = getReportTemplate(templateId);
  if (!template) return { valid: false, errors: ['Invalid template'] };

  const errors = [];
  const templateParams = template.parameters;

  // Check required parameters
  Object.entries(templateParams).forEach(([key, config]) => {
    if (config.required && (!parameters[key] || parameters[key] === '')) {
      errors.push(`${config.label || key} is required`);
    }
  });

  // Validate date range
  if (parameters.dateRange) {
    const { startDate, endDate } = parameters.dateRange;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.push('Start date must be before end date');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const getDefaultParameters = (templateId) => {
  const template = getReportTemplate(templateId);
  if (!template) return defaultReportParameters;

  const defaults = { ...defaultReportParameters };
  
  // Set template-specific defaults
  Object.entries(template.parameters).forEach(([key, config]) => {
    if (config.default !== undefined) {
      defaults[key] = config.default;
    }
  });

  return defaults;
}; 