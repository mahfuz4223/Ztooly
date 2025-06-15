
import { useState, useEffect } from 'react';
import { modelManager } from '@/utils/modelManager';

export const useModelPreloader = () => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadError, setPreloadError] = useState<string>('');

  const preloadModel = async () => {
    if (isPreloaded || isPreloading) return;
    
    setIsPreloading(true);
    setPreloadError('');
    
    try {
      await modelManager.preloadModel();
      setIsPreloaded(true);
    } catch (error) {
      console.error('Model preload error:', error);
      setPreloadError('Failed to preload AI model');
    } finally {
      setIsPreloading(false);
    }
  };

  // Auto-preload when component mounts
  useEffect(() => {
    preloadModel();
  }, []);

  return {
    isPreloading,
    isPreloaded,
    preloadError,
    preloadModel
  };
};
