import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Loader2, 
  Globe, 
  AlertTriangle,
  Server,
  Lock,
  FileCode,
  ExternalLink
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface ScanResult {
  category: string;
  status: 'vulnerable' | 'secure' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
}

export const WebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);

  const startScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }

    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    let hostname = '';
    try {
      hostname = new URL(targetUrl).hostname;
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setProgress(10);
    setResults([]);

    try {
      setProgress(20);
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${hostname}`);
      const dnsData = await dnsResponse.json();

      if (dnsData.Status !== 0 || !dnsData.Answer) {
        throw new Error(`Domain ${hostname} does not exist or has no DNS records.`);
      }

      setProgress(40);


      const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      let response;
      try {
        response = await fetch(proxyUrl, { 
          method: 'HEAD',
          signal: controller.signal
        });
      } catch (fetchError) {
        response = await fetch(proxyUrl, { 
          method: 'GET',
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response || !response.ok) {

        if (!response) {
           throw new Error("Site unreachable (Network Error).");
        }

      }

      setProgress(70);

      const scanResults: ScanResult[] = [];

      if (targetUrl.startsWith('https://')) {
        scanResults.push({
          category: 'SSL/TLS',
          status: 'secure', // We can't verify cert details deeply client-side, but HTTPS is on.
          title: 'HTTPS Encryption',
          description: 'The website is accessible via HTTPS.',
          recommendation: 'Ensure your certificate is valid and not expired (Deep inspection requires server-side tools).'
        });
      } else {
        scanResults.push({
          category: 'SSL/TLS',
          status: 'vulnerable',
          title: 'No HTTPS',
          description: 'The website is using unencrypted HTTP.',
          recommendation: 'Migrate to HTTPS immediately to protect user data.'
        });
      }


      
      const headers = response.headers;
      
      const csp = headers.get('content-security-policy');
      if (csp) {
        scanResults.push({
          category: 'Headers',
          status: 'secure',
          title: 'Content Security Policy',
          description: 'CSP header is present.',
          recommendation: 'Regularly review your CSP rules.'
        });
      } else {
        scanResults.push({
          category: 'Headers',
          status: 'vulnerable',
          title: 'Missing CSP',
          description: 'Content-Security-Policy header is missing. This increases risk of XSS.',
          recommendation: 'Implement a Content-Security-Policy header.'
        });
      }

      const hsts = headers.get('strict-transport-security');
      if (hsts) {
        scanResults.push({
          category: 'Headers',
          status: 'secure',
          title: 'HSTS Enabled',
          description: 'HTTP Strict Transport Security is enabled.',
          recommendation: 'Ensure max-age is sufficiently long (e.g. 1 year).'
        });
      } else if (targetUrl.startsWith('https://')) {
        scanResults.push({
          category: 'Headers',
          status: 'warning',
          title: 'Missing HSTS',
          description: 'Strict-Transport-Security header is missing on HTTPS site.',
          recommendation: 'Enable HSTS to prevent protocol downgrade attacks.'
        });
      }


      const xfo = headers.get('x-frame-options');
      if (xfo) {
        scanResults.push({
          category: 'Headers',
          status: 'secure',
          title: 'Clickjacking Protection',
          description: `X-Frame-Options is set to ${xfo}.`,
          recommendation: 'Maintain this configuration.'
        });
      } else {
        scanResults.push({
          category: 'Headers',
          status: 'warning',
          title: 'Missing Clickjacking Protection',
          description: 'X-Frame-Options header is missing.',
          recommendation: 'Set X-Frame-Options to DENY or SAMEORIGIN.'
        });
      }


      const xcto = headers.get('x-content-type-options');
      if (xcto === 'nosniff') {
        scanResults.push({
          category: 'Headers',
          status: 'secure',
          title: 'MIME Sniffing Protection',
          description: 'X-Content-Type-Options: nosniff is enabled.',
          recommendation: 'Good configuration.'
        });
      } else {
        scanResults.push({
          category: 'Headers',
          status: 'warning',
          title: 'MIME Sniffing Risk',
          description: 'X-Content-Type-Options header is missing or incorrect.',
          recommendation: 'Set X-Content-Type-Options to nosniff.'
        });
      }


      const server = headers.get('server');
      if (server) {
        scanResults.push({
          category: 'Server',
          status: 'info',
          title: 'Server Information',
          description: `Server header revealed: ${server}`,
          recommendation: 'Consider hiding detailed server version information.'
        });
      }

      setResults(scanResults);
      toast({
        title: "Scan Complete",
        description: `Analysis finished for ${hostname}`,
      });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Scan Failed",
        description: error.message || "Could not complete the security scan.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsScanning(false);
      setProgress(100);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case 'vulnerable': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Shield className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'secure': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Secure</Badge>;
      case 'vulnerable': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Vulnerable</Badge>;
      case 'warning': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
      default: return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Info</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Website Vulnerability Scanner</h1>
        <p className="text-muted-foreground">Perform a security audit of any website to find common misconfigurations and vulnerabilities.</p>
      </div>

      <Card className="bg-card/30 border-white/10 backdrop-blur-sm overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="url" className="text-white">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="url"
                  placeholder="example.com"
                  className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 h-12"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startScan()}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full md:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold"
                disabled={isScanning}
                onClick={startScan}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Security Audit
                  </>
                )}
              </Button>
            </div>
          </div>

          {isScanning && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result, index) => (
            <Card key={index} className="bg-card/30 border-white/10 hover:border-white/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    {getStatusIcon(result.status)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-white">{result.title}</CardTitle>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{result.category}</p>
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.description}
                </p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs font-semibold text-white/70 uppercase mb-2">Recommendation</p>
                  <p className="text-sm text-primary/90 italic">
                    {result.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};