/**
 * File utility functions
 */

// Get file icon based on file type
export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.startsWith('video/')) return 'video_file';
  if (fileType.startsWith('audio/')) return 'audio_file';
  if (fileType.includes('pdf')) return 'picture_as_pdf';
  if (fileType.includes('word') || fileType.includes('document')) return 'description';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'table_chart';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'slideshow';
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return 'folder_zip';
  return 'insert_drive_file';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 