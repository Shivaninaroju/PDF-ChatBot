// API configuration and utility functions for FastAPI backend integration
// TODO: Update the BASE_URL to match your FastAPI backend URL

const BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ChatRequest {
  message: string;
  session_id: string;
}

interface ChatResponse {
  response: string;
  sources?: string[];
  session_id: string;
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic fetch wrapper with error handling
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Upload PDF file
  async uploadPdf(file: File): Promise<ApiResponse<{ message: string; file_id: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('PDF Upload Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  // Send chat message
  async sendChatMessage(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return this.fetchWithErrorHandling<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Submit contact form
  async submitContactForm(formData: ContactFormData): Promise<ApiResponse<{ message: string }>> {
    return this.fetchWithErrorHandling<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Download project report
  async downloadReport(): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/download-report`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error('Download Report Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Download failed' };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.fetchWithErrorHandling<{ status: string }>('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type { ChatRequest, ChatResponse, ContactFormData, ApiResponse };

// Utility functions
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};