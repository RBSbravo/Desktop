// User utility functions for formatting, validation, and display
import passwordValidator from './passwordValidator';

export const getDefaultFormData = () => ({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  role: 'employee',
  department: '',
  status: 'pending'
});

export const getRoleOptions = () => [
  { value: 'employee', label: 'Employee' },
  { value: 'department_head', label: 'Department Head' }
];

export const getDepartmentOptions = (departments = []) => {
  if (departments.length > 0) {
    return departments.map(dept => ({
      value: dept.id,
      label: dept.name
    }));
  }
  // Fallback options if no departments provided
  return [
    { value: 'IT Department', label: 'IT Department' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Customer Service', label: 'Customer Service' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' }
  ];
};

export const getStatusOptions = () => [
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' }
];

export const getUserInitials = (user) => {
  if (!user) return '?';
  const firstName = user.firstname || user.firstName || '';
  const lastName = user.lastname || user.lastName || '';
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  } else if (firstName) {
    return firstName.charAt(0);
  } else if (lastName) {
    return lastName.charAt(0);
  }
  return '?';
};

export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown';
  if (typeof user === 'string') return user;
  const firstName = user.firstname || user.firstName || '';
  const lastName = user.lastname || user.lastName || '';
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }
  return user.email || user.username || 'Unknown';
};

export const getDisplayRole = (role) => {
  switch (role) {
    case 'department_head':
      return 'Department Head';
    case 'employee':
      return 'Employee';
    case 'admin':
      return 'Administrator';
    default:
      return role;
  }
};

export const getRoleColor = (role) => {
  switch (role) {
    case 'department_head':
      return 'warning';
    case 'employee':
      return 'info';
    case 'admin':
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'active':
    case 'approved':
      return 'success';
    case 'inactive':
    case 'rejected':
      return 'default';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

export const getUserDepartment = (user) => {
  if (!user) return 'No Department';
  return user.Department?.name || user.department?.name || user.departmentId || 'No Department';
};

export const validateUserForm = (formData) => {
  const errors = {};
  // Only validate personal info on create; on edit, those fields are disabled
  if (!formData.id) {
    if (!formData.firstname || formData.firstname.trim() === '') {
      errors.firstname = 'First name is required';
    }
    if (!formData.lastname || formData.lastname.trim() === '') {
      errors.lastname = 'Last name is required';
    }
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = passwordValidator.validate(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
      }
    }
  }
  if (!formData.role) {
    errors.role = 'Role is required';
  }
  if (!formData.department) {
    errors.department = 'Department is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const prepareUserData = (formData, editingUser = null) => {
  const userData = {
    // Do not allow changing identity fields on edit
    firstname: editingUser ? editingUser.firstname : formData.firstname,
    lastname: editingUser ? editingUser.lastname : formData.lastname,
    email: editingUser ? editingUser.email : formData.email,
    password: editingUser ? undefined : formData.password,
    role: formData.role,
    departmentId: formData.department, // <-- fix here
    status: formData.status || 'pending'
  };
  if (editingUser) {
    return { ...editingUser, ...userData };
  }
  return userData;
};

// (Re-add all other user utility functions here as in previous modularization step) 