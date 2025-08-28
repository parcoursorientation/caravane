"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useRealTimeStats } from '@/hooks/use-realtime-stats';

export default function SocketTestPage() {
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setConnectionLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const { 
    stats, 
    isConnected, 
    error, 
    requestStatsUpdate,
    isRealTimeAvailable 
  } = useRealTimeStats(true);

  useEffect(() => {
    addLog('Socket hook initialized');
  }, []);

  useEffect(() => {
    if (isConnected) {
      addLog('✅ Connected to WebSocket server');
    } else {
      addLog('❌ Disconnected from WebSocket server');
    }
  }, [isConnected]);

  useEffect(() => {
    if (error) {
      addLog(`🚨 Error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (stats) {
      addLog(`📊 Stats updated: ${JSON.stringify(stats, null, 2)}`);
    }
  }, [stats]);

  const handleManualRefresh = () => {
    addLog('🔄 Manual refresh requested');
    requestStatsUpdate();
  };

  const clearLogs = () => {
    setConnectionLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Socket.IO Connection Test</h1>
          <p className="text-gray-600">Test the real-time WebSocket connection</p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-red-600" />
                  <span className="text-red-600">Disconnected</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              Real-time connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Connection Status:</span>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Real-time Available:</span>
                <Badge variant={isRealTimeAvailable ? "default" : "secondary"}>
                  {isRealTimeAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleManualRefresh} disabled={!isRealTimeAvailable}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>
                <Button variant="outline" onClick={clearLogs}>
                  Clear Logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Stats */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Current Statistics</CardTitle>
              <CardDescription>
                Real-time statistics from the server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalLycees}</div>
                  <div className="text-sm text-gray-600">Schools</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.totalExposants}</div>
                  <div className="text-sm text-gray-600">Exhibitors</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalEvenements}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.totalInscriptions}</div>
                  <div className="text-sm text-gray-600">Registrations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Logs</CardTitle>
            <CardDescription>
              Real-time connection events and debug information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
              {connectionLogs.length > 0 ? (
                connectionLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No connection logs yet...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}