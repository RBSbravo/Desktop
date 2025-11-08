import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Box,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Description as ReportsIcon,
  ConfirmationNumber as TicketsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Apartment as DepartmentsIcon,
} from '@mui/icons-material';
import mitoLogo from '../assets/mito_logo.png';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/app/dashboard' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/app/analytics' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/app/reports' },
  { text: 'Tickets', icon: <TicketsIcon />, path: '/app/tickets' },
  { text: 'Users', icon: <UsersIcon />, path: '/app/users' },
  { text: 'Departments', icon: <DepartmentsIcon />, path: '/app/departments' },
];

const bottomMenuItems = [
  { text: 'Settings', icon: <SettingsIcon />, path: '/app/settings' },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const renderLogo = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(46, 125, 50, 0.04)' : 'rgba(76, 175, 80, 0.04)',
      }}
    >
      <Box
        component="img"
        src={mitoLogo}
        alt="Logo"
        sx={{
          width: 32,
          height: 32,
          marginRight: 1,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
          fontSize: '1.2rem',
        }}
      >
        Hello Admin
      </Typography>
    </Box>
  );

  const renderMenuItems = (items) => (
    <List>
      {items.map((item, idx) => {
        const isSelected = location.pathname === item.path;
        // Add dividers after Dashboard and Users for grouping
        let divider = null;
        if (item.text === 'Dashboard' || item.text === 'Users') {
          divider = <Divider sx={{ my: 1 }} />;
        }
        return (
          <React.Fragment key={item.text}>
            {divider}
            <ListItem disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        );
      })}
    </List>
  );

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar />
      {renderLogo}
      <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        {renderMenuItems(menuItems)}
        <Divider sx={{ my: 1 }} />
      </Box>
      <Divider sx={{ my: 1 }} />
      {renderMenuItems(bottomMenuItems)}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 