export const mockUsers = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@company.ph',
    role: 'Department Head',
    department: 'Head Office',
    location: 'Makati City',
    avatar: '/avatars/juan.jpg',
    description: 'Lead IT administrator overseeing all system operations.'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@company.ph',
    role: 'Department Head',
    department: 'IT Office',
    location: 'Quezon City',
    avatar: '/avatars/maria.jpg',
    description: 'Project manager for digital transformation initiatives.'
  },
  {
    id: 3,
    name: 'Pedro Reyes',
    email: 'pedro.reyes@company.ph',
    role: 'Employee',
    department: 'IT Office',
    location: 'Cebu City',
    avatar: '/avatars/pedro.jpg',
    description: 'Full-stack developer for internal systems.'
  },
  {
    id: 4,
    name: 'Ana Magsaysay',
    email: 'ana.magsaysay@company.ph',
    role: 'Department Head',
    department: 'HR Office',
    location: 'Manila',
    avatar: '/avatars/ana.jpg',
    description: 'Human Resources manager overseeing recruitment and employee welfare.'
  },
  {
    id: 5,
    name: 'Ramon Bonifacio',
    email: 'ramon.bonifacio@company.ph',
    role: 'Department Head',
    department: 'Finance Office',
    location: 'Makati City',
    avatar: '/avatars/ramon.jpg',
    description: 'Finance manager handling payroll, budget, and financial reports.'
  },
  {
    id: 6,
    name: 'Isabella Rizal',
    email: 'isabella.rizal@company.ph',
    role: 'Department Head',
    department: 'Operations Office',
    location: 'Quezon City',
    avatar: '/avatars/isabella.jpg',
    description: 'Operations manager ensuring smooth business operations.'
  },
  {
    id: 7,
    name: 'Carlos Garcia',
    email: 'carlos.garcia@company.ph',
    role: 'Department Head',
    department: 'Marketing Office',
    location: 'Manila',
    avatar: '/avatars/carlos.jpg',
    description: 'Marketing manager handling promotions and branding.'
  },
  {
    id: 8,
    name: 'Sofia Martinez',
    email: 'sofia.martinez@company.ph',
    role: 'Employee',
    department: 'IT Office',
    location: 'Davao City',
    avatar: '/avatars/sofia.jpg',
    description: 'System analyst working on business process optimization.'
  },
  {
    id: 9,
    name: 'Miguel Torres',
    email: 'miguel.torres@company.ph',
    role: 'Employee',
    department: 'HR Office',
    location: 'Cebu City',
    avatar: '/avatars/miguel.jpg',
    description: 'HR specialist handling recruitment and training programs.'
  },
  {
    id: 10,
    name: 'Carmen Rodriguez',
    email: 'carmen.rodriguez@company.ph',
    role: 'Employee',
    department: 'Finance Office',
    location: 'Manila',
    avatar: '/avatars/carmen.jpg',
    description: 'Accountant managing financial records and reports.'
  }
];

export const mockDepartments = [
  { id: 1, name: 'Head Office', head: 'Juan Dela Cruz', employeeCount: 20, description: 'Ang sentro ng pamamahala at koordinasyon ng lahat ng opisina.' },
  { id: 2, name: 'IT Office', head: 'Maria Santos', employeeCount: 15, description: 'Namamahala sa teknolohiya, system maintenance, at digital security.' },
  { id: 3, name: 'HR Office', head: 'Ana Magsaysay', employeeCount: 8, description: 'Tumututok sa recruitment, training, at employee welfare.' },
  { id: 4, name: 'Finance Office', head: 'Ramon Bonifacio', employeeCount: 12, description: 'Nag-aasikaso ng payroll, budget, at financial reports.' },
  { id: 5, name: 'Operations Office', head: 'Isabella Rizal', employeeCount: 18, description: 'Tinitiyak ang maayos na daloy ng operasyon at serbisyo.' },
  { id: 6, name: 'Marketing Office', head: 'Carlos Garcia', employeeCount: 10, description: 'Namamahala sa promosyon, branding, at komunikasyon ng kumpanya.' }
];

