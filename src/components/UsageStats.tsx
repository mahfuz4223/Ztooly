import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import AnalyticsService, { PopularTool } from '@/services/analyticsService';
import { isValidTool, getToolName } from '@/utils/toolRegistry';

interface UsageStatsProps {
  toolId?: string;
  showPopularTools?: boolean;
  className?: string;
}

export const UsageStats = ({ 
  toolId, 
  showPopularTools = false, 
  className = '' 
}: UsageStatsProps) => {
  const [usageCount, setUsageCount] = useState<number>(0);
  const [popularTools, setPopularTools] = useState<PopularTool[]>([]);
  const [loading, setLoading] = useState(true);

  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (toolId) {
          const count = await analyticsService.getToolUsageCount(toolId);
          setUsageCount(count);
        }
          if (showPopularTools) {
          const tools = await analyticsService.getPopularTools(10); // Get more to filter
          // Filter to only show tools that exist in our project
          const validTools = tools
            .filter(tool => isValidTool(tool.tool_id))
            .slice(0, 5) // Take top 5 valid tools
            .map(tool => ({
              ...tool,
              tool_name: getToolName(tool.tool_id) // Use our standardized names
            }));
          setPopularTools(validTools);
        }
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toolId, showPopularTools, analyticsService]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {toolId && usageCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          Used {usageCount.toLocaleString()} times
        </Badge>
      )}
        {showPopularTools && popularTools.length > 0 && (
        <div className="space-y-4">
          {popularTools.map((tool, index) => (
            <div 
              key={tool.tool_id} 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-background to-muted/30 rounded-lg border hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900">{tool.tool_name}</span>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                {tool.usage_count.toLocaleString()} uses
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
