/**
 * Legacy API service layer - maintains backward compatibility
 * This file re-exports from the new modular structure
 */

// Re-export everything from the new modular API
export * from './api/index.js';

// Re-export utilities that were previously in this file
export { getFileIcon, formatFileSize } from '../utils/fileUtils.js'; 