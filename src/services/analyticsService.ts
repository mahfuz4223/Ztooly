import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const IS_PRODUCTION = import.meta.env.PROD || false;
const IS_DEVELOPMENT = import.meta.env.DEV || false;
const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';

export interface ToolUsage {
  toolId: string;
  toolName: string;
  userSession: string;
  ipAddress?: string;
  clientIp?: string; // Client-detected IP to send to backend
  userAgent?: string;
}

export interface PopularTool {
  tool_id: string;
  tool_name: string;
  usage_count: number;
}

export interface ClientInfo {
  ip: string;
  rawIp?: string;
  userAgent: string;
  headers?: Record<string, string | undefined>;
  timestamp: string;
}

export interface PublicIpInfo {
  ip: string;
  source: string;
  warning?: string;
  timestamp: string;
}

export interface DailyStat {
  date: string;
  total_users: number;
  total_tool_uses: number;
  unique_tools_used: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private userIpAddress: string | null = null;
  private isServerAvailable: boolean = true;
  private hasLoggedServerUnavailable: boolean = false;  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    
    // Check if analytics are explicitly enabled
    const analyticsExplicitlyEnabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
    
    // Skip analytics initialization if disabled or no server URL configured
    if (!analyticsExplicitlyEnabled || !API_BASE_URL.includes('://')) {
      this.isServerAvailable = false;
      this.hasLoggedServerUnavailable = true;
      if (IS_DEVELOPMENT && !this.hasLoggedServerUnavailable) {
        console.log('📊 Analytics disabled - set VITE_ANALYTICS_ENABLED=true and configure VITE_API_URL to enable');
      }
      return;
    }
    
