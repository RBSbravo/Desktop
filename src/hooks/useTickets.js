import { useState, useEffect } from 'react';
import {
  fetchTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  uploadFile,
  deleteFile,
  downloadFile,
  fetchDepartments,
  fetchCurrentUserProfile,
  fetchFiles,
  getTicketsForwardedToMe
} from '../services/api';

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [forwardedTickets, setForwardedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [ticketFiles, setTicketFiles] = useState({});

  // Load initial data
  useEffect(() => {
    loadTickets();
    loadForwardedTickets();
    loadDepartments();
    loadCurrentUserProfile();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await fetchTickets();
      const processedTickets = Array.isArray(data) ? data : [];
      const sortedTickets = processedTickets.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      });
      setTickets(sortedTickets);
    } catch (err) {
      console.error('Error loading tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const loadForwardedTickets = async () => {
    try {
      const data = await getTicketsForwardedToMe();
      const processedForwardedTickets = Array.isArray(data) ? data : [];
      const sortedForwardedTickets = processedForwardedTickets.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      });
      setForwardedTickets(sortedForwardedTickets);
    } catch (err) {
      console.error('Error loading forwarded tickets:', err);
      setForwardedTickets([]);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error loading departments:', err);
      setDepartments([]);
    }
  };

  const loadCurrentUserProfile = async () => {
    try {
      const profile = await fetchCurrentUserProfile();
      setCurrentUserProfile(profile);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const createTicket = async (ticketData, files) => {
    setActionLoading(true);
    try {
      const addedTicket = await addTicket(ticketData);
      
      // Upload files if any were attached
      if (files && files.length > 0) {
        try {
          for (const tempFile of files) {
            await uploadFile(tempFile.file, addedTicket.id);
          }
        } catch (fileError) {
          console.error('Error uploading files:', fileError);
        }
      }
      
      setTickets(prevTickets => [...prevTickets, addedTicket]);
      return { success: true, ticket: addedTicket };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create ticket.' };
    } finally {
      setActionLoading(false);
    }
  };

  const updateTicketData = async (ticketData) => {
    setActionLoading(true);
    try {
      const updatedTicket = await updateTicket(ticketData);
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
      return { success: true, ticket: updatedTicket };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update ticket.' };
    } finally {
      setActionLoading(false);
    }
  };

  const removeTicket = async (ticketId) => {
    if (!ticketId) {
      return { success: false, error: 'Invalid ticket ID for deletion.' };
    }

    setActionLoading(true);
    try {
      await deleteTicket(ticketId);
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete ticket.' };
    } finally {
      setActionLoading(false);
    }
  };

  const loadTicketFiles = async (ticketId) => {
    try {
      const files = await fetchFiles(ticketId);
      setTicketFiles(prev => ({
        ...prev,
        [ticketId]: Array.isArray(files) ? files : []
      }));
      return files;
    } catch (err) {
      console.error('Error loading ticket files:', err);
      setTicketFiles(prev => ({
        ...prev,
        [ticketId]: []
      }));
      return [];
    }
  };

  const uploadTicketFile = async (file, ticketId) => {
    try {
      const uploadedFile = await uploadFile(file, ticketId);
      setTicketFiles(prev => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), uploadedFile]
      }));
      return uploadedFile;
    } catch (err) {
      throw new Error('Failed to upload file.');
    }
  };

  const deleteTicketFile = async (ticketId, fileId) => {
    try {
      await deleteFile(fileId);
      setTicketFiles(prev => ({
        ...prev,
        [ticketId]: prev[ticketId]?.filter(f => f.id !== fileId) || []
      }));
    } catch (err) {
      throw new Error('Failed to delete file.');
    }
  };

  const downloadTicketFile = async (ticketId, fileId) => {
    try {
      const blob = await downloadFile(fileId);
      const file = ticketFiles[ticketId]?.find(f => f.id === fileId);
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
    } catch (err) {
      throw new Error('Failed to download file.');
    }
  };

  const getTicketFiles = (ticketId) => {
    return ticketFiles[ticketId] || [];
  };

  return {
    // State
    tickets,
    forwardedTickets,
    loading,
    actionLoading,
    departments,
    currentUserProfile,
    
    // Actions
    loadTickets,
    loadForwardedTickets,
    createTicket,
    updateTicketData,
    removeTicket,
    loadTicketFiles,
    uploadTicketFile,
    deleteTicketFile,
    downloadTicketFile,
    getTicketFiles,
  };
}; 