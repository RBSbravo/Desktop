// Report Generation Service
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://backend-ticketing-system.up.railway.app/api';

class ReportService {
  // Generate different types of reports
  async generateTicketReport(parameters) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(parameters)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate ticket report');
      return data;
    } catch (error) {
      console.error('Error generating ticket report:', error);
      throw error;
    }
  }

  async generateTaskReport(parameters) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(parameters)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate task report');
      return data;
    } catch (error) {
      console.error('Error generating task report:', error);
      throw error;
    }
  }

  async generateUserReport(parameters) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(parameters)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate user report');
      return data;
    } catch (error) {
      console.error('Error generating user report:', error);
      throw error;
    }
  }

  async generateDepartmentReport(parameters) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(parameters)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate department report');
      return data;
    } catch (error) {
      console.error('Error generating department report:', error);
      throw error;
    }
  }

  async generateCustomReport(parameters) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(parameters)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate custom report');
      return data;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error;
    }
  }

  // Export reports in different formats
  async exportReport(reportId, format = 'pdf') {
    try {
      // Only PDF format is supported by the backend
      if (format !== 'pdf') {
        throw new Error('Only PDF export is supported for reports.');
      }

      const res = await fetch(`${API_BASE_URL}/analytics/reports/${reportId}/export?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to export report');
      }

      const blob = await res.blob();
      return blob;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // Download report file
  async downloadReport(reportId, format = 'pdf', filename = null) {
    try {
      // Ensure only PDF format is used
      const exportFormat = 'pdf';
      const blob = await this.exportReport(reportId, exportFormat);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `report-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Report downloaded successfully' };
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  // Get report templates
  async getReportTemplates() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch report templates');
      return data;
    } catch (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }
  }

  // Schedule report generation
  async scheduleReport(scheduleData) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(scheduleData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule report');
      return data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  }

  // Get scheduled reports
  async getScheduledReports() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/scheduled`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch scheduled reports');
      return data;
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      throw error;
    }
  }

  // Cancel scheduled report
  async cancelScheduledReport(scheduleId) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/schedule/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel scheduled report');
      return data;
    } catch (error) {
      console.error('Error canceling scheduled report:', error);
      throw error;
    }
  }

  // Get report analytics and insights
  async getReportAnalytics(reportId) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/${reportId}/analytics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch report analytics');
      return data;
    } catch (error) {
      console.error('Error fetching report analytics:', error);
      throw error;
    }
  }

  // Get custom report by ID
  async getCustomReport(reportId) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch custom report');
      return data;
    } catch (error) {
      console.error('Error fetching custom report:', error);
      throw error;
    }
  }

  // Generate report preview
  async generateReportPreview(parameters) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reports/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(parameters)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report preview');
      return data;
    } catch (error) {
      console.error('Error generating report preview:', error);
      throw error;
    }
  }

  // Get report history
  async getReportHistory(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE_URL}/analytics/reports/history?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch report history');
      return data;
    } catch (error) {
      console.error('Error fetching report history:', error);
      throw error;
    }
  }

  // Validate report parameters
  validateReportParameters(parameters, reportType) {
    const errors = [];

    // Common validations
    if (!parameters.startDate || !parameters.endDate) {
      errors.push('Start date and end date are required');
    }

    if (parameters.startDate && parameters.endDate) {
      const start = new Date(parameters.startDate);
      const end = new Date(parameters.endDate);
      if (start > end) {
        errors.push('Start date must be before end date');
      }
    }

    // Type-specific validations
    switch (reportType) {
      case 'ticket':
        if (!parameters.departmentId && !parameters.assignedTo) {
          errors.push('Either department or assigned user must be specified for ticket reports');
        }
        break;
      case 'task':
        if (!parameters.departmentId && !parameters.assignedTo) {
          errors.push('Either department or assigned user must be specified for task reports');
        }
        break;
      case 'user':
        if (!parameters.userId) {
          errors.push('User ID is required for user reports');
        }
        break;
      case 'department':
        if (!parameters.departmentId) {
          errors.push('Department ID is required for department reports');
        }
        break;
      default:
        break;
    }

    return errors;
  }

  // Format report data for display
  formatReportData(data, reportType) {
    switch (reportType) {
      case 'ticket':
        return this.formatTicketReportData(data);
      case 'task':
        return this.formatTaskReportData(data);
      case 'user':
        return this.formatUserReportData(data);
      case 'department':
        return this.formatDepartmentReportData(data);
      default:
        return data;
    }
  }

  formatTicketReportData(data) {
    return {
      summary: {
        totalTickets: data.totalTickets || 0,
        resolvedTickets: data.resolvedTickets || 0,
        pendingTickets: data.pendingTickets || 0,
        inProgressTickets: data.inProgressTickets || 0,
        declinedTickets: data.declinedTickets || 0,
        resolutionRate: data.resolutionRate || 0,
        averageResolutionTime: data.averageResolutionTime || 0,
      },
      statusBreakdown: data.statusBreakdown || [],
      priorityBreakdown: data.priorityBreakdown || [],
      details: data.details || []
    };
  }

  formatTaskReportData(data) {
    return {
      summary: {
        totalTasks: data.totalTasks || 0,
        completedTasks: data.completedTasks || 0,
        pendingTasks: data.pendingTasks || 0,
        overdueTasks: data.overdueTasks || 0,
        completionRate: data.completionRate || 0
      },
      trends: data.trends || [],
      details: data.details || []
    };
  }

  formatUserReportData(data) {
    return {
      summary: {
        totalTasks: data.totalTasks || 0,
        completedTasks: data.completedTasks || 0,
        productivityScore: data.productivityScore || 0,
        averageResponseTime: data.averageResponseTime || 0
      },
      performance: data.performance || [],
      activity: data.activity || []
    };
  }

  formatDepartmentReportData(data) {
    return {
      summary: {
        totalEmployees: data.totalEmployees || 0,
        activeEmployees: data.activeEmployees || 0,
        departmentEfficiency: data.departmentEfficiency || 0,
        averageTaskCompletionTime: data.averageTaskCompletionTime || 0
      },
      analytics: data.analytics || [],
      metrics: data.metrics || []
    };
  }
}

export default new ReportService(); 