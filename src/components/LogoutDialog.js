import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  Fade,
  Slide,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const LogoutDialog = ({ open, onClose, onConfirm }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          backdropFilter: 'blur(10px)',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(33, 33, 33, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
        }
      }}
    >
      <Fade in={open} timeout={600}>
        <Box>
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              pb: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              <WarningIcon 
                sx={{ 
                  color: theme.palette.warning.main,
                  fontSize: 28,
                }} 
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Confirm Logout
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Are you sure you want to sign out?
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <LogoutIcon 
                sx={{ 
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                  fontSize: 20,
                }} 
              />
              <Box>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  You're about to sign out of your account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  This will end your current session and you'll need to sign in again to access your account. 
                  Any unsaved work may be lost.
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              gap: 2,
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              color="warning"
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(255, 152, 0, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Sign Out
            </Button>
          </DialogActions>
        </Box>
      </Fade>
    </Dialog>
  );
};

export default LogoutDialog; 