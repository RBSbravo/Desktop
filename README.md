# Desktop App - Ticketing and Task Management System

A modern Electron-based desktop application for comprehensive ticketing and task management, built with React and Material-UI. Features a responsive interface, fully integrated with a Node.js backend API.

## 🚀 Features

### Core Functionality

- **User Authentication** - Secure login system with backend integration
- **Dashboard** - Real-time overview with key metrics and statistics
- **Task Management** - Create, assign, and track tasks with priority levels
- **Ticket System** - Comprehensive support ticket management with:
  - Create, read, update, and delete (CRUD) operations
  - File upload and attachment system
  - Comment system with real-time updates
  - Priority and status management
  - Department-specific assignment
  - **Forward Ticket** - Forward tickets to other users or departments with proper comment tracking and UI
  - **Ticket Date Maturity Indicator** - Visual indicator (color-coded) for ticket age and due date status, integrated into the due date cell
  - **Update Remarks** - Every ticket update now supports remarks/comments, which are tracked and displayed in the ticket's comment history
  - Professional dialogs and error handling
- **User Management** - Employee directory and role management
  - Admins can remove users with a professional confirmation dialog
  - Remove User action is only visible to admins (role: `admin`)
  - All user and department data is fetched from the backend
  - **Add/Edit User form now has separate First Name and Last Name fields**
  - **Password is required when adding a user**
  - **Status field has been removed from the form**
  - **Department dropdown only shows available departments**
  - **Add and Delete user actions now show a loading spinner and a success message**
  - **Delete confirmation dialog shows a loading spinner in the Delete button**
  - **Add User button no longer expands when loading**
  - **All debug console logs have been removed for production readiness**
- **Department Management** - Organizational structure management
  - Department head names are always displayed, reflecting real backend data
  - Fully integrated with backend logic for department head assignment and display
- **Analytics** - Data visualization with charts and performance metrics
- **Reports** - Generate and view various business reports
- **Calendar** - Task and event scheduling with FullCalendar integration
- **Kanban Board** - Visual task management with drag-and-drop functionality
- **Notifications** - Real-time notification system
- **Settings** - User preferences and system configuration

### Design & UX

- **Responsive Design** - Works seamlessly across different screen sizes
- **Theme System** - Light/Dark mode toggle with green and white color scheme
- **Material-UI Components** - Modern, accessible UI components
- **Philippines-Inspired Content** - Local context with Filipino names, locations, and cultural references
- **Navigation Guard** - Protected routes and authentication flow
- **Sidebar Navigation** - Intuitive menu system with icons
- **Professional Dialogs** - All actions use custom, modern confirmation dialogs
- **Hidden Scrollbars** - Clean UI with hidden scrollbars on small screens while maintaining scroll functionality
- **Modern Table Design** - Responsive tables with hover effects, tooltips, and professional styling

### Technical Features

- **Electron Framework** - Cross-platform desktop application
- **React Router** - Client-side routing with protected routes
- **Context API** - Global state management for theme and user data
- **Local Storage** - Persistent user sessions and preferences
- **Backend Integration** - Full API integration with Node.js backend
- **File Upload System** - Drag & drop file attachments for tickets with download/delete functionality
- **Comment System** - Real-time comments with user-specific permissions
- **WebSocket Support** - Real-time updates and notifications
- **Error Handling** - Comprehensive error handling with user-friendly dialogs

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git
- Backend API server running (see backend setup)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd desktop-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure backend connection**

   Ensure the backend API server is running and update the API configuration in `src/services/api.js` if needed.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌐 Port Configuration

The desktop app runs on **port 3001** to avoid conflicts with other applications:

- **Desktop App**: `http://localhost:3001`
- **Web App**: `http://localhost:3000` (if running)
- **Backend API**: `http://localhost:3001/api` (when integrated)

### Running Multiple Apps Simultaneously

You can run the desktop app alongside the web app without conflicts:

```bash
# Terminal 1 - Start web app (port 3000)
cd frontend-web-app
npm run dev

# Terminal 2 - Start desktop app (port 3001)
cd desktop-app
npm run dev

# Terminal 3 - Start backend (port 3001/api)
cd backend
npm start
```

## 📦 Dependencies

### Core Dependencies

- **React** (^18.2.0) - UI library
- **React DOM** (^18.2.0) - React rendering
- **React Router DOM** (^6.11.1) - Client-side routing
- **Electron** (^28.0.0) - Desktop application framework
- **React Scripts** (5.0.1) - React development tools

### UI & Styling

