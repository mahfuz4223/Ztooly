// Enhanced Analytics Helper for Tool Integration
// Comprehensive analytics tracking with security and privacy features

import { useAnalytics } from '@/hooks/useAnalytics';
import AnalyticsService from '@/services/analyticsService';

// Check if analytics are enabled
const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED === 'true' || import.meta.env.DEV || false;

// Action types for better tracking categorization
export type AnalyticsAction = 
  | 'visit' | 'generate' | 'download' | 'upload' | 'convert' | 'process' 
  | 'copy' | 'share' | 'export' | 'import' | 'delete' | 'edit' | 'view'
  | 'regenerate' | 'create' | 'save' | 'compress' | 'resize' | 'remove_background'
  | 'paste' | 'input' | 'scan_qr' | 'preview' | 'reset' | 'clear';

// Tool categories for better organization
export type ToolCategory = 
  | 'qr-tools' | 'image-tools' | 'pdf-tools' | 'text-tools' | 'password-tools'
  | 'ai-tools' | 'converter-tools' | 'generator-tools' | 'utility-tools';

interface AnalyticsConfig {
  toolId: string;
  toolName: string;
  category?: ToolCategory;
  trackOnMount?: boolean;
  enableErrorTracking?: boolean;
}

// Define proper types for metadata
export interface AnalyticsMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

// Enhanced hook for tool analytics with error tracking
export const useToolAnalytics = (config: AnalyticsConfig) => {
  const analytics = useAnalytics({
    toolId: config.toolId,
    toolName: config.toolName,
    trackOnMount: config.trackOnMount ?? true
  });
  // Enhanced tracking with error handling
  const trackSecurely = async (action: AnalyticsAction, metadata?: AnalyticsMetadata) => {
    // Skip if analytics disabled
    if (!ANALYTICS_ENABLED) {
      return;
    }
    
    try {
      await analytics.trackAction(action);
      
      // Log for debugging in development only
      if (import.meta.env.DEV) {
        console.log(`📊 Analytics: ${config.toolId} - ${action}`, metadata);
      }
    } catch (error) {
      // Silent fail in production, log in development
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn('Analytics tracking failed:', error);
      }
    }
  };

  return {
    ...analytics,
    trackSecurely,
    trackVisit: () => trackSecurely('visit'),
    trackGenerate: () => trackSecurely('generate'),
    trackDownload: () => trackSecurely('download'),
    trackUpload: () => trackSecurely('upload'),
    trackConvert: () => trackSecurely('convert'),
    trackProcess: () => trackSecurely('process'),
    trackCopy: () => trackSecurely('copy'),
    trackShare: () => trackSecurely('share'),
    trackExport: () => trackSecurely('export'),
    trackView: () => trackSecurely('view'),
    trackCompress: () => trackSecurely('compress'),
    trackResize: () => trackSecurely('resize'),
    trackRemoveBackground: () => trackSecurely('remove_background'),
    trackReset: () => trackSecurely('reset'),
    trackClear: () => trackSecurely('clear'),
    trackPreview: () => trackSecurely('preview'),
  };
};

// Secure analytics service for non-React contexts
export class SecureAnalyticsHelper {
  private static analytics = AnalyticsService.getInstance();

  // Track actions with validation and security
  static async trackAction(toolId: string, toolName: string, action: AnalyticsAction): Promise<void> {
    try {
      // Validate inputs
      if (!toolId || !toolName || !action) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Invalid analytics parameters:', { toolId, toolName, action });
        }
        return;
      }

      // Sanitize inputs
      const sanitizedToolId = toolId.replace(/[^a-zA-Z0-9-_]/g, '');
      const sanitizedAction = action.replace(/[^a-zA-Z0-9-_]/g, '');
      
