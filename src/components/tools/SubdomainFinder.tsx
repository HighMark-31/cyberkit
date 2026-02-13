import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Loader2, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

export const SubdomainFinder = () => {
  const [domain, setDomain] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<{name: string, ip: string, status: 'live' | 'unknown'}[]>([]);
  const [progress, setProgress] = useState(0);

  const startScan = async () => {
    if (!domain) {
      toast({ title: "Error", description: "Please enter a root domain", variant: "destructive" });
      return;
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
    setIsScanning(true);
    setResults([]);
    setProgress(10);

    try {
      const response = await fetch(`https://crt.sh/?q=%25.${cleanDomain}&output=json`);
      if (!response.ok) throw new Error("Failed to fetch from crt.sh");
      
      const data = await response.json();
      setProgress(50);

      const uniqueDomains = new Set<string>();
      const processedResults = [];

      for (const entry of data) {
        const name = entry.name_value;
        const names = name.split('\n');
        
        for (const n of names) {
            if (n.includes('*') || !n.endsWith(cleanDomain)) continue;
            
            if (!uniqueDomains.has(n)) {
                uniqueDomains.add(n);
                processedResults.push({
                    name: n,
                    ip: 'Unknown (Passive)', 
                    status: 'unknown' as const
                });
            }
        }
      }

      processedResults.sort((a, b) => a.name.localeCompare(b.name));
      
      const limitedResults = processedResults.slice(0, 100);
      
      const resolveIPs = async () => {
        const topResults = limitedResults.slice(0, 20);
        const remainingResults = limitedResults.slice(20);
        
        const resolvedTop = await Promise.all(topResults.map(async (res) => {
            try {
                const dnsRes = await fetch(`https://dns.google/resolve?name=${res.name}&type=A`);
                const dnsData = await dnsRes.json();
                if (dnsData.Answer && dnsData.Answer.length > 0) {
                    const ip = dnsData.Answer.find((r: any) => r.type === 1)?.data; // Type 1 is A record
                    return { ...res, ip: ip || 'Unresolved', status: ip ? 'live' : 'unknown' };
                }
            } catch (e) {
            }
            return res;
        }));
        
        setResults([...resolvedTop, ...remainingResults]);
      };

      setResults(limitedResults);
      setProgress(80);
      
      await resolveIPs();
      setProgress(100);
      
      if (processedResults.length === 0) {
        toast({ title: "No Subdomains Found", description: "Try a different domain.", variant: "default" });
      } else {
        toast({ title: "Scan Complete", description: `Found ${processedResults.length} subdomains. Resolved IPs for top 20.` });
      }

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch subdomains. The API might be busy.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Subdomain Finder</h1>
        <p className="text-muted-foreground">Passive discovery of real subdomains using Certificate Transparency logs (crt.sh).</p>
      </div>

      <Card className="bg-card/30 border-white/10 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="domain" className="text-white">Root Domain</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="domain"
                  placeholder="e.g. example.com"
                  className="pl-10 bg-background/50 border-white/10"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startScan()}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full md:w-auto h-10 px-8 bg-primary hover:bg-primary/90 text-white"
                disabled={isScanning}
                onClick={startScan}
              >
                {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Find Subdomains
              </Button>
            </div>
          </div>

          {isScanning && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Querying Certificate Transparency Logs...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((res, i) => (
            <Card key={i} className="bg-card/30 border-white/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium break-all">{res.name}</span>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-none text-[10px] h-4">PASSIVE</Badge>
                  </div>
                  {/* IP resolution requires backend, so we hide or show generic info */}
                </div>
                <a href={`http://${res.name}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};