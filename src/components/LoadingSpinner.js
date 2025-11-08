import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Fade,
  Backdrop
} from '@mui/material';

const LoadingSpinner = ({ 
  size = 'medium',
  message = 'Loading...',
  fullScreen = false,
  overlay = false,
  color = 'primary'
}) => {
  const theme = useTheme();

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
    xlarge: 80
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const LoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        borderRadius: 2,
        backgroundColor: overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: overlay ? 'blur(4px)' : 'none',
        boxShadow: overlay ? theme.shadows[4] : 'none',
      }}
    >
      <CircularProgress 
        size={spinnerSize} 
        color={color}
        thickness={4}
      />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            textAlign: 'center',
            fontWeight: 500,
            maxWidth: 200
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        open={true}
      >
        <LoadingContent />
      </Backdrop>
    );
  }

  return (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: fullScreen ? '100vh' : '200px',
          width: '100%',
        }}
      >
        <LoadingContent />
      </Box>
    </Fade>
  );
};

export default LoadingSpinner; 