      await this.analytics.trackToolUsage(
        `${sanitizedToolId}-${sanitizedAction}`, 
        `${toolName} - ${action}`
      );
    } catch (error) {
      // Silent fail to prevent breaking user experience
      if (process.env.NODE_ENV === 'development') {
        console.error('Secure analytics tracking failed:', error);
      }
    }
  }

  // Predefined secure tracking methods
  static trackDownload = (toolId: string, toolName: string) => 
    this.trackAction(toolId, toolName, 'download');
  
  static trackGenerate = (toolId: string, toolName: string) => 
    this.trackAction(toolId, toolName, 'generate');
  
  static trackUpload = (toolId: string, toolName: string) => 
    this.trackAction(toolId, toolName, 'upload');
  
  static trackConvert = (toolId: string, toolName: string) => 
    this.trackAction(toolId, toolName, 'convert');
  
  static trackProcess = (toolId: string, toolName: string) => 
    this.trackAction(toolId, toolName, 'process');
  
  static trackCopy = (toolId: string, toolName: string) => 
    this.trackAction(toolId, toolName, 'copy');
  
  static trackView = (toolId: string, toolName: string) => 
    this.trackAction(toolId, toolName, 'view');
}

// Quick setup hooks for common tool patterns (Must be used inside React components)
export const useQRToolAnalytics = (toolId: string, toolName: string) => 
  useToolAnalytics({ toolId, toolName, category: 'qr-tools' });

export const useImageToolAnalytics = (toolId: string, toolName: string) => 
  useToolAnalytics({ toolId, toolName, category: 'image-tools' });

export const usePDFToolAnalytics = (toolId: string, toolName: string) => 
  useToolAnalytics({ toolId, toolName, category: 'pdf-tools' });

export const useTextToolAnalytics = (toolId: string, toolName: string) => 
  useToolAnalytics({ toolId, toolName, category: 'text-tools' });

export const useAIToolAnalytics = (toolId: string, toolName: string) => 
  useToolAnalytics({ toolId, toolName, category: 'ai-tools' });

export const useGeneratorToolAnalytics = (toolId: string, toolName: string) => 
  useToolAnalytics({ toolId, toolName, category: 'generator-tools' });

// Admin-only analytics functions (hidden from public)
export const AdminAnalytics = {
  // Only accessible in development or with admin flag
  isAdminMode: () => {
    return process.env.NODE_ENV === 'development' || 
           localStorage.getItem('admin_analytics') === 'true' ||
           new URLSearchParams(window.location.search).get('admin') === 'true';
  },

  // Get detailed analytics (admin only)
  getDetailedStats: async () => {
    if (!AdminAnalytics.isAdminMode()) return null;
    
    try {
      const analytics = AnalyticsService.getInstance();
      return {
        clientInfo: await analytics.getDetailedClientInfo(),
        publicIp: await analytics.getPublicIpInfo(),
        session: analytics.getSessionId(),
        currentIp: analytics.getCurrentIpAddress()
      };
    } catch (error) {
      console.error('Failed to get admin analytics:', error);
      return null;
    }
  }
};

// Legacy compatibility - Common action types
export const ANALYTICS_ACTIONS = {
  GENERATE: 'generate',
  REGENERATE: 'regenerate',
  CREATE: 'create',
  DOWNLOAD: 'download',
  EXPORT: 'export',
  SAVE: 'save',
  COPY: 'copy',
  SHARE: 'share',
  PROCESS: 'process',
  CONVERT: 'convert',
  COMPRESS: 'compress',
  RESIZE: 'resize',
  REMOVE_BACKGROUND: 'remove_background',
  UPLOAD: 'upload',
  PASTE: 'paste',
  INPUT: 'input',
  SCAN_QR: 'scan_qr',
  PREVIEW: 'preview',
  EDIT: 'edit',
  RESET: 'reset',
  CLEAR: 'clear',
  VIEW: 'view',
  VISIT: 'visit'
};

export default {
  useToolAnalytics,
  SecureAnalyticsHelper,
  AdminAnalytics,
  useQRToolAnalytics,
  useImageToolAnalytics,
  usePDFToolAnalytics,
  useTextToolAnalytics,
  useAIToolAnalytics,
  useGeneratorToolAnalytics,
  ANALYTICS_ACTIONS
};
