import { useEffect, useCallback } from 'react';
import AnalyticsService from '@/services/analyticsService';

// Check if analytics are enabled
const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED === 'true' || import.meta.env.DEV || false;

interface UseAnalyticsProps {
  toolId: string;
  toolName: string;
  trackOnMount?: boolean;
}

export const useAnalytics = ({ 
  toolId, 
  toolName, 
  trackOnMount = true 
}: UseAnalyticsProps) => {
  const analyticsService = AnalyticsService.getInstance();
  useEffect(() => {
    if (trackOnMount && ANALYTICS_ENABLED) {
      analyticsService.trackToolUsage(toolId, toolName);
    }
  }, [toolId, toolName, trackOnMount, analyticsService]);

  const trackAction = useCallback((action: string) => {
    if (!ANALYTICS_ENABLED) return;
    
    const actionId = `${toolId}_${action}`;
    const actionName = `${toolName} - ${action}`;
    analyticsService.trackToolUsage(actionId, actionName);
  }, [toolId, toolName, analyticsService]);

  const trackUsage = useCallback(() => {
    if (!ANALYTICS_ENABLED) return;
    
    analyticsService.trackToolUsage(toolId, toolName);
  }, [toolId, toolName, analyticsService]);

  return {
    trackAction,
    trackUsage,
    sessionId: analyticsService.getSessionId()
  };
};
