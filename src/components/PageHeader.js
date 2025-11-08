import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const PageHeader = ({ 
  title, 
  subtitle, 
  emoji, 
  color = 'primary',
  onRefresh,
  actionButton,
  children 
}) => {
  const theme = useTheme();
  
  const getGradientColors = (colorName) => {
    switch (colorName) {
      case 'primary':
        return [theme.palette.primary.main, theme.palette.primary.dark];
      case 'secondary':
        return [theme.palette.secondary.main, theme.palette.secondary.dark];
      case 'info':
        return [theme.palette.info.main, theme.palette.info.dark];
      case 'success':
        return [theme.palette.success.main, theme.palette.success.dark];
      case 'warning':
        return [theme.palette.warning.main, theme.palette.warning.dark];
      case 'error':
        return [theme.palette.error.main, theme.palette.error.dark];
      default:
        return [theme.palette.primary.main, theme.palette.primary.dark];
    }
  };

  const [startColor, endColor] = getGradientColors(color);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        mt: 2,
        background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
        color: 'white',
        borderRadius: 3
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            {title} {emoji}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onRefresh && (
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={onRefresh}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          {actionButton && (
            <Button
              variant="contained"
              startIcon={actionButton.icon}
              onClick={actionButton.onClick}
              disabled={actionButton.disabled}
              sx={{ 
                backgroundColor: 'white',
                color: startColor,
                fontWeight: 600,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
              }}
            >
              {actionButton.text}
            </Button>
          )}
          {children}
        </Box>
      </Box>
    </Paper>
  );
};

export default PageHeader; 