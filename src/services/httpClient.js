/**
 * Base HTTP client with authentication and error handling
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://backend-ticketing-system.up.railway.app/api';

class HttpClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  getUploadHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for multipart/form-data - browser will set it with boundary
    };
  }

  async handleResponse(response) {
    // Handle successful DELETE responses that might not have content
    if ((response.status === 204 || response.status === 200) && 
        (response.headers.get('content-length') === '0' || !response.headers.get('content-type'))) {
      return { success: true, message: 'Operation completed successfully' };
    }

    // Try to parse JSON response
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  }

  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${endpoint}${query ? `?${query}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async post(endpoint, data = null, isUpload = false) {
    const headers = isUpload ? this.getUploadHeaders() : this.getAuthHeaders();
    const body = isUpload ? data : JSON.stringify(data);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body
    });

    return this.handleResponse(response);
  }

  async put(endpoint, data) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async patch(endpoint, data = null) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : null
    });

    return this.handleResponse(response);
  }

  async delete(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async download(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  }

  // Auth methods that don't require authentication
  async postPublic(endpoint, data) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }
}

export default new HttpClient(); 