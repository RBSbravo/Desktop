import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2e7d32', // Forest green
      light: '#4caf50', // Regular green
      dark: '#1b5e20', // Dark green
      contrastText: '#fff',
    },
    secondary: {
      main: '#66bb6a', // Light green
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'light' ? '#f8faf8' : '#0a120a',
      paper: mode === 'light' ? '#ffffff' : '#1a211a',
    },
    text: {
      primary: mode === 'light' ? '#1c2a1c' : '#ffffff',
      secondary: mode === 'light' ? '#455a64' : '#b0bec5',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", "Roboto", "Helvetica Neue", Arial, "Liberation Sans", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(46,125,50,0.15)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 240,
          backgroundColor: mode === 'light' ? '#ffffff' : '#1a211a',
          borderRight: 'none',
          boxShadow: mode === 'light' 
            ? '1px 0 2px rgba(0,0,0,0.05)' 
            : '1px 0 2px rgba(255,255,255,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1a211a',
          color: mode === 'light' ? '#1c2a1c' : '#ffffff',
          boxShadow: mode === 'light' 
            ? '0 1px 2px rgba(0,0,0,0.05)' 
            : '0 1px 2px rgba(255,255,255,0.05)',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
          boxShadow: 'none',
          transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
          '&:hover': {
            borderColor: mode === 'light' ? 'rgba(46,125,50,0.2)' : 'rgba(76,175,80,0.2)',
            boxShadow: mode === 'light'
              ? '0 4px 8px rgba(46,125,50,0.1)'
              : '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#66bb6a' : '#4caf50',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2e7d32',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${mode === 'light' ? '#e8f5e9' : '#243024'}`,
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'light' ? '#f8faf8' : '#1a211a',
          color: mode === 'light' ? '#1c2a1c' : '#ffffff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          padding: '8px 16px',
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? '#e8f5e9' : '#243024',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#c8e6c9' : '#2e3c2e',
            },
          },
          '&:hover': {
            backgroundColor: mode === 'light' ? '#f1f8f1' : '#202820',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? '#455a64' : '#b0bec5',
          minWidth: 40,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default getTheme; 