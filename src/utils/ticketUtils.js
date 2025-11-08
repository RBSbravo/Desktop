import {
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  ConfirmationNumber as TicketIcon,
  PriorityHigh as PriorityHighIcon,
  Remove as PriorityMediumIcon,
  LowPriority as PriorityLowIcon,
} from '@mui/icons-material';

// Date formatting utilities
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    // Format as MM/DD/YYYY for better readability
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    // Format as MM/DD/YYYY HH:MM AM/PM
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'N/A';
  }
};

// Status color utilities
export const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'in_progress':
    case 'in progress':
      return 'primary';
    case 'completed':
      return 'success';
    case 'declined':
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusIcon = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return <ScheduleIcon sx={{ fontSize: { md: 14, lg: 18 } }} />;
    case 'in_progress':
    case 'in progress':
      return <ScheduleIcon sx={{ fontSize: { md: 14, lg: 18 } }} />;
    case 'completed':
      return <CheckCircleIcon sx={{ fontSize: { md: 14, lg: 18 } }} />;
    case 'declined':
      return <ErrorIcon sx={{ fontSize: { md: 14, lg: 18 } }} />;
    default:
      return <TicketIcon sx={{ fontSize: { md: 14, lg: 18 } }} />;
  }
};

// Priority utilities
export const getPriorityColor = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

export const getPriorityIcon = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high':
      return <PriorityHighIcon sx={{ fontSize: { md: 12, lg: 16 } }} />;
    case 'medium':
      return <PriorityMediumIcon sx={{ fontSize: { md: 12, lg: 16 } }} />;
    case 'low':
      return <PriorityLowIcon sx={{ fontSize: { md: 12, lg: 16 } }} />;
    default:
      return <PriorityMediumIcon sx={{ fontSize: { md: 12, lg: 16 } }} />;
  }
};

// Ticket maturity utilities
export const getTicketMaturityColor = (ticket) => {
  const now = new Date();
  const createdDate = new Date(ticket.created_at || ticket.createdAt);
  const dueDate = ticket.due_date ? new Date(ticket.due_date) : null;
  const status = (ticket.status || '').toLowerCase();
  
  // If ticket is completed or declined, no maturity color needed
  if (status === 'completed' || status === 'declined') {
    return null;
  }
  
  // If due date is past, automatically red
  if (dueDate && dueDate < now) {
    return 'error';
  }
  
  // Only calculate maturity for in_progress tickets
  if (status === 'in_progress' || status === 'in progress') {
    const hoursInProgress = (now - createdDate) / (1000 * 60 * 60);
    
    if (hoursInProgress <= 72) {
      return 'success'; // Green - within 72 hours
    } else if (hoursInProgress <= 72 + (3 * 24)) { // 72 hours + 3 days = 144 hours
      return 'warning'; // Orange - above 3 days
    } else {
      return 'error'; // Red - above 10 days (144 + 7*24 = 312 hours)
    }
  }
  
  // For pending tickets, check due date proximity
  if (status === 'pending' && dueDate) {
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 0) {
      return 'error'; // Past due
    } else if (hoursUntilDue <= 24) {
      return 'error'; // Due within 24 hours
    } else if (hoursUntilDue <= 72) {
      return 'warning'; // Due within 3 days
    }
  }
  
  return null; // No maturity color
};

export const getTicketMaturityText = (ticket) => {
  const now = new Date();
  const createdDate = new Date(ticket.created_at || ticket.createdAt);
  const dueDate = ticket.due_date ? new Date(ticket.due_date) : null;
  const status = (ticket.status || '').toLowerCase();
  
  // If ticket is completed or declined, no maturity text
  if (status === 'completed' || status === 'declined') {
    return null;
  }
  
  // If due date is past
  if (dueDate && dueDate < now) {
    const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
    return `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
  }
  
  // For in_progress tickets
  if (status === 'in_progress' || status === 'in progress') {
    const hoursInProgress = (now - createdDate) / (1000 * 60 * 60);
    
    if (hoursInProgress <= 72) {
      return 'Fresh'; // Within 72 hours
    } else if (hoursInProgress <= 72 + (3 * 24)) {
      return 'Aging'; // Above 3 days
    } else {
      return 'Stale'; // Above 10 days
    }
  }
  
  // For pending tickets with due date
  if (status === 'pending' && dueDate) {
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 0) {
      const daysOverdue = Math.floor(Math.abs(hoursUntilDue) / 24);
      return `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
    } else if (hoursUntilDue <= 24) {
      return 'Due Soon';
    } else if (hoursUntilDue <= 72) {
      return 'Due in 3 days';
    }
  }
  
  return null;
};

