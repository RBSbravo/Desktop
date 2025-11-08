import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  LinearProgress,
  Button,
  Collapse,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Close as CloseIcon,
  AccessTime as TimeIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { desktopRateLimitHandler } from '../utils/rateLimitHandler';

const DesktopRateLimitAlert = ({ 
  isOpen, 
  onClose, 
  rateLimitData, 
  endpoint,
  onRetry 
}) => {
  const theme = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen || !rateLimitData) return;

    const retryTime = desktopRateLimitHandler.calculateRetryTime(rateLimitData);
    const totalTime = retryTime;
    let remainingTime = retryTime;

    const timer = setInterval(() => {
      remainingTime -= 1000;
      setTimeRemaining(remainingTime);
      
      const progressPercent = Math.max(0, (remainingTime / totalTime) * 100);
      setProgress(progressPercent);

      if (remainingTime <= 0) {
        clearInterval(timer);
        setTimeRemaining(0);
        setProgress(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, rateLimitData]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const handleRetry = () => {
    if (timeRemaining <= 0) {
      desktopRateLimitHandler.clearRetryTimer(endpoint);
      onRetry?.();
      onClose?.();
    }
  };

  if (!isOpen || !rateLimitData) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        fontWeight: 600,
        color: theme.palette.warning.main,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WarningIcon />
        Rate Limit Exceeded
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {desktopRateLimitHandler.getUserFriendlyMessage(rateLimitData)}
        </Typography>

        {timeRemaining > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TimeIcon fontSize="small" color="warning" />
              <Typography variant="body2" color="text.secondary">
                Retry available in: {formatTime(timeRemaining)}
              </Typography>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.warning.main,
                }
              }}
            />
          </Box>
        )}

        {timeRemaining <= 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="success.main">
              ✓ You can now retry your request
            </Typography>
          </Box>
        )}

        {rateLimitData.limit && (
          <Typography variant="caption" color="text.secondary">
            Limit: {rateLimitData.limit} requests per {rateLimitData.retryAfter}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
            }
          }}
        >
          Close
        </Button>
        {timeRemaining <= 0 && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 600,
            }}
          >
            Retry Now
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DesktopRateLimitAlert;