- **Material-UI** (^5.13.0) - React component library
- **Material-UI Icons** (^5.11.16) - Icon library
- **Material-UI Date Pickers** (^8.6.0) - Date/Time picker components
- **Emotion** (^11.11.0) - CSS-in-JS styling
- **Emotion Styled** (^11.11.0) - Styled components
- **Date-fns** (^4.1.0) - Date utility library

### Charts & Visualization

- **Chart.js** (^4.3.0) - Charting library
- **React Chart.js 2** (^5.2.0) - React wrapper for Chart.js
- **Recharts** (^3.0.2) - Composable charting library

### Calendar & Scheduling

- **FullCalendar** (^6.1.17) - Calendar component suite
  - **FullCalendar React** - React wrapper
  - **FullCalendar DayGrid** - Day grid view
  - **FullCalendar TimeGrid** - Time grid view
  - **FullCalendar Interaction** - User interactions

### Document Generation

- **PDFKit** (^0.17.1) - PDF generation library

### Real-time Communication

- **Socket.IO Client** (^4.8.1) - WebSocket client for real-time features

### Drag & Drop

- **Hello Pangea DND** (^18.0.1) - Drag and drop functionality

### HTTP Client

- **Axios** (^1.4.0) - HTTP client for API calls

### Development Dependencies

- **Concurrently** (^8.0.1) - Run multiple commands
- **Cross-env** (^7.0.3) - Cross-platform environment variables
- **Electron-is-dev** (^2.0.0) - Development environment detection
- **Wait-on** (^7.0.1) - Wait for resources to be available

## 🏃‍♂️ Available Scripts

- `npm start` - Start React development server on port 3001
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
- `npm run electron-dev` - Start Electron in development mode
- `npm run dev` - Start both React and Electron in development mode

## 🏗️ Project Structure

