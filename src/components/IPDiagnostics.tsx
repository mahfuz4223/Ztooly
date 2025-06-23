import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AnalyticsService, { ClientInfo, PublicIpInfo } from '@/services/analyticsService';

interface IPDiagnosticsProps {
  className?: string;
}

const IPDiagnostics: React.FC<IPDiagnosticsProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [publicIpInfo, setPublicIpInfo] = useState<PublicIpInfo | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const analyticsService = AnalyticsService.getInstance();  useEffect(() => {
    const analyticsService = AnalyticsService.getInstance();
    
    const loadData = async () => {
      setLoading(true);
      try {
        // Get current IP from analytics service
        const current = analyticsService.getCurrentIpAddress();
        setCurrentIp(current);

        // Get detailed client info
        const clientData = await analyticsService.getDetailedClientInfo();
        setClientInfo(clientData);

        // Get public IP info
        const publicData = await analyticsService.getPublicIpInfo();
        setPublicIpInfo(publicData);

      } catch (error) {
        console.error('Failed to load IP info:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const loadIpInfo = async () => {
    setLoading(true);
    try {
      // Get current IP from analytics service
      const current = analyticsService.getCurrentIpAddress();
      setCurrentIp(current);

      // Get detailed client info
      const clientData = await analyticsService.getDetailedClientInfo();
      setClientInfo(clientData);

      // Get public IP info
      const publicData = await analyticsService.getPublicIpInfo();
      setPublicIpInfo(publicData);

    } catch (error) {
      console.error('Failed to load IP info:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshIpAddress = async () => {
    setLoading(true);
    try {
      const newIp = await analyticsService.refreshIpAddress();
      setCurrentIp(newIp);
      setRefreshCount(prev => prev + 1);
      
      // Reload all info after refresh
      await loadIpInfo();
    } catch (error) {
      console.error('Failed to refresh IP:', error);
    } finally {
      setLoading(false);
    }
  };
  const getIpStatus = (ip: string | null): { color: 'default' | 'secondary' | 'destructive', text: string } => {
    if (!ip) return { color: 'destructive', text: 'Not Detected' };
    if (ip === 'localhost') return { color: 'secondary', text: 'Localhost' };
    if (ip === 'undetected') return { color: 'destructive', text: 'Undetected' };
    if (ip === 'error') return { color: 'destructive', text: 'Error' };
    if (ip.includes('127.0.0.1') || ip.includes('::1')) return { color: 'secondary', text: 'Local' };
    return { color: 'default', text: 'Detected' };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          IP Address Diagnostics
          <Button 
            onClick={refreshIpAddress} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardTitle>
        <CardDescription>
          Diagnose IP address detection and analytics tracking
          {refreshCount > 0 && ` (Refreshed ${refreshCount} time${refreshCount > 1 ? 's' : ''})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current IP from Analytics Service */}
        <div>
          <h4 className="font-semibold mb-2">Analytics Service IP</h4>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded text-sm">
              {currentIp || 'Not Available'}
            </code>            <Badge variant={getIpStatus(currentIp).color}>
              {getIpStatus(currentIp).text}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Client Info from Server */}
        {clientInfo && (
          <div>
            <h4 className="font-semibold mb-2">Server-Detected Client Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clean IP:</span>
                <code className="bg-muted px-2 py-1 rounded">
                  {clientInfo.ip}
                </code>
              </div>
              {clientInfo.rawIp && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Raw IP:</span>
                  <code className="bg-muted px-2 py-1 rounded">
                    {clientInfo.rawIp}
                  </code>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Agent:</span>
                <span className="text-right max-w-xs truncate">
                  {clientInfo.userAgent}
                </span>
              </div>
              
              {clientInfo.headers && (
                <div className="mt-3">
                  <span className="text-muted-foreground text-xs">Headers:</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(clientInfo.headers).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{key}:</span>
                          <code className="bg-muted px-1 rounded text-xs">
                            {value}
                          </code>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Public IP Info */}
        {publicIpInfo && (
          <div>
            <h4 className="font-semibold mb-2">Public IP Detection</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Public IP:</span>
                <code className="bg-muted px-2 py-1 rounded">
                  {publicIpInfo.ip}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="text-xs">{publicIpInfo.source}</span>
              </div>
              {publicIpInfo.warning && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warning:</span>
                  <span className="text-xs text-yellow-600">{publicIpInfo.warning}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Session Info */}
        <div>
          <h4 className="font-semibold mb-2">Session Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session ID:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs">
                {analyticsService.getSessionId().substring(0, 16)}...
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timestamp:</span>
              <span className="text-xs">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Test Analytics Tracking */}
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-2">Test Analytics</h4>
          <Button 
            onClick={() => analyticsService.trackToolUsage('ip-diagnostics', 'IP Diagnostics Tool')}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Track Test Usage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IPDiagnostics;
