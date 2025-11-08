import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip,
  TextField
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { formatFileSize } from '../utils/fileUtils';

const FileUpload = ({ 
  files = [], 
  onFileUpload, 
  onFileDelete, 
  onFileDownload,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['*/*'],
  disabled = false,
  readOnly = false,
  loading = false,
  uploading = false,
  entityType = 'general', // 'ticket', 'task', 'comment', or 'general'
  entityId = null // Add entityId prop to determine if we're updating existing entity
}) => {
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [downloadFileObj, setDownloadFileObj] = useState(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState('image');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [pdfLoadFailed, setPdfLoadFailed] = useState(false);
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [pendingFileOperation, setPendingFileOperation] = useState(null); // 'upload' or 'delete'
  const [pendingFileData, setPendingFileData] = useState(null);

  const validateFile = (file) => {
    if (files.length >= maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return false;
    }
    
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${formatFileSize(maxFileSize)}`);
      return false;
    }

    // Set file type restrictions based on entity type
    let finalAcceptedTypes = acceptedTypes;
    if ((entityType === 'ticket' || entityType === 'task') && acceptedTypes[0] === '*/*') {
      // For tickets and tasks, restrict to PDF and images only
      finalAcceptedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp'
      ];
    }

    if (finalAcceptedTypes.length > 0 && finalAcceptedTypes[0] !== '*/*') {
      const isValidType = finalAcceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        if (entityType === 'ticket' || entityType === 'task') {
          setError('Only PDF and image files are allowed');
        } else {
          setError(`File type not supported. Allowed: ${finalAcceptedTypes.join(', ')}`);
        }
        return false;
      }
    }

    return true;
  };

  const handleFileChange = useCallback(async (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    
      if (!validateFile(file)) {
      return;
    }

    try {
        await onFileUpload(file);
      } catch (error) {
        setError('Failed to upload file');
    }
  }, [files.length, maxFiles, maxFileSize, acceptedTypes, onFileUpload]);

  const handleDelete = (fileId) => {
    setDeleteId(fileId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await onFileDelete(deleteId);
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (error) {
      setError('Failed to delete file');
    }
  };

  const handleDownloadClick = (file) => {
    setDownloadFileObj(file);
    setDownloadDialogOpen(true);
  };

  const confirmDownload = async () => {
    if (downloadFileObj) {
      try {
        await onFileDownload(downloadFileObj.id);
      } catch (error) {
        setError('Failed to download file');
      }
    }
    setDownloadDialogOpen(false);
    setDownloadFileObj(null);
  };

  const handleViewFile = async (file) => {
    try {
      const fullUrl = `${process.env.REACT_APP_API_BASE_URL || 'https://backend-ticketing-system.up.railway.app/api'}/files/${file.id}/download`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Check if the response is HTML (which indicates an error)
      if (blob.type === 'text/html') {
        throw new Error('Backend returned HTML instead of file. Check server logs.');
      }

      const url = URL.createObjectURL(blob);
      
      // Determine file type for preview
      let type = blob.type;
      const fileName = file.file_name || file.name || '';
      const ext = fileName.split('.').pop().toLowerCase();
      
      // Fallback: check file extension if type is missing
      if (!type || type === 'application/octet-stream') {
        if (["jpg","jpeg","png","gif","bmp","webp"].includes(ext)) {
          type = 'image/' + ext;
        } else if (ext === 'pdf') {
          type = 'application/pdf';
        } else if (["txt","csv","json","md","log"].includes(ext)) {
          type = 'text/plain';
        }
      }

      setPreviewUrl(url);
      setPreviewText('');
      setPreviewError('');

      if (type.startsWith('image/')) {
        setPreviewType('image');
      } else if (type === 'application/pdf') {
        setPreviewType('pdf');
      } else if (type.startsWith('text/') || ["txt","csv","json","md","log"].includes(ext)) {
        const text = await blob.text();
        setPreviewText(text);
        setPreviewType('text');
      } else {
        setPreviewType('unsupported');
      }
      
      setPreviewOpen(true);
    } catch (error) {
      setPreviewError(error.message);
      setPreviewType('error');
      setPreviewOpen(true);
    }
  };

  // Helper for date display
  const getFileDate = (f) => {
    const dateStr = f.uploadedAt || f.createdAt || f.created_at;
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '—' : d.toLocaleString();
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Attachments
      </Typography>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <List dense sx={{ 
          maxHeight: 200, 
          overflowY: 'auto', 
          mb: 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {files.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No attachments yet.
            </Typography>
          )}
          {files.map((file) => {
            const fileName = file.file_name || file.name || 'Unknown File';
            
            return (
              <React.Fragment key={file.id}>
                <ListItem
                  secondaryAction={
                    !readOnly && (
                      <Tooltip title="Delete file" arrow>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDelete(file.id)}
                          color="error"
                          size="small"
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'error.light',
                              color: 'error.contrastText'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <ListItemIcon>
                    <FileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Tooltip title="Click to download or view file" arrow>
                        <Typography
                          component="span"
                          sx={{ 
                            cursor: 'pointer', 
                            color: 'primary.main', 
                            textDecoration: 'underline',
                            '&:hover': { textDecoration: 'none' }
                          }}
                          onClick={() => handleDownloadClick(file)}
                        >
                          {fileName}
                        </Typography>
                      </Tooltip>
                    }
                    secondary={
                      <Typography variant="caption" color="text.disabled">
                        {getFileDate(file)} • {formatFileSize(file.file_size || file.size || 0)}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
        </List>
      )}

      {!readOnly && (
        <React.Fragment>
          <Button
            variant="outlined"
            component="label"
            startIcon={<AttachFileIcon />}
            disabled={disabled || uploading}
            sx={{ mt: 1 }}
          >
            {uploading ? 'Uploading...' : (entityType === 'ticket' || entityType === 'task') ? 'Upload File (PDF & Images Only)' : 'Upload File'}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept={(entityType === 'ticket' || entityType === 'task') ? '.pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,application/pdf,image/*' : acceptedTypes.join(',')}
              disabled={disabled || uploading}
            />
          </Button>
          
          {/* File type info for tickets and tasks */}
          {(entityType === 'ticket' || entityType === 'task') && (
            <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
              Allowed file types: PDF, JPG, PNG, GIF, WebP, BMP (Max 10MB each)
            </Box>
          )}
        </React.Fragment>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete this file?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onClose={() => setDownloadDialogOpen(false)}>
        <DialogTitle>Download this file?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDownloadDialogOpen(false)}>Cancel</Button>
          <Button 
            startIcon={<ViewIcon />} 
            onClick={() => handleViewFile(downloadFileObj)} 
            disabled={!downloadFileObj}
          >
            View
          </Button>
          <Button 
            variant="contained" 
            onClick={confirmDownload} 
            disabled={!downloadFileObj}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => { 
          setPreviewOpen(false); 
          setPreviewUrl(null); 
          setPreviewType(null); 
          setPreviewText(''); 
          setPreviewError(''); 
          setPdfLoadFailed(false);
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {previewType === 'image' && previewUrl && (
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: 500, display: 'block', margin: '0 auto' }} 
            />
          )}
          {previewType === 'pdf' && previewUrl && (
            <Box sx={{ width: '100%', height: 500, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
              size="small" 
                  onClick={() => window.open(previewUrl, '_blank')}
                >
                  Open in New Tab
                </Button>
                <Button 
              variant="outlined" 
                  size="small"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = previewUrl;
                    a.download = 'document.pdf';
                    a.click();
                  }}
                >
                  Download
                </Button>
              </Box>
              {!pdfLoadFailed ? (
                <Box sx={{ flex: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: 'hidden' }}>
                  <iframe 
                    src={`${previewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                    title="PDF Preview" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    onError={() => {
                      setPdfLoadFailed(true);
                    }}
                    onLoad={() => {
                      setPdfLoadFailed(false);
                    }}
            />
          </Box>
              ) : (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      PDF Preview Unavailable
                </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      The PDF could not be displayed in the preview. Please use the buttons above to view or download the file.
                </Typography>
              </Box>
                </Box>
              )}
            </Box>
          )}
          {previewType === 'text' && previewText && (
            <Box sx={{ 
              width: '100%', 
              maxHeight: 500, 
              overflow: 'auto', 
              bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', 
              p: 2, 
              borderRadius: 2,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 14 }}>{previewText}</pre>
            </Box>
          )}
          {previewType === 'unsupported' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Preview not available for this file type
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = previewUrl;
                  a.download = 'file';
                  a.click();
                }}
              >
                Download File
              </Button>
            </Box>
          )}
          {previewType === 'error' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography color="error" gutterBottom>Error loading file: {previewError}</Typography>
              <Button 
                variant="outlined" 
                onClick={() => window.open(previewUrl, '_blank')}
              >
                Try Opening in New Tab
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { 
            setPreviewOpen(false); 
            setPreviewUrl(null); 
            setPreviewType(null); 
            setPreviewText(''); 
            setPreviewError(''); 
          }}>
            Close
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload; 