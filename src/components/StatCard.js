import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = 'primary',
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: theme.palette[color].main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette[color].contrastText,
          boxShadow: theme.shadows[4],
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ pt: 5 }}>
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: '0.875rem' }}
        >
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color:
                trend > 0
                  ? theme.palette.success.main
                  : theme.palette.error.main,
            }}
          >
            <Typography variant="body2">
              {trend > 0 ? '+' : ''}
              {trend}% {trendLabel}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard; 