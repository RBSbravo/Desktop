import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';

const TicketFilters = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter,
  isMobile 
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: { xs: 3, sm: 4, md: 5 }, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{ mb: 2,
            '& .MuiTab-root': {
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              fontWeight: 600,
              textTransform: 'none',
              minHeight: { xs: 44, sm: 52 },
            },
            '& .Mui-selected': {
              color: 'primary.main',
            },
          }}
        >
          <Tab label={isMobile ? 'Sent' : 'Sent Tickets'} />
          <Tab label={isMobile ? 'Received' : 'Received Tickets'} />
          <Tab label={isMobile ? 'Forwarded' : 'Forwarded by Me'} />
        </Tabs>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filter}
                label="Status"
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="declined">Declined</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TicketFilters; 