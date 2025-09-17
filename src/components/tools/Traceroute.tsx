// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit
// -------- I have lost 30 hours of my life for this -------------
// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target } from 'lucide-react';

export const Traceroute = () => {
  const [host, setHost] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const traceRoute = async () => {
    setError('');
    setResult(null);
    try {
      if (!host) {
        setError('Please enter a host or IP address');
        return;
      }
      const response = await fetch(`https://api.hackertarget.com/traceroute/?q=${encodeURIComponent(host)}`);
      if (!response.ok) {
        throw new Error('Failed to perform traceroute');
      }
      const data = await response.text();

      setResult({
        destination: host,
        output: data
      });
    } catch (e) {
      setError('Failed to perform traceroute. Please check the hostname and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Traceroute</h1>
        <p className="text-muted-foreground">
          Trace the path packets take to reach a destination host
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Destination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="enderdevelopment.com or 192.168.1.1"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <Button onClick={traceRoute} className="w-full">
            Trace Route
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Traceroute Results for {result.destination}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm font-mono whitespace-pre-wrap">{result.output}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
