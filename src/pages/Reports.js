import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  Fab,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useReports } from '../hooks/useReports';
import PageHeader from '../components/PageHeader';
import ReportCard from '../components/reports/ReportCard';
import ReportFilters from '../components/reports/ReportFilters';
import DepartmentSummaryFilters from '../components/reports/DepartmentSummaryFilters';
import NewReportDialog from '../components/reports/NewReportDialog';
import ReportViewDialog from '../components/reports/ReportViewDialog';
import DepartmentSummary from '../components/reports/DepartmentSummary';
import reportService from '../services/reportService';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning';
import { getTypeColor, getTypeIcon, getTypeLabel } from '../utils/reportUtils';

// Utility functions
const getReportTarget = (report) => {
  const { type, parameters, title } = report;
  
  switch (type) {
    case 'user':
      return parameters?.userName || 
             extractFromTitle(title, 'User Report -') || 
             'User Report';
    case 'department':
      return parameters?.departmentName || 
             extractFromTitle(title, 'Department Report -') || 
             'Department Report';
    case 'task':
    case 'ticket':
      return parameters?.global ? 'All Departments' : 'Filtered';
    case 'custom':
      return 'Custom Scope';
    default:
      return 'N/A';
  }
};

const extractFromTitle = (title, pattern) => {
  if (!title || !title.includes(pattern)) return null;
  const match = title.match(new RegExp(`${pattern} (.+?) -`));
  return match ? match[1] : null;
};

// Table styling constants
const getTableStyles = (theme) => ({
  container: {
    borderRadius: 3,
    boxShadow: 3,
    overflowX: 'auto',
    width: '100%',
    bgcolor: theme.palette.background.paper,
    '&::-webkit-scrollbar': { height: 8 },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.action.hover,
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.action.disabled,
      borderRadius: 4,
      '&:hover': { backgroundColor: theme.palette.action.active },
    },
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    bgcolor: theme.palette.background.paper,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  cell: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: { md: '0.92rem', lg: '1rem' },
    borderBottom: '2px solid',
    borderColor: theme.palette.divider,
    px: { md: 0.5, lg: 2 },
  },
  row: (idx, theme) => ({
    bgcolor: idx % 2 === 0 ? theme.palette.background.default : theme.palette.background.paper,
    transition: 'background 0.2s',
    '&:hover': { bgcolor: theme.palette.action.hover },
    cursor: 'pointer',
  }),
});

// Mobile Card Component
const ReportMobileCard = ({ report, theme, onView, onDelete, onDownload, isAdmin }) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      bgcolor: theme.palette.background.paper,
      cursor: 'pointer',
      '&:hover': { bgcolor: theme.palette.action.hover },
    }}
    onClick={() => onView(report)}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Avatar
        sx={{ 
          width: 40, 
          height: 40, 
          bgcolor: theme.palette[getTypeColor(report.type)]?.main || theme.palette.primary.main,
          mr: 2,
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        {getTypeIcon(report.type)}
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
          {report.title}
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
          {getReportTarget(report)}
        </Typography>
      </Box>
    </Box>
    
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      <Chip
        label={getTypeLabel(report.type)}
        size="small"
        color={getTypeColor(report.type)}
        icon={getTypeIcon(report.type)}
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
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Typography variant="caption" color="text.secondary">
        {new Date(report.createdAt).toLocaleString()}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="View Report">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onView(report);
            }}
            size="small"
            sx={{ color: theme.palette.primary.main }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDownload(report);
            }}
            size="small"
            sx={{ color: theme.palette.info.main }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {isAdmin && (
          <Tooltip title="Delete">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(report.id);
              }}
              size="small"
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  </Paper>
);

// Action Buttons Component
const ReportActionButtons = ({ report, onView, onDelete, onDownload, isAdmin, theme }) => (
  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
    <Tooltip title="View Report">
      <span>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onView(report);
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
    <Tooltip title="Download">
      <span>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDownload(report);
          }}
          size="small"
          sx={{
            color: theme.palette.info.main,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: theme.palette.info.light },
            p: 0.5
          }}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
    {isAdmin && (
      <Tooltip title="Delete">
        <span>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(report.id);
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
    )}
  </Box>
);

