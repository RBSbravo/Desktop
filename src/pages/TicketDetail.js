import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTickets, fetchUsers, fetchDepartments, fetchFiles } from '../services/api';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { ViewTicketDialog } from '../components/tickets/TicketDialogs';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ticketFiles, setTicketFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load ticket, users, departments, and files in parallel
        const [tickets, usersData, departmentsData] = await Promise.all([
          fetchTickets(),
          fetchUsers(),
          fetchDepartments()
        ]);
        
        const found = tickets.find(t => t.id === id);
        setTicket(found || null);
        setUsers(usersData || []);
        setDepartments(departmentsData || []);
        
        // Load ticket files if ticket exists
        if (found) {
          try {
            const files = await fetchFiles(found.id);
            setTicketFiles(Array.isArray(files) ? files : []);
          } catch (fileError) {
            console.error('Error loading ticket files:', fileError);
            setTicketFiles([]);
          }
        }
        
        setError(found ? null : 'Ticket not found');
      } catch (err) {
        setError('Failed to load ticket data');
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  // File handling functions
  const handleFileDelete = async (fileId) => {
    try {
      // Import deleteFile from services
      const { deleteFile } = await import('../services/api');
      await deleteFile(fileId);
      setTicketFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleFileDownload = async (fileId) => {
    try {
      // Import downloadFile from services
      const { downloadFile } = await import('../services/api');
      const blob = await downloadFile(fileId);
      const file = ticketFiles.find(f => f.id === fileId);
      if (file) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.file_name || file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getTicketFiles = () => ticketFiles;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Typography color="error" variant="h6">{error}</Typography><Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Back</Button></Box>;

  // Reuse ViewTicketDialog layout, but as a page
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Ticket Details</Typography>
      <ViewTicketDialog
        open={true}
        onClose={() => navigate(-1)}
        ticket={ticket}
        departments={departments}
        users={users}
        getStatusColor={() => 'primary'}
        getStatusIcon={() => null}
        getPriorityColor={() => 'primary'}
        getPriorityIcon={() => null}
        getTicketFiles={getTicketFiles}
        onFileDelete={handleFileDelete}
        onFileDownload={handleFileDownload}
        onEdit={() => {}}
        isMobile={false}
      />
    </Box>
  );
};

export default TicketDetail; 