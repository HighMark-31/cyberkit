import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, AlertCircle, Copy } from 'lucide-react';
import ipaddr from 'ipaddr.js';
import { useToast } from '@/hooks/use-toast';

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  subnetMask: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  type: 'IPv4' | 'IPv6';
}

export const SubnetCalculator = () => {
  const { toast } = useToast();
  const [ip, setIp] = useState('');
  const [cidr, setCidr] = useState('24');
  const [result, setResult] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateSubnet = () => {
    try {
      setError(null);
      if (!ipaddr.isValid(ip)) {
        throw new Error('Invalid IP address');
      }

      const addr = ipaddr.parse(ip);
      const prefix = parseInt(cidr);

      if (addr.kind() === 'ipv4') {
        const ipv4 = addr as ipaddr.IPv4;
        
        if (prefix < 0 || prefix > 32) throw new Error('Invalid CIDR for IPv4 (0-32)');

        const ipNum = ipv4.toByteArray().reduce((acc, byte) => (acc << 8) + byte, 0);
        const maskNum = 0xFFFFFFFF << (32 - prefix);
        const networkNum = ipNum & maskNum;
        const broadcastNum = networkNum | (~maskNum >>> 0); 
        
        const firstUsableNum = networkNum + 1;
        const lastUsableNum = broadcastNum - 1;
        
        const numToIp = (num: number) => {
          return [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255
          ].join('.');
        };

        const totalHosts = Math.pow(2, 32 - prefix);
        const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;
        
        const maskString = numToIp(maskNum);

        setResult({
          type: 'IPv4',
          cidr: prefix,
          subnetMask: maskString,
          networkAddress: numToIp(networkNum),
          broadcastAddress: numToIp(broadcastNum),
          firstUsable: totalHosts > 2 ? numToIp(firstUsableNum) : 'N/A',
          lastUsable: totalHosts > 2 ? numToIp(lastUsableNum) : 'N/A',
          totalHosts,
          usableHosts
        });

      } else if (addr.kind() === 'ipv6') {
        const ipv6 = addr as ipaddr.IPv6;
        if (prefix < 0 || prefix > 128) throw new Error('Invalid CIDR for IPv6 (0-128)');
        
        setResult({
          type: 'IPv6',
          cidr: prefix,
          subnetMask: `/${prefix}`,
          networkAddress: `${ip}/${prefix}`,
          broadcastAddress: 'N/A (IPv6 uses Multicast)',
          firstUsable: 'Calculated based on Interface ID',
          lastUsable: 'Calculated based on Interface ID',
          totalHosts: Infinity, // Practically infinite for standard subnets
          usableHosts: Infinity
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Value copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">IP Subnet Calculator</h1>
        <p className="text-muted-foreground">
          Calculate network parameters for IPv4 and IPv6 subnets
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input 
                placeholder="192.168.1.1" 
                value={ip} 
                onChange={(e) => setIp(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>CIDR (Prefix Length)</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">/</span>
                <Input 
                  type="number" 
                  placeholder="24" 
                  value={cidr} 
                  onChange={(e) => setCidr(e.target.value)}
                  min={0}
                  max={128}
                />
              </div>
            </div>
            <Button onClick={calculateSubnet} className="w-full">
              Calculate
            </Button>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card className="cyber-card animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle>Results ({result.type})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Network Address</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted/50 rounded border font-mono text-sm">
                    {result.networkAddress}
                  </code>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.networkAddress)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Subnet Mask</Label>
                <code className="block p-2 bg-muted/50 rounded border font-mono text-sm">
                  {result.subnetMask}
                </code>
              </div>

              {result.type === 'IPv4' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Broadcast Address</Label>
                    <code className="block p-2 bg-muted/50 rounded border font-mono text-sm">
                      {result.broadcastAddress}
                    </code>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">First Usable</Label>
                      <code className="block p-2 bg-muted/50 rounded border font-mono text-sm">
                        {result.firstUsable}
                      </code>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Last Usable</Label>
                      <code className="block p-2 bg-muted/50 rounded border font-mono text-sm">
                        {result.lastUsable}
                      </code>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Total Hosts</Label>
                      <div className="p-2 font-mono text-sm">{result.totalHosts.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Usable Hosts</Label>
                      <div className="p-2 font-mono text-sm text-primary font-bold">{result.usableHosts.toLocaleString()}</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