    // Only try to fetch IP if analytics server is explicitly configured
    if (analyticsExplicitlyEnabled && API_BASE_URL !== 'http://localhost:3001/api') {
      this.fetchUserIpAddress();
    } else {
      // Check if local server is available before making requests
      this.checkServerAvailability();
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }  private async fetchUserIpAddress(): Promise<void> {
    try {      // First, try our own server's public IP endpoint (if server is available)
      if (this.isServerAvailable) {
        try {
          const serverResponse = await fetch(`${API_BASE_URL}/public-ip`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (serverResponse.ok) {
            const serverData = await serverResponse.json();
            if (serverData.ip && serverData.ip !== 'unknown' && serverData.ip !== 'localhost') {
              this.userIpAddress = serverData.ip;
              console.log(`📍 IP detected via server proxy: ${this.userIpAddress}`);
              return;
            }
          }
        } catch (error) {          // Mark server as unavailable if connection fails
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            this.isServerAvailable = false;
          }
          if (IS_DEVELOPMENT) {
            console.warn('Server IP proxy failed, trying direct services:', error);
          }
        }
      }

      // Fallback to direct external services
      const ipServices = [
        { url: 'https://api.ipify.org?format=json', key: 'ip' },
        { url: 'https://ipapi.co/json/', key: 'ip' },
        { url: 'https://api64.ipify.org?format=json', key: 'ip' },
        { url: 'https://api.my-ip.io/ip.json', key: 'ip' },
        { url: 'https://jsonip.com', key: 'ip' }
      ];

      for (const service of ipServices) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          
          const response = await fetch(service.url, { 
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            const detectedIp = data[service.key] || data.query || data.IPv4 || null;
              if (detectedIp && detectedIp !== 'unknown') {
              this.userIpAddress = detectedIp;
              if (IS_DEVELOPMENT) {
                console.log(`📍 IP detected via ${service.url}: ${this.userIpAddress}`);
              }
              return;
            }
          }
        } catch (error) {
          if (IS_DEVELOPMENT) {
            console.warn(`IP service ${service.url} failed:`, error.message);
          }
          continue;
        }
      }
      
      // Final fallback - try to get from our server's client-info endpoint
      try {
        const clientInfoResponse = await fetch(`${API_BASE_URL}/client-info`);
        if (clientInfoResponse.ok) {
          const clientData = await clientInfoResponse.json();
          if (clientData.ip && clientData.ip !== 'unknown' && clientData.ip !== 'localhost') {
            this.userIpAddress = clientData.ip;
            console.log(`📍 IP detected via client-info endpoint: ${this.userIpAddress}`);
            return;
          }
        }        } catch (error) {
          if (IS_DEVELOPMENT) {
            console.warn('Client info endpoint failed:', error);
          }
        }
        
        if (IS_DEVELOPMENT) {
          console.warn('❌ Could not detect public IP address from any source');
        }
        this.userIpAddress = 'undetected';
      } catch (error) {
        if (IS_DEVELOPMENT) {
          console.error('❌ IP detection failed:', error);
        }
      this.userIpAddress = 'error';
    }
  }  async trackToolUsage(toolId: string, toolName: string): Promise<void> {
    // Skip analytics if disabled or server is known to be unavailable
    if (!ANALYTICS_ENABLED || !this.isServerAvailable) {
      return;
    }

    try {
      // Ensure we have an IP address
      if (!this.userIpAddress || this.userIpAddress === 'undetected' || this.userIpAddress === 'error') {
        if (IS_DEVELOPMENT) {
          console.log('🔄 IP address not available, attempting to fetch...');
        }
        await this.fetchUserIpAddress();
      }

      const usage: ToolUsage = {
        toolId,
        toolName,
        userSession: this.sessionId,
        clientIp: this.userIpAddress || undefined, // Send as clientIp to backend
        userAgent: navigator.userAgent
      };      if (this.isServerAvailable) {
        if (IS_DEVELOPMENT) {
          console.log(`📊 Tracking tool usage:`, { 
            toolId, 
            toolName, 
            ip: this.userIpAddress,
            session: this.sessionId.substring(0, 8) + '...'
          });
        }

        const response = await axios.post(`${API_BASE_URL}/track-usage`, usage);
        
        if (response.status === 200 && IS_DEVELOPMENT) {
          console.log('✅ Analytics tracked successfully');
        }
      }
    } catch (error) {
      // Mark server as unavailable on connection errors
      if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        this.isServerAvailable = false;
        if (!this.hasLoggedServerUnavailable && IS_DEVELOPMENT) {
          console.log('📊 Analytics server unavailable, switching to offline mode');
          this.hasLoggedServerUnavailable = true;
        }        } else {
          if (IS_DEVELOPMENT) {
            console.error('❌ Failed to track tool usage:', error);
          }
        }
      
      // Try to refresh IP address on error
      if (!this.userIpAddress) {
        setTimeout(() => {
          this.fetchUserIpAddress();
        }, 1000);
      }
    }
  }  async getPopularTools(limit: number = 10): Promise<PopularTool[]> {
    // Skip if analytics disabled or server is unavailable
    if (!ANALYTICS_ENABLED || !this.isServerAvailable) {
      return [];
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/popular-tools?limit=${limit}`);
      return response.data;    } catch (error: unknown) {      // Mark server as unavailable on connection errors
      const err = error as { code?: string; message?: string }; // Type assertion for error properties
      if (err.code === 'ERR_NETWORK' || 
          err.code === 'ERR_CONNECTION_REFUSED' || 
          err.message?.includes('ERR_CONNECTION_REFUSED') ||
          err.message?.includes('ECONNREFUSED')) {
        this.isServerAvailable = false;
        if (!this.hasLoggedServerUnavailable && IS_DEVELOPMENT) {
          console.log('📊 Analytics server unavailable for popular tools, using fallback');
          this.hasLoggedServerUnavailable = true;
        }
      } else if (IS_DEVELOPMENT) {
        console.error('Failed to fetch popular tools:', error);
      }
      return [];
    }
  }

  async getDailyStats(days: number = 30): Promise<DailyStat[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-stats?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch daily stats:', error);
      return [];
    }
  }

  async getToolUsageCount(toolId: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tool-usage/${toolId}`);
      return response.data.count;
    } catch (error) {
      console.error('Failed to fetch tool usage count:', error);
      return 0;
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getCurrentIpAddress(): string | null {
    return this.userIpAddress;
  }
  async refreshIpAddress(): Promise<string | null> {
    console.log('🔄 Refreshing IP address...');
    await this.fetchUserIpAddress();
    return this.userIpAddress;
  }
  async getDetailedClientInfo(): Promise<ClientInfo | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/client-info`);
      return response.data;
    } catch (error) {
      console.error('Failed to get detailed client info:', error);
      return null;
    }
  }

  async getPublicIpInfo(): Promise<PublicIpInfo | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/public-ip`);
      return response.data;
    } catch (error) {
      console.error('Failed to get public IP info:', error);
      return null;
    }
  }

  private async checkServerAvailability(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.isServerAvailable = true;
        this.fetchUserIpAddress();
      } else {
        this.isServerAvailable = false;
      }
    } catch (error) {
      this.isServerAvailable = false;
      if (IS_DEVELOPMENT && !this.hasLoggedServerUnavailable) {
        console.log('📊 Analytics server not available at', API_BASE_URL);
        this.hasLoggedServerUnavailable = true;
      }
    }
  }
}

export default AnalyticsService;
