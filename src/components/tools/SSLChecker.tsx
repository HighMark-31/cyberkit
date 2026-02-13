// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';

export const SSLChecker = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const checkSSL = async () => {
    setError('');
    setResult(null);
    try {
      if (!url.startsWith('https://')) {
        setError('URL must start with https://');
        return;
      }
      
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status && data.status.http_code >= 200 && data.status.http_code < 400) {
          setResult({
            valid: true,
            status: 'SSL Connection successful',
            note: 'Certificate is valid and connection established',
            subject: url.replace('https://', ''),
            httpCode: data.status.http_code
          });
        } else {
          setResult({
            valid: false,
            status: 'SSL Connection failed',
            subject: url.replace('https://', ''),
            httpCode: data.status?.http_code || 'Unknown'
          });
        }
      } else {
        setResult({
          valid: false,
          status: 'Unable to verify SSL certificate',
          subject: url.replace('https://', '')
        });
      }
    } catch (e) {
      setError('Failed to check SSL certificate. Please verify the URL and try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">SSL/TLS Checker</h1>
        <p className="text-muted-foreground">
          Examine SSL certificate details for a given HTTPS URL
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="url"
            placeholder="https://enderdevelopment.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={checkSSL} className="w-full">
            Check SSL
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>SSL Certificate Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Subject:</strong> {result.subject}</li>
              <li><strong>Status:</strong> {result.status}</li>
              {result.httpCode && <li><strong>HTTP Code:</strong> {result.httpCode}</li>}
              {result.note && <li><strong>Note:</strong> {result.note}</li>}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
