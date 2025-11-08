/**
 * Central API exports - maintains backward compatibility while providing new modular structure
 */

// Import all services
import { authService } from './auth.js';
import { departmentsService } from './departments.js';
import { usersService } from './users.js';
import { ticketsService } from './tickets.js';
import { tasksService } from './tasks.js';
import { filesService } from './files.js';
import { commentsService } from './comments.js';
import { analyticsService } from './analytics.js';
import { reportsService } from './reports.js';
import { notificationsService } from './notifications.js';

// Backward compatibility exports (individual functions)
// Auth
export const login = authService.login;
export const registerAdmin = authService.registerAdmin;
export const changePassword = authService.changePassword;
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;

// Departments
export const fetchDepartments = departmentsService.getDepartments;
export const getDepartments = departmentsService.getDepartments;
export const addDepartment = departmentsService.addDepartment;
export const updateDepartment = departmentsService.updateDepartment;
export const deleteDepartment = departmentsService.deleteDepartment;

// Users
export const fetchUsers = usersService.getUsers;
export const getUsers = usersService.getUsers;
export const fetchPendingUsers = usersService.getPendingUsers;
export const fetchCurrentUserProfile = usersService.getCurrentUserProfile;
export const addUser = usersService.addUser;
export const updateUser = usersService.updateUser;
export const deleteUser = usersService.deleteUser;
export const approvePendingUser = usersService.approvePendingUser;
export const rejectPendingUser = usersService.rejectPendingUser;

// Tickets
export const fetchTickets = ticketsService.getTickets;
export const addTicket = ticketsService.addTicket;
export const updateTicket = ticketsService.updateTicket;
export const deleteTicket = ticketsService.deleteTicket;
export const forwardTicket = ticketsService.forwardTicket;
export const getTicketsForwardedToMe = ticketsService.getTicketsForwardedToMe;

// Tasks
export const fetchTasks = tasksService.getTasks;
export const addTask = tasksService.addTask;
export const updateTask = tasksService.updateTask;
export const deleteTask = tasksService.deleteTask;

// Files
export const fetchFiles = filesService.getFiles;
export const uploadFile = filesService.uploadFile;
export const deleteFile = filesService.deleteFile;
export const downloadFile = filesService.downloadFile;

// Comments
export const fetchComments = commentsService.getComments;
export const addComment = commentsService.addComment;
export const deleteComment = commentsService.deleteComment;

// Analytics
export const fetchAnalytics = analyticsService.getAnalytics;
export const getDashboardStats = analyticsService.getDashboardStats;
export const getDepartmentAnalytics = analyticsService.getDepartmentAnalytics;
export const getUserPerformance = analyticsService.getUserPerformance;

// Reports
export const fetchReports = reportsService.getReports;
export const addReport = reportsService.addReport;
export const updateReport = reportsService.updateReport;
export const deleteReport = reportsService.deleteReport;

// Notifications
export const fetchNotifications = notificationsService.getNotifications;
export const fetchUnreadNotifications = notificationsService.getUnreadNotifications;
export const fetchUnreadNotificationCount = notificationsService.getUnreadNotificationCount;
export const markNotificationAsRead = notificationsService.markNotificationAsRead;
export const markAllNotificationsAsRead = notificationsService.markAllNotificationsAsRead;
export const deleteNotification = notificationsService.deleteNotification;

// Unified API object for easier imports (new preferred way)
export const api = {
  // Auth
  auth: authService,
  
  // Services
  departments: departmentsService,
  users: usersService,
  tickets: ticketsService,
  tasks: tasksService,
  files: filesService,
  comments: commentsService,
  analytics: analyticsService,
  reports: reportsService,
  notifications: notificationsService,
  
  // Backward compatibility methods
  login: authService.login,
  registerAdmin: authService.registerAdmin,
  changePassword: authService.changePassword,
  forgotPassword: authService.forgotPassword,
  resetPassword: authService.resetPassword,
  
  getDepartments: departmentsService.getDepartments,
  addDepartment: departmentsService.addDepartment,
  updateDepartment: departmentsService.updateDepartment,
  deleteDepartment: departmentsService.deleteDepartment,
  
  getUsers: usersService.getUsers,
  getPendingUsers: usersService.getPendingUsers,
  getCurrentUserProfile: usersService.getCurrentUserProfile,
  addUser: usersService.addUser,
  updateUser: usersService.updateUser,
  deleteUser: usersService.deleteUser,
  approvePendingUser: usersService.approvePendingUser,
  rejectPendingUser: usersService.rejectPendingUser,
  
  getTickets: ticketsService.getTickets,
  addTicket: ticketsService.addTicket,
  updateTicket: ticketsService.updateTicket,
  deleteTicket: ticketsService.deleteTicket,
  forwardTicket: ticketsService.forwardTicket,
  getTicketsForwardedToMe: ticketsService.getTicketsForwardedToMe,
  
  getTasks: tasksService.getTasks,
  addTask: tasksService.addTask,
  updateTask: tasksService.updateTask,
  deleteTask: tasksService.deleteTask,
  
  getFiles: filesService.getFiles,
  uploadFile: filesService.uploadFile,
  deleteFile: filesService.deleteFile,
  downloadFile: filesService.downloadFile,
  
  getComments: commentsService.getComments,
  addComment: commentsService.addComment,
  deleteComment: commentsService.deleteComment,
  
  getAnalytics: analyticsService.getAnalytics,
  getDashboardStats: analyticsService.getDashboardStats,
  getDepartmentAnalytics: analyticsService.getDepartmentAnalytics,
  getUserPerformance: analyticsService.getUserPerformance,
  
  getReports: reportsService.getReports,
  addReport: reportsService.addReport,
  updateReport: reportsService.updateReport,
  deleteReport: reportsService.deleteReport,
  
  getNotifications: notificationsService.getNotifications,
  getUnreadNotifications: notificationsService.getUnreadNotifications,
  getUnreadNotificationCount: notificationsService.getUnreadNotificationCount,
  markNotificationAsRead: notificationsService.markNotificationAsRead,
  markAllNotificationsAsRead: notificationsService.markAllNotificationsAsRead,
  deleteNotification: notificationsService.deleteNotification
};

// Export individual services for those who prefer direct imports
export { 
  authService,
  departmentsService,
  usersService,
  ticketsService,
  tasksService,
  filesService,
  commentsService,
  analyticsService,
  reportsService,
  notificationsService
}; 