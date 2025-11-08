import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  useTheme,
  Divider,
  Backdrop,
  Fade,
  Slide,
  Snackbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  AccountCircle,
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import LogoutDialog from '../components/LogoutDialog';
import NotificationContainer from '../components/NotificationContainer';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchUnreadNotificationCount } from '../services/api';
import { connectSocket, disconnectSocket, getSocket, connectSocketWithAuth } from '../services/socket';
import MuiAlert from '@mui/material/Alert';

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch unread count on mount
    const loadUnreadCount = async () => {
      try {
        const count = await fetchUnreadNotificationCount();
        setUnreadCount(count);
      } catch {
        setUnreadCount(0);
      }
    };
    loadUnreadCount();

    // Connect to socket for real-time notifications
    const socket = connectSocketWithAuth(user.id, (payload) => {
      const notification = payload.data || payload;
      setUnreadCount((prev) => prev + 1);
      setSnackbarMessage(notification.message || 'You have a new notification');
      setSnackbarOpen(true);
      setNotifications((prev) => [notification, ...prev]);
    });

    // Real-time: tickets
    socket.on('ticket_update', (ticket) => {
      window.dispatchEvent(new CustomEvent('ticket_update', { detail: ticket }));
    });

    // Real-time: tasks
    socket.on('task_update', (task) => {
      window.dispatchEvent(new CustomEvent('task_update', { detail: task }));
    });

    // Real-time: comments
    socket.on('new_comment', (comment) => {
      window.dispatchEvent(new CustomEvent('new_comment', { detail: comment }));
    });

    // Real-time: users
    socket.on('user_update', (user) => {
      window.dispatchEvent(new CustomEvent('user_update', { detail: user }));
    });

    // Listen for custom snackbar events
    const handleShowSnackbar = (e) => {
      const { message, severity = 'info' } = e.detail || {};
      setSnackbarMessage(message || '');
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    };
    window.addEventListener('show_snackbar', handleShowSnackbar);

    return () => {
      window.removeEventListener('show_snackbar', handleShowSnackbar);
      disconnectSocket();
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = () => {
    setNotificationDrawerOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setNotificationDrawerOpen(false);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setLogoutDialogOpen(false);

    // Simulate logout process
    setTimeout(() => {
      setLogoutSuccess(true);
      
      // Clear user data
      localStorage.removeItem('user');
      
      // Show success state briefly before redirect
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 2000); // 2 second delay to show logout process
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Ticketing and Task Management System
          </Typography>

          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton color="inherit" onClick={handleNotificationsMenu} sx={{ mr: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minHeight: 0,
          width: { sm: `calc(100% - 240px)` },
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ height: (theme) => theme.mixins.toolbar.minHeight || 64 }} />
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0,
            overflowY: 'auto',
            p: 3,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            '& .MuiMenuItem-root': {
              fontSize: 16,
              fontWeight: 500,
              px: 2.5,
              py: 1.5,
              borderRadius: 1,
              transition: 'background 0.2s',
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(76,175,80,0.08)'
                    : 'rgba(56,142,60,0.08)',
              },
            },
          },
        }}
      >
        <MenuItem disabled sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0.5,
          py: 2,
          cursor: 'default',
          opacity: 1,
          background: 'none',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 36, height: 36, mr: 1 }}>
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1 }}>
                {user.firstname + ' ' + user.lastname || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                {user.email || 'user@email.com'}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={() => navigate('/app/settings')}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={() => setLogoutDialogOpen(true)}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <NotificationContainer
        open={notificationDrawerOpen}
        onClose={handleNotificationsClose}
        onUnreadCountChange={setUnreadCount}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} elevation={6} variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Professional Logout Loading Backdrop */}
      {(logoutLoading || logoutSuccess) && (
        <Backdrop
          sx={{
            color: theme.palette.common.white,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
          open={true}
        >
          <Fade in={true} timeout={500}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                p: 4,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                maxWidth: 400,
                textAlign: 'center',
              }}
            >
              {logoutLoading ? (
                <>
                  <LoadingSpinner 
                    size="xlarge" 
                    message="Signing out..." 
                    color="primary"
                  />
                  <Slide direction="up" in={true} timeout={800}>
                    <Box>
                      <Box
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          mb: 1,
                          color: 'white',
                        }}
                      >
                        Logging Out
                      </Box>
                      <Box
                        sx={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.5,
                        }}
                      >
                        Please wait while we securely sign you out and clear your session...
                      </Box>
                    </Box>
                  </Slide>
                </>
              ) : logoutSuccess ? (
                <>
                  <Slide direction="down" in={true} timeout={600}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'successPulse 0.8s ease-in-out',
                          '@keyframes successPulse': {
                            '0%': { transform: 'scale(0.8)', opacity: 0 },
                            '50%': { transform: 'scale(1.1)' },
                            '100%': { transform: 'scale(1)', opacity: 1 },
                          },
                        }}
                      >
                        <Box
                          component="svg"
                          sx={{
                            width: 40,
                            height: 40,
                            color: theme.palette.success.main,
                          }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          fontSize: '1.3rem',
                          fontWeight: 600,
                          color: 'white',
                          mb: 1,
                        }}
                      >
                        Successfully Logged Out
                      </Box>
                      <Box
                        sx={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.5,
                        }}
                      >
                        Your session has been securely terminated. Redirecting to login page...
                      </Box>
                    </Box>
                  </Slide>
                </>
              ) : null}
            </Box>
          </Fade>
        </Backdrop>
      )}
    </Box>
  );
};

export default AuthenticatedLayout; 