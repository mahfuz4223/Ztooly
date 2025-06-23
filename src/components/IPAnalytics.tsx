import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, Monitor } from 'lucide-react';
import AnalyticsService from '@/services/analyticsService';

interface RecentUsage {
  tool_id: string;
  tool_name: string;
  user_session: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

interface IPAnalyticsProps {
  className?: string;
  limit?: number;
}

export const IPAnalytics = ({ className = '', limit = 10 }: IPAnalyticsProps) => {
  const [recentUsage, setRecentUsage] = useState<RecentUsage[]>([]);
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user's IP
        const userIp = analyticsService.getCurrentIpAddress();
        if (!userIp) {
          const refreshedIp = await analyticsService.refreshIpAddress();
          setCurrentIp(refreshedIp);
        } else {
          setCurrentIp(userIp);
        }

        // Fetch recent usage data
        const response = await fetch(`${import.meta.env.VITE_API_URL}/recent-usage?limit=${limit}`);
        const data = await response.json();
        setRecentUsage(data);
      } catch (error) {
        console.error('Failed to fetch IP analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, analyticsService]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getUniqueIPs = () => {
    const ips = new Set(recentUsage.map(usage => usage.ip_address));
    return ips.size;
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            IP Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          IP Analytics
        </CardTitle>
        <CardDescription>
          Recent usage activity and IP information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <User className="h-4 w-4" />
            <span className="font-medium">Your IP Address</span>
          </div>
          <p className="text-blue-700 font-mono text-sm mt-1">
            {currentIp || 'Detecting...'}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-lg">{getUniqueIPs()}</div>
            <div className="text-sm text-muted-foreground">Unique IPs</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-lg">{recentUsage.length}</div>
            <div className="text-sm text-muted-foreground">Recent Uses</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentUsage.map((usage, index) => (
              <div key={index} className="p-2 border rounded-lg text-xs">
                <div className="flex justify-between items-start mb-1">
                  <Badge variant="outline" className="text-xs">
                    {usage.tool_name}
                  </Badge>
                  <span className="text-muted-foreground">
                    {formatTimestamp(usage.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="font-mono">{usage.ip_address}</span>
                  <Monitor className="h-3 w-3 ml-2" />
                  <span>{getBrowserInfo(usage.user_agent)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
