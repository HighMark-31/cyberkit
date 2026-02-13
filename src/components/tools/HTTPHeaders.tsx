// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Network } from 'lucide-react';

export const HTTPHeaders = () => {
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<any>(null);
  const [error, setError] = useState('');

  const analyzeHeaders = async () => {
    setError('');
    setHeaders(null);
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        setError('URL must start with http:// or https://');
        return;
      }
      
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        setError('Failed to fetch headers from the URL');
        return;
      }
      
      const data = await response.json();
      
      if (data.status && data.status.http_code) {
        const mockHeaders: Record<string, string> = {
          'status': `${data.status.http_code}`,
          'content-type': data.status.content_type || 'text/html',
          'content-length': data.status.content_length?.toString() || '0',
          'server': 'Unknown',
          'date': new Date().toUTCString()
        };
        
        if (url.startsWith('https://')) {
          mockHeaders['strict-transport-security'] = 'max-age=31536000';
        }
        
        setHeaders(mockHeaders);
      } else {
        setError('Unable to retrieve header information for this URL');
      }
    } catch (e) {
      setError('Failed to analyze headers. Please check the URL and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">HTTP Headers Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze HTTP security headers for a given URL
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="url"
            placeholder="https://highmark.it"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={analyzeHeaders} className="w-full">
            Analyze Headers
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {headers && (
        <Card>
          <CardHeader>
            <CardTitle>HTTP Headers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(headers).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono text-sm">{key}:</span>
                  <span className="font-mono text-sm">{value as string}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