// Data filtering utilities
export const filterTickets = (tickets, forwardedTickets, searchQuery, filter, activeTab, userId) => {
  const sentTickets = tickets.filter(ticket => 
    ticket.creator?.id === userId || ticket.created_by === userId
  );
  const receivedTickets = tickets.filter(ticket => 
    ticket.assignee?.id === userId || 
    ticket.assigned_to === userId ||
    ticket.forwarded_to_id === userId ||
    ticket.current_handler_id === userId
  );

  let currentTickets;
  switch (activeTab) {
    case 0: // Sent tickets
      currentTickets = sentTickets;
      break;
    case 1: // Received tickets
      currentTickets = receivedTickets;
      break;
    case 2: // Forwarded tickets - tickets that the user has forwarded to others
      currentTickets = tickets.filter(ticket => 
        ticket.forwarded_from_id === userId || 
        ticket.creator?.id === userId && ticket.is_forwarded
      );
      break;
    default:
      currentTickets = sentTickets;
  }

  return currentTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (ticket.creator ? `${ticket.creator.firstname} ${ticket.creator.lastname}` : '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || ticket.status.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });
};

// Data formatting utilities
export const formatTicketData = (ticket, departments) => {
  // Format the date properly for the input field
  let formattedDueDate = '';
  if (ticket.due_date) {
    try {
      const date = new Date(ticket.due_date);
      if (!isNaN(date.getTime())) {
        formattedDueDate = date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  }

  // Ensure the assignee value is valid or empty
  let validAssignee = '';
  if (ticket.assigned_to || ticket.assignedTo) {
    const assigneeId = ticket.assigned_to || ticket.assignedTo;
    // Check if this assignee exists in the departments list (department heads)
    const departmentHead = departments.find(dept => dept.head?.id === assigneeId);
    validAssignee = departmentHead ? assigneeId : '';
  }

  return {
    id: ticket.id,
    title: ticket.title || '',
    description: ticket.description || '',
    priority: ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : 'Medium',
    status: ticket.status || 'open',
    sendTo: validAssignee,
    due_date: formattedDueDate,
    departmentId: ticket.departmentId || ticket.department_id || '',
    assignee: ticket.assignee || '',
    desired_action: ticket.desired_action || '',
    remarks: ticket.remarks || ''
  };
};

export const prepareTicketPayload = (ticketData, isAdmin, currentUserProfile) => {
  const payload = {
    title: ticketData.title.trim(),
    description: ticketData.description.trim(),
    priority: ticketData.priority.toLowerCase(),
    status: ticketData.status || 'open'
  };

  // Only include assigned_to for new tickets, not for updates
  if (!ticketData.id && ticketData.sendTo) {
    payload.assigned_to = ticketData.sendTo;
  }

  // Include ID if it exists (for updates)
  if (ticketData.id) {
    payload.id = ticketData.id;
  }

  if (ticketData.due_date) {
    payload.due_date = ticketData.due_date;
  }

  // Add desired_action field
  if (ticketData.desired_action) {
    payload.desired_action = ticketData.desired_action;
  }

  // Add remarks field for updates
  if (ticketData.remarks) {
    payload.remarks = ticketData.remarks;
  }

  // Add department_id - use selected department or user's department
  if (ticketData.departmentId) {
    payload.department_id = ticketData.departmentId;
  } else if (!isAdmin && currentUserProfile?.departmentId) {
    // For non-admin users, use their department if no specific department selected
    payload.department_id = currentUserProfile.departmentId;
  } else if (isAdmin) {
    // For admin users, department_id can be null - don't add it to payload
  } else {
    // For non-admin users without department, this will cause an error
    throw new Error('Department ID is required for non-admin users.');
  }

  return payload;
};

// Validation utilities
export const validateTicketData = (ticketData, isUpdate = false) => {
  const errors = [];

  if (!ticketData.title?.trim()) {
    errors.push('Ticket title is required.');
  }
  if (!ticketData.description?.trim()) {
    errors.push('Ticket description is required.');
  }
  if (!ticketData.priority) {
    errors.push('Please select a priority level.');
  }
  // Only require sendTo for new tickets, not for updates
  if (!isUpdate && !ticketData.sendTo) {
    errors.push('Please select who to send the ticket to.');
  }
  if (!ticketData.desired_action) {
    errors.push('Please select a desired action.');
  }

  // Additional validation for updates
  if (isUpdate && !ticketData.id) {
    errors.push('Ticket ID is required for updates.');
  }
  if (isUpdate && !ticketData.remarks?.trim()) {
    errors.push('Remarks are required when updating a ticket. Please provide remarks explaining the changes made.');
  }

  return errors;
};

// File handling utilities
export const createTempFile = (file, user) => {
  return {
    id: `temp-${Date.now()}-${Math.random()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    file: file, // Store the actual file object
    uploadedAt: new Date().toISOString(),
    uploadedBy: user.firstname + ' ' + user.lastname
  };
};

export const downloadTempFile = (file) => {
  if (file && file.file) {
    // Create a download link for the file
    const url = URL.createObjectURL(file.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}; 