export const mockTasks = [
  {
    id: 'TSK-001',
    title: 'Deploy Barangay Management System',
    description: 'Set up and deploy the new barangay management system for local government units.',
    assignee: 'Juan Dela Cruz',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-03-30'
  },
  {
    id: 'TSK-002',
    title: 'Update Jeepney Route Mapping',
    description: 'Update the digital mapping system for modernized jeepney routes in Metro Manila.',
    assignee: 'Maria Santos',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2024-04-15'
  },
  {
    id: 'TSK-003',
    title: 'Implement E-Tricycle Payment System',
    description: 'Develop a digital payment system for e-tricycle services in Pasig City.',
    assignee: 'Pedro Reyes',
    status: 'Completed',
    priority: 'High',
    dueDate: '2024-03-20'
  }
];

export const mockTickets = [
  {
    id: 'TKT-001',
    title: 'System Access Issue - Palawan Branch',
    description: 'Users in Palawan branch unable to access the main system. Network connectivity seems to be intermittent and affecting productivity.',
    reporter: 'Maria Santos',
    assignee: 'Juan Dela Cruz',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-03-15',
    office: 'IT Office'
  },
  {
    id: 'TKT-002',
    title: 'Printer Configuration - Davao Office',
    description: 'New printer setup needed for Davao regional office. Current printer is not compatible with the updated system.',
    reporter: 'Pedro Reyes',
    assignee: 'Juan Dela Cruz',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2024-03-18',
    office: 'IT Office'
  }
];

// Sample file attachments for tickets
export const mockTicketFiles = {
  'TKT-001': [
    {
      id: 'FILE-001',
      name: 'network_diagram.pdf',
      size: 2048576, // 2MB
      type: 'application/pdf',
      uploadedAt: '2024-03-15T10:30:00Z',
      uploadedBy: 'Maria Santos',
      ticketId: 'TKT-001',
      url: '#'
    },
    {
      id: 'FILE-002',
      name: 'error_screenshot.png',
      size: 512000, // 512KB
      type: 'image/png',
      uploadedAt: '2024-03-15T11:15:00Z',
      uploadedBy: 'Maria Santos',
      ticketId: 'TKT-001',
      url: '#'
    }
  ],
  'TKT-002': [
    {
      id: 'FILE-003',
      name: 'printer_specs.docx',
      size: 1536000, // 1.5MB
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: '2024-03-18T09:45:00Z',
      uploadedBy: 'Pedro Reyes',
      ticketId: 'TKT-002',
      url: '#'
    }
  ]
};

export const mockAnalytics = {
  taskCompletion: {
    labels: ['January', 'February', 'March'],
    data: [65, 78, 82]
  },
  departmentPerformance: {
    labels: ['Head Office', 'IT Office', 'HR Office', 'Finance Office', 'Operations Office', 'Marketing Office'],
    data: [95, 92, 78, 88, 85, 82]
  },
  regionalDistribution: {
    labels: ['Head Office', 'IT Office', 'HR Office', 'Finance Office', 'Operations Office', 'Marketing Office'],
    data: [30, 20, 10, 15, 15, 10]
  },
  ticketStatus: {
    labels: ['Open', 'In Progress', 'Closed'],
    data: [12, 7, 21]
  },
  ticketPriority: {
    labels: ['High', 'Medium', 'Low'],
    data: [10, 18, 12]
  },
  ticketMonthly: {
    labels: ['January', 'February', 'March'],
    data: [8, 15, 17]
  }
};

export const mockNotifications = [
  {
    id: 1,
    type: 'task',
    message: 'New task assigned: Update Sari-sari Store POS System',
    timestamp: '2024-03-20T09:00:00Z',
    read: false
  },
  {
    id: 2,
    type: 'ticket',
    message: 'Urgent ticket from Baguio Office: Network Connectivity Issues',
    timestamp: '2024-03-20T08:30:00Z',
    read: true
  },
  {
    id: 3,
    type: 'system',
    message: 'System maintenance scheduled for Undas holiday',
    timestamp: '2024-03-19T15:00:00Z',
    read: false
  }
];

export const mockPendingUsers = [
  {
    id: 101,
    name: 'Ana Magsaysay',
    email: 'ana.magsaysay@company.ph',
    role: 'HR Specialist',
    department: 'HR Office',
    location: 'Taguig City',
    requestedAt: '2024-03-25',
    description: 'Specialist in employee relations and recruitment.'
  },
  {
    id: 102,
    name: 'Ramon Bonifacio',
    email: 'ramon.bonifacio@company.ph',
    role: 'Accountant',
    department: 'Finance Office',
    location: 'Makati City',
    requestedAt: '2024-03-26',
    description: 'Handles payroll and finance reports.'
  }
]; 