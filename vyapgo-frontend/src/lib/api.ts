const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface VoiceUploadResponse {
  success: boolean;
  uploadId: string;
  status: 'processing' | 'completed' | 'failed';
  message: string;
}

export interface VoiceStatusResponse {
  success: boolean;
  id: string;
  status: 'processing' | 'completed' | 'failed';
  transcript?: string;
  business_analysis?: {
    businessName: string;
    businessType: string;
    ownerName: string;
    location: string;
    requirements: string[];
    suggestedFeatures: string[];
    confidence: number;
  };
  error?: string;
}

export interface AppGenerationResponse {
  success: boolean;
  appId: string;
  status: 'generating' | 'building' | 'completed' | 'failed';
  message: string;
}

export interface AppStatusResponse {
  success: boolean;
  app: {
    id: string;
    appName: string;
    buildStatus: 'generating' | 'code_generated' | 'building' | 'signing' | 'completed' | 'failed';
    buildProgress: number;
    downloadUrl?: string;
    apkFileSize?: number;
    errorMessage?: string;
  };
}

class VyapGoAPI {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('vyapgo_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    console.log('🔍 API Request:', { 
      method: options.method || 'GET', 
      url,
      baseUrl: API_BASE,
      endpoint,
      hasToken: !!this.token,
      tokenLength: this.token?.length || 0
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      console.log('📡 API Response:', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText,
        url: response.url
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error Response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🚨 API Error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      console.log('🔐 Attempting login to:', `${API_BASE}/auth/login`);
      
      const response = await this.request<ApiResponse<{ token: string; user: any }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      console.log('🔐 Login response:', response);

      if (response.success && response.data?.token) {
        this.token = response.data.token;
        localStorage.setItem('vyapgo_token', this.token);
        console.log('✅ Token stored successfully');
      } else {
        console.error('❌ Login failed - no token in response');
        throw new Error('Login failed - invalid response from server');
      }

      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request<ApiResponse<{ token: string; user: any }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('vyapgo_token', this.token);
    }

    return response;
  }

  async uploadVoice(audioFile: File, language: string = 'auto'): Promise<VoiceUploadResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    console.log('🔐 Upload Voice - Auth Check:', {
      hasToken: !!this.token,
      tokenLength: this.token?.length || 0
    });

    const response = await fetch(`${API_BASE}/voice/upload`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    console.log('📡 Upload Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('📄 Error Response Body:', errorData);
      } catch (e) {
        console.error('❌ Could not parse error response');
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async getVoiceStatus(uploadId: string): Promise<VoiceStatusResponse> {
    return await this.request<VoiceStatusResponse>(`/voice/status/${uploadId}`);
  }

  async generateApp(voiceUploadId: string, customizations?: any): Promise<AppGenerationResponse> {
    return await this.request<AppGenerationResponse>('/apps/generate', {
      method: 'POST',
      body: JSON.stringify({ voiceUploadId, customizations: customizations || {} }),
    });
  }

  async getAppStatus(appId: string): Promise<AppStatusResponse> {
    return await this.request<AppStatusResponse>(`/apps/status/${appId}`);
  }

  async downloadApp(appId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/apps/download/${appId}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return await response.blob();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('vyapgo_token');
  }
}

export const vyapgoAPI = new VyapGoAPI();


// Add to src/lib/api.ts
const endpoints = {
  voice: {
    processBusinessInfo: '/api/voice/process-business-info',
    enhanceApp: '/api/voice/app-enhancement',
    textToSpeech: '/api/voice/tts'
  },
  app: {
    startBuild: '/api/app/build/start',
    getBuildStatus: '/api/app/build/status',
    downloadAPK: '/api/app/download'
  },
  websocket: 'ws://localhost:8080/studio'
};
