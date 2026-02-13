import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Loader2, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DNSRecord {
  type: string;
  value: string;
  description: string;
  securityImpact: 'positive' | 'negative' | 'neutral';
}

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'];

export const DNSRecon = () => {
  const [domain, setDomain] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [records, setRecords] = useState<DNSRecord[]>([]);

  const analyzeRecord = (type: string, value: string): { description: string, securityImpact: 'positive' | 'negative' | 'neutral' } => {
    let description = '';
    let securityImpact: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (type === 'A' || type === 'AAAA') {
      description = `Maps domain to IP address (${value}). Publicly accessible.`;
    } else if (type === 'MX') {
      description = `Mail Exchange server: ${value}. Handles email for the domain.`;
    } else if (type === 'NS') {
      description = `Authoritative Name Server: ${value}. Controls DNS records.`;
    } else if (type === 'CNAME') {
      description = `Canonical Name (Alias) for another domain.`;
    } else if (type === 'TXT') {
      if (value.includes('v=spf1')) {
        description = 'SPF Record: Defines authorized email senders. Crucial for anti-spoofing.';
        securityImpact = value.includes('-all') ? 'positive' : 'neutral';
      } else if (value.includes('google-site-verification')) {
        description = 'Google Site Verification token.';
      } else if (value.includes('MS=ms')) {
        description = 'Microsoft Domain Verification.';
      } else if (value.includes('v=DMARC1')) {
        description = 'DMARC Record: Email authentication policy.';
        securityImpact = 'positive';
      } else {
        description = 'Text record for verification or configuration.';
      }
    } else if (type === 'SOA') {
      description = 'Start of Authority: Primary DNS server info.';
    }

    return { description, securityImpact };
  };

  const startRecon = async () => {
    if (!domain) {
      toast({ title: "Error", description: "Please enter a domain", variant: "destructive" });
      return;
    }

    setIsScanning(true);
    setRecords([]);

    try {
      const results: DNSRecord[] = [];

      const fetchRecord = async (type: string) => {
        try {
          const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
          const data = await response.json();
          
          if (data.Answer) {
            data.Answer.forEach((rec: any) => {
              const { description, securityImpact } = analyzeRecord(type, rec.data);
              results.push({
                type: type,
                value: rec.data,
                description,
                securityImpact
              });
            });
          }
        } catch (error) {
          console.error(`Failed to fetch ${type} records`, error);
        }
      };

      await Promise.all(RECORD_TYPES.map(type => fetchRecord(type)));

      if (results.length === 0) {
        toast({ title: "No Records Found", description: "Could not retrieve DNS records. Check the domain name.", variant: "destructive" });
      } else {
        setRecords(results);
        toast({ title: "Recon Complete", description: `Retrieved ${results.length} DNS records.` });
      }

    } catch (error) {
      toast({ title: "Error", description: "Failed to perform DNS lookup.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Advanced DNS Recon</h1>
        <p className="text-muted-foreground">Examine real-time DNS records for a domain using Google's DNS-over-HTTPS API.</p>
      </div>

      <Card className="bg-card/30 border-white/10 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="domain" className="text-white">Target Domain</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="domain"
                  placeholder="e.g. google.com"
                  className="pl-10 bg-background/50 border-white/10"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startRecon()}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full md:w-auto h-10 px-8 bg-primary hover:bg-primary/90 text-white"
                disabled={isScanning}
                onClick={startRecon}
              >
                {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Run Recon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {records.length > 0 && (
        <div className="space-y-4">
          {records.map((rec, i) => (
            <Card key={i} className="bg-card/30 border-white/5 overflow-hidden">
              <div className="flex items-stretch">
                <div className={`w-2 ${
                  rec.securityImpact === 'positive' ? 'bg-green-500' : 
                  rec.securityImpact === 'negative' ? 'bg-red-500' : 'bg-blue-500/50'
                }`} />
                <CardContent className="p-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-white/5 font-mono">{rec.type}</Badge>
                    {rec.securityImpact === 'positive' && <Shield className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-sm text-white break-all">{rec.value}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};