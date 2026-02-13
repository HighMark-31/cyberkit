// *************** RESPECT THE LICENSE OF PROJECT ***************
// ---------------     Code by HighMark.it        ----------------
// Link - Site : https://highmark.it | GitHub : https://github.com/HighMark-31/cyberkit

// *************** RESPECT THE LICENSE OF PROJECT ***************

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

export const Whois = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchWhois = async () => {
    setError('');
    setResult(null);
    try {
      if (!domain) {
        setError('Please enter a domain name or IP address');
        return;
      }
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
      if (!dnsResponse.ok) {
        throw new Error('Failed to resolve domain');
      }
      const dnsData = await dnsResponse.json();
      const ip = dnsData.Answer && dnsData.Answer.length > 0 ? dnsData.Answer[0].data : null;

      if (!ip) {
        setError('Could not resolve domain to IP');
        return;
      }

      const ipWhoisResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!ipWhoisResponse.ok) {
        throw new Error('Failed to fetch WHOIS info for IP');
      }
      const ipWhoisData = await ipWhoisResponse.json();

      const domainWhoisResponse = await fetch(`https://ipapi.co/${encodeURIComponent(domain)}/json/`);
      const domainWhoisData = domainWhoisResponse.ok ? await domainWhoisResponse.json() : null;

      setResult({
        ip,
        ipWhois: ipWhoisData && !ipWhoisData.error ? ipWhoisData : null,
        domainWhois: domainWhoisData && !domainWhoisData.error ? domainWhoisData : null,
        status: 'success'
      });
    } catch (e) {
      setError('Failed to fetch WHOIS info. Please check the domain and try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">WHOIS Lookup</h1>
        <p className="text-muted-foreground">
          Retrieve WHOIS information for a domain or IP address
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Domain or IP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="highmark.it or 8.8.8.8"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button onClick={fetchWhois} className="w-full">
            Lookup
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {result && result.status === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle>WHOIS Results</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Resolved IP: {result.ip}</h3>
            {result.ipWhois ? (
              <div>
                <h4 className="font-semibold mt-2">IP WHOIS Info:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Country:</strong> {result.ipWhois.country_name || 'N/A'}</li>
                  <li><strong>Region:</strong> {result.ipWhois.region || 'N/A'}</li>
                  <li><strong>City:</strong> {result.ipWhois.city || 'N/A'}</li>
                  <li><strong>ISP:</strong> {result.ipWhois.org || 'N/A'}</li>
                  <li><strong>Organization:</strong> {result.ipWhois.org || 'N/A'}</li>
                  <li><strong>AS:</strong> {result.ipWhois.asn || 'N/A'}</li>
                </ul>
              </div>
            ) : (
              <p className="text-red-500">No IP WHOIS information available.</p>
            )}
            {result.domainWhois ? (
              <div>
                <h4 className="font-semibold mt-4">Domain WHOIS Info:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Country:</strong> {result.domainWhois.country_name || 'N/A'}</li>
                  <li><strong>Region:</strong> {result.domainWhois.region || 'N/A'}</li>
                  <li><strong>City:</strong> {result.domainWhois.city || 'N/A'}</li>
                  <li><strong>ISP:</strong> {result.domainWhois.org || 'N/A'}</li>
                  <li><strong>Organization:</strong> {result.domainWhois.org || 'N/A'}</li>
                  <li><strong>AS:</strong> {result.domainWhois.asn || 'N/A'}</li>
                </ul>
              </div>
            ) : (
              <p className="text-red-500">No Domain WHOIS information available.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