```
desktop-app/
├── public/                 # Static assets
│   ├── electron.js        # Electron main process
│   ├── index.html         # HTML template
│   └── logo.png           # App logo
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── CommentSection.js  # Comment system component
│   │   ├── FileUpload.js      # File upload component with drag & drop
│   │   ├── LoadingSpinner.js  # Loading indicator
│   │   ├── LogoutDialog.js    # Logout confirmation
│   │   ├── NavigationGuard.js # Route protection
│   │   ├── NotificationContainer.js # Notification system
│   │   ├── Sidebar.js         # Navigation sidebar
│   │   └── StatCard.js        # Dashboard stat cards
│   ├── context/           # React Context providers
│   │   └── ThemeContext.js
│   ├── data/              # Mock data and static content
│   │   └── mockData.js
│   ├── layouts/           # Layout components
│   │   └── AuthenticatedLayout.js
│   ├── pages/             # Page components
│   │   ├── Analytics.js   # Analytics and charts
│   │   ├── Calendar.js    # Calendar and scheduling
│   │   ├── Dashboard.js   # Main dashboard
│   │   ├── Departments.js # Department management
│   │   ├── Kanban.js      # Kanban board
│   │   ├── Login.js       # Authentication
│   │   ├── Reports.js     # Report generation
│   │   ├── Settings.js    # User settings
│   │   ├── Support.js     # Support page
│   │   ├── Tasks.js       # Task management
│   │   ├── Tickets.js     # Ticket management (CRUD + files + comments)
│   │   └── Users.js       # User management
│   ├── services/          # API services
│   │   └── api.js         # Backend API integration
│   ├── styles/            # Global styles
│   ├── theme/             # Theme configuration
│   │   └── theme.js
│   ├── App.css            # App-specific styles
│   ├── App.js             # Main App component
│   └── index.js           # App entry point
├── env.config.js          # Environment configuration
├── main.js                # Electron main process
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Theme & Design

The application features a **green and white color scheme** with:

- **Primary Color**: Green (#2E7D32)
- **Secondary Color**: Light Green (#4CAF50)
- **Background**: White/Light Gray
- **Dark Mode**: Available with automatic theme switching
- **Philippines-Inspired**: Local context with Filipino names and locations
- **Professional UI**: Modern Material-UI components with consistent styling
- **Responsive Design**: Optimized for all screen sizes with hidden scrollbars

## 🔐 Authentication

The app integrates with the backend authentication system:

- **Login/Logout**: Secure authentication with JWT tokens
- **Role-based Access**: Different permissions for admin, department heads, and regular users
- **Session Management**: Persistent sessions with automatic token refresh
- **Protected Routes**: Navigation guard prevents unauthorized access

## 📋 Ticket Management Features

### Core Ticket Operations

- **Create Tickets**: Form with validation, file uploads, and department assignment
- **View Tickets**: Detailed view with comments, files, and metadata
- **Edit Tickets**: Update ticket information with real-time validation
- **Delete Tickets**: Secure deletion with confirmation dialogs

### File Management

- **Upload Files**: Drag & drop or click to upload (max 5 files per ticket)
- **Download Files**: One-click download with proper file naming
- **Delete Files**: Remove attachments with confirmation
- **File Preview**: Display file information and metadata

### Comment System

- **Add Comments**: Real-time comment posting
- **View Comments**: Chronological display with user information
- **Delete Comments**: Users can only delete their own comments
- **User Indicators**: Visual indicators for comment authors

### Assignment & Permissions

- **Department Assignment**: Tickets can be assigned to specific departments
- **User Assignment**: Tickets can be assigned to department heads
- **Role-based Access**: Different views and permissions based on user role
- **Sent/Received Views**: Separate tabs for sent and received tickets

## 🔧 Configuration

### Environment Variables

The app uses the following environment variables (set in `env.config.js`):

- `PORT=3001` - Development server port
- `REACT_APP_API_BASE_URL` - Backend API URL
- `REACT_APP_ENABLE_FILE_UPLOAD` - Enable/disable file upload features
- `REACT_APP_MOCK_DATA_ENABLED` - Enable/disable mock data

### File Upload Settings

- **Maximum File Size**: 10MB per file
- **Maximum Files**: 5 files per ticket
- **Supported Types**: All file types (configurable)
- **Upload Progress**: Real-time upload progress indicators

### API Integration

- **RESTful API**: Full CRUD operations for all entities
- **WebSocket Support**: Real-time updates and notifications
- **Error Handling**: Comprehensive error handling with user feedback
- **Authentication**: JWT token-based authentication
- **File Management**: Complete file upload/download/delete operations

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Start backend server**: Ensure the backend API is running
3. **Start development server**: `npm run dev`
4. **Login**: Use your backend credentials to access the system
5. **Explore features**: Navigate through the sidebar to access all features

## 📱 Supported Platforms

- Windows 10/11
- macOS 10.14+
- Linux (Ubuntu 18.04+)

## 🔄 Recent Updates

### 2024-06-29

- **User Management Improvements:**
  - Add/Edit User form now uses separate First Name and Last Name fields
  - Password is required when adding a user
  - Status field has been removed from the form
  - Department dropdown only shows available departments
  - Add and Delete user actions now show a loading spinner and a success message
  - Delete confirmation dialog shows a loading spinner in the Delete button
  - Add User button no longer expands when loading
  - All debug console logs have been removed for production readiness
- **Ticketing Enhancements:**
  - **Forward Ticket:** Tickets can now be forwarded to other users or departments, with proper comment structure and UI
  - **Ticket Date Maturity Indicator:** Tickets now display a color-coded maturity indicator in the due date cell, showing how long a ticket has been in progress and if it is overdue
  - **Update Remarks:** Every ticket update now supports remarks/comments, which are tracked and displayed in the ticket's comment history

### Latest Features Added

- **Enhanced Date Handling**: Integrated Material-UI Date Pickers v8.6.0 for improved date/time selection
- **Advanced Charts**: Added Recharts v3.0.2 for more sophisticated data visualization
- **PDF Generation**: Integrated PDFKit v0.17.1 for generating PDF reports and documents
- **Real-time Updates**: Added Socket.IO Client v4.8.1 for live updates and notifications
- **Modern Date Utilities**: Added Date-fns v4.1.0 for comprehensive date manipulation
- **Electron Update**: Updated to Electron v28.0.0 for improved performance and security
- **Enhanced Calendar**: Updated FullCalendar suite to v6.1.17 with improved scheduling features
- **Improved Drag & Drop**: Updated Hello Pangea DND to v18.0.1 for better performance
- **Theme Customization**: Enhanced theme system with additional color schemes
- **Performance Optimization**: Improved application load time and responsiveness
- **Security Updates**: Latest dependency updates for enhanced security

### Technical Improvements

- **Build System**: Optimized build configuration for faster development
- **State Management**: Enhanced context usage for better performance
- **Error Boundaries**: Added comprehensive error boundaries for better error handling
- **Code Splitting**: Implemented lazy loading for improved initial load time
- **Memory Management**: Improved memory usage and garbage collection
- **Type Safety**: Added additional runtime type checking
- **Development Experience**: Enhanced hot reload and development workflow
- **Documentation**: Updated API integration documentation
- **Testing**: Added more comprehensive unit and integration tests
- **Accessibility**: Improved keyboard navigation and screen reader support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the main project documentation or create an issue in the repository.
