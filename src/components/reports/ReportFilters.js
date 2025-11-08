import React from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const ReportFilters = ({
  showFilters,
  setShowFilters,
  reportTypeFilter,
  setReportTypeFilter,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClearFilters = () => {
    setReportTypeFilter('');
    setStatusFilter('');
    setDateRange({ startDate: '', endDate: '' });
  };

  const hasActiveFilters = reportTypeFilter || dateRange.startDate || dateRange.endDate;

  return (
    <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: showFilters ? `1px solid ${theme.palette.divider}` : 'none'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: theme.palette.primary.main }} />
          <Box sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            Filters
            {hasActiveFilters && (
              <Box component="span" sx={{ 
                ml: 1, 
                px: 1, 
                py: 0.25, 
                bgcolor: theme.palette.primary.main, 
                color: 'white', 
                borderRadius: 1, 
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                Active
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {hasActiveFilters && (
            <IconButton
              size="small"
              onClick={handleClearFilters}
              sx={{ color: theme.palette.error.main }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              color: showFilters ? theme.palette.primary.main : theme.palette.text.secondary,
              transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'all 0.3s ease'
            }}
          >
            <FilterIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      <Collapse in={showFilters}>
        <Box sx={{ 
          p: 3, 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2
        }}>
          <FormControl fullWidth size="small">
            <InputLabel>Report Type</InputLabel>
            <Select
              label="Report Type"
              value={reportTypeFilter}
              onChange={(e) => setReportTypeFilter(e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="ticket">Ticket</MenuItem>
              <MenuItem value="task">Task</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="department">Department</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="Start Date"
            type="date"
            value={dateRange.startDate || ''}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            size="small"
            label="End Date"
            type="date"
            value={dateRange.endDate || ''}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ReportFilters; 