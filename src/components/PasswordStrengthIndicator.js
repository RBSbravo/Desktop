import React, { useState } from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import passwordValidator from '../utils/passwordValidator';

const PasswordStrengthIndicator = ({ password, showSuggestions = true, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const validation = passwordValidator.validate(password || '');
  const strength = validation.strength;
  const errors = validation.errors;
  const suggestions = passwordValidator.getSuggestions(errors);

  const getStrengthColor = () => {
    if (strength < 30) return 'error';
    if (strength < 50) return 'warning';
    if (strength < 70) return 'info';
    if (strength < 90) return 'primary';
    return 'success';
  };

  const getStrengthDescription = () => {
    if (strength < 30) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 70) return 'Fair';
    if (strength < 90) return 'Good';
    return 'Strong';
  };

  const getRequirements = () => [
    {
      label: 'At least 8 characters',
      met: password && password.length >= 8,
      icon: password && password.length >= 8 ? CheckIcon : CancelIcon
    },
    {
      label: 'Contains uppercase letter',
      met: password && /[A-Z]/.test(password),
      icon: password && /[A-Z]/.test(password) ? CheckIcon : CancelIcon
    },
    {
      label: 'Contains lowercase letter',
      met: password && /[a-z]/.test(password),
      icon: password && /[a-z]/.test(password) ? CheckIcon : CancelIcon
    },
    {
      label: 'Contains number',
      met: password && /\d/.test(password),
      icon: password && /\d/.test(password) ? CheckIcon : CancelIcon
    },
    {
      label: 'Contains special character',
      met: password && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
      icon: password && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password) ? CheckIcon : CancelIcon
    }
  ];

  if (!password) {
    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Enter a password to see strength indicator
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Collapsible Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" color="text.secondary">
            Password Strength:
          </Typography>
          <Chip
            label={getStrengthDescription()}
            color={getStrengthColor()}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        <IconButton
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ p: 0.5 }}
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Always visible strength bar */}
      <LinearProgress
        variant="determinate"
        value={strength}
        color={getStrengthColor()}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(0,0,0,0.1)',
          mb: 1,
          '& .MuiLinearProgress-bar': {
            borderRadius: 3
          }
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
        {strength}% strength
      </Typography>

      {/* Collapsible detailed content */}
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 2 }}>
          {/* Requirements Checklist */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Requirements:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {getRequirements().map((req, index) => (
                <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <req.icon
                      sx={{
                        fontSize: 16,
                        color: req.met ? 'success.main' : 'error.main'
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: req.met ? 'success.main' : 'error.main',
                          fontWeight: req.met ? 500 : 400
                        }}
                      >
                        {req.label}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Suggestions:
              </Typography>
              <List dense sx={{ py: 0 }}>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CancelIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="warning.main">
                          {suggestion}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PasswordStrengthIndicator;