// ReportTable Component
const ReportTable = ({ reports, isAdmin, onView, onDelete, onDownload, isMobile = false }) => {
  const theme = useTheme();
  const styles = getTableStyles(theme);

  // Mobile card layout
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {reports.map((report) => (
          <ReportMobileCard
            key={report.id}
            report={report}
            theme={theme}
            onView={onView}
            onDelete={onDelete}
            onDownload={onDownload}
            isAdmin={isAdmin}
          />
        ))}
      </Box>
    );
  }

  // Desktop table layout
  return (
    <TableContainer component={Paper} sx={styles.container}>
      <Table size="medium" sx={{ width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={styles.header}>
            <TableCell sx={{ ...styles.cell, maxWidth: 200, minWidth: 150 }}>
              Report
            </TableCell>
            <TableCell sx={{ ...styles.cell, width: 100, minWidth: 80 }}>
              Type
            </TableCell>
            <TableCell sx={{ ...styles.cell, minWidth: 120, maxWidth: 200 }}>
              Target
            </TableCell>
            <TableCell sx={{ ...styles.cell, minWidth: 100, maxWidth: 150 }}>
              Generated By
            </TableCell>
            <TableCell sx={{ ...styles.cell, minWidth: 120, maxWidth: 180 }}>
              Created
            </TableCell>
            <TableCell sx={{ ...styles.cell, minWidth: 120, maxWidth: 180, whiteSpace: 'nowrap' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report, idx) => (
            <TableRow 
              key={report.id} 
              hover 
              sx={styles.row(idx, theme)}
              onClick={() => onView(report)}
            >
              <TableCell align="center" sx={{ maxWidth: 200, minWidth: 150, px: { md: 0.5, lg: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <Avatar
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: theme.palette[getTypeColor(report.type)]?.main || theme.palette.primary.main,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {getTypeIcon(report.type)}
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
                    {report.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ width: 100, minWidth: 80, px: { md: 0.5, lg: 2 } }}>
                <Chip
                  label={getTypeLabel(report.type)}
                  size="small"
                  color={getTypeColor(report.type)}
                  icon={getTypeIcon(report.type)}
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
              <TableCell align="center" sx={{ maxWidth: 200, minWidth: 120, px: { md: 0.5, lg: 2 } }}>
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
                  {getReportTarget(report)}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ maxWidth: 150, minWidth: 100, px: { md: 0.5, lg: 2 } }}>
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
                  {report.generatedBy}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ maxWidth: 180, minWidth: 120, px: { md: 0.5, lg: 2 } }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  noWrap 
                  sx={{ 
                    fontSize: { md: '0.7rem', lg: '0.75rem' }, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap', 
                    textAlign: 'center' 
                  }}
                >
                  {new Date(report.createdAt).toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 120, maxWidth: 180, px: { md: 0.5, lg: 2 }, whiteSpace: 'nowrap' }}>
                <ReportActionButtons 
                  report={report}
                  onView={onView}
                  onDelete={onDelete}
                  onDownload={onDownload}
                  isAdmin={isAdmin}
                  theme={theme}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // All Reports filter state (match DepartmentSummaryFilters styling)
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [reportTypeFilter, setReportTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  
  // Department summary filter state
  const [deptSummaryStartDate, setDeptSummaryStartDate] = useState('');
  const [deptSummaryEndDate, setDeptSummaryEndDate] = useState('');
  const [showDeptSummaryFilters, setShowDeptSummaryFilters] = useState(false);

  const {
    // State
    reports,
    loading,
    error,
    isNewReportDialogOpen,
    newReport,
    activeTab,
    viewDialogOpen,
    selectedReport,
    isAdmin,
    users,
    departments,
    selectedUserId,
    selectedDepartmentId,
    
    // Actions
    setActiveTab,
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
    reportData,
    reportLoading
  } = useReports();

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Filtering logic
  const filteredReports = reports.filter(report => {
    const type = (report.type || '').toLowerCase();
    const matchesType = !reportTypeFilter || type === reportTypeFilter.toLowerCase();
    const matchesStatus = !statusFilter || (report.status || '').toLowerCase() === statusFilter.toLowerCase();
    const createdAt = new Date(report.createdAt);
    let matchesDate = true;
    if (dateRange.startDate) {
      matchesDate = matchesDate && createdAt >= new Date(dateRange.startDate);
    }
    if (dateRange.endDate) {
      matchesDate = matchesDate && createdAt <= new Date(dateRange.endDate);
    }
    return matchesType && matchesStatus && matchesDate;
  });

  const handleDownloadReport = async (report) => {
    try {
      if (!report || !report.id) {
        console.error('Invalid report object provided for download');
        return;
      }
      // Only PDF export is supported by the backend
      const safeTitle = report.title ? report.title.replace(/[^a-zA-Z0-9]/g, '_') : `report_${report.id}`;
      const filename = `${safeTitle}.pdf`;
      await reportService.downloadReport(report.id, 'pdf', filename);
      showSnackbar('Report exported successfully!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      showSnackbar('Failed to export report.', 'error');
    }
  };

  // Add helper to show snackbar
  const showSnackbar = (message, severity = 'info') => {
    window.dispatchEvent(new CustomEvent('show_snackbar', { detail: { message, severity } }));
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate and manage comprehensive reports"
        emoji="📊"
        color="secondary"
        actionButton={isAdmin ? {
          icon: <AddIcon />,
          text: "New Report",
          onClick: () => setIsNewReportDialogOpen(true),
          disabled: loading
        } : null}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filters and Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary" 
          textColor="primary" 
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 600, 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minHeight: { xs: 48, sm: 56 }
            } 
          }}
        >
          <Tab label="All Reports" />
          <Tab label="Department Summary" />
        </Tabs>
      </Paper>

      {/* Filtering UI - Only show for All Reports tab, styled like Department Summary */}
      {activeTab === 0 && (
        <ReportFilters
          showFilters={showAllFilters}
          setShowFilters={setShowAllFilters}
          reportTypeFilter={reportTypeFilter}
          setReportTypeFilter={setReportTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}

      {/* Content based on active tab */}
      {activeTab === 1 ? (
        // Department Summary Tab
        <>
          <DepartmentSummaryFilters
            showFilters={showDeptSummaryFilters}
            setShowFilters={setShowDeptSummaryFilters}
            startDate={deptSummaryStartDate}
            setStartDate={setDeptSummaryStartDate}
            endDate={deptSummaryEndDate}
            setEndDate={setDeptSummaryEndDate}
          />
          <DepartmentSummary 
            startDate={deptSummaryStartDate}
            endDate={deptSummaryEndDate}
          />
        </>
      ) : (
        // Reports Grid for All Reports tab
        <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : filteredReports.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220, width: '100%' }}>
          <AssessmentIcon sx={{ fontSize: 64, color: theme.palette.action.disabled }} />
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            No reports found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {'No reports available.'}
          </Typography>
        </Box>
      ) : (
        <ReportTable
          reports={filteredReports}
          isAdmin={isAdmin}
          onView={handleViewReport}
          onDelete={(id) => setConfirmDeleteId(id)}
          onDownload={handleDownloadReport}
          isMobile={isMobile}
        />
          )}
        </>
      )}

      {/* New Report Dialog */}
      <NewReportDialog
        open={isNewReportDialogOpen}
        onClose={handleCloseNewReportDialog}
        newReport={newReport}
        onNewReportChange={handleNewReportChange}
        onAddReport={handleAddReport}
        loading={loading}
        isAdmin={isAdmin}
        users={users}
        departments={departments}
        selectedUserId={selectedUserId}
        selectedDepartmentId={selectedDepartmentId}
        onSelectedUserIdChange={setSelectedUserId}
        onSelectedDepartmentIdChange={setSelectedDepartmentId}
      />

      {/* Report View Dialog */}
      <ReportViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        reportData={reportData}
        reportType={selectedReport?.type}
        loading={reportLoading}
        selectedReport={selectedReport}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this report? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)} variant="outlined">Cancel</Button>
          <Button onClick={() => { handleDeleteReport(confirmDeleteId); setConfirmDeleteId(null); }} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports; 