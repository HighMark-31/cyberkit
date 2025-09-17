// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Network, CheckCircle, XCircle } from 'lucide-react';

export const Ping = () => {
  const [host, setHost] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pingHost = async () => {
    setLoading(true);
    setResult(null);
    
    const pingResults = [];
    let successfulPings = 0;
    
    try {
      for (let i = 1; i <= 4; i++) {
        try {
          const start = performance.now();
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(`https://${host}`, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal,
            cache: 'no-cache'
          });
          
          clearTimeout(timeoutId);
          const end = performance.now();
          const pingTime = Math.round(end - start);
          
          pingResults.push({ seq: i, time: pingTime, success: true });
          successfulPings++;
          
        } catch (pingError) {
          pingResults.push({ seq: i, time: 0, success: false, error: 'Request timeout or network error' });
        }
        
        if (i < 4) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      const successfulTimes = pingResults.filter(r => r.success).map(r => r.time);
      const packetLoss = Math.round(((4 - successfulPings) / 4) * 100);
      
      if (successfulTimes.length > 0) {
        const avgTime = successfulTimes.reduce((sum, time) => sum + time, 0) / successfulTimes.length;
        
        setResult({
          success: true,
          host,
          packetsTransmitted: 4,
          packetsReceived: successfulPings,
          packetLoss: packetLoss,
          minTime: Math.min(...successfulTimes),
          avgTime: avgTime,
          maxTime: Math.max(...successfulTimes),
          results: pingResults
        });
      } else {
        setResult({ 
          success: false, 
          error: `All ping attempts failed. Host '${host}' may be unreachable or blocking requests.`,
          host,
          packetsTransmitted: 4,
          packetsReceived: 0,
          packetLoss: 100
        });
      }
    } catch (error) {
      setResult({ success: false, error: 'Network error or invalid host' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Ping Tool</h1>
        <p className="text-muted-foreground">
          Test network connectivity to a host (client-side simulation)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Host</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="enderdevelopment.com"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <Button onClick={pingHost} disabled={loading} className="w-full">
            {loading ? 'Pinging...' : 'Ping Host'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Ping Results for {result.host}</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{result.packetsTransmitted}</div>
                    <div className="text-sm text-muted-foreground">packets transmitted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.packetsReceived}</div>
                    <div className="text-sm text-muted-foreground">packets received</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.packetLoss}%</div>
                    <div className="text-sm text-muted-foreground">packet loss</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.avgTime.toFixed(1)}ms</div>
                    <div className="text-sm text-muted-foreground">avg time</div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div>PING {result.host} ({result.host})</div>
                  {result.results.map((r: any) => (
                    <div key={r.seq} className={r.success ? 'text-green-600' : 'text-red-600'}>
                      {r.success 
                        ? `64 bytes from ${result.host}: icmp_seq=${r.seq} ttl=64 time=${r.time} ms`
                        : `Request timeout for icmp_seq=${r.seq}`
                      }
                    </div>
                  ))}
                  <div>--- {result.host} ping statistics ---</div>
                  <div>{result.packetsTransmitted} packets transmitted, {result.packetsReceived} received, {result.packetLoss}% packet loss</div>
                  {result.avgTime && <div>rtt min/avg/max = {result.minTime.toFixed(1)}/{result.avgTime.toFixed(1)}/{result.maxTime.toFixed(1)} ms</div>}
                </div>
              </div>
            ) : (
              <p className="text-red-500">{result.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
