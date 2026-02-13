import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, User, Globe, CheckCircle2, XCircle, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const SOCIAL_PLATFORMS = [
  { name: 'GitHub', url: 'https://github.com/{}', category: 'Dev' },
  { name: 'Reddit', url: 'https://www.reddit.com/user/{}', category: 'Social' },
  { name: 'Twitch', url: 'https://www.twitch.tv/{}', category: 'Video' },
  { name: 'Medium', url: 'https://medium.com/@{}', category: 'Writing' },
  { name: 'Steam', url: 'https://steamcommunity.com/id/{}', category: 'Gaming' },
  { name: 'GitLab', url: 'https://gitlab.com/{}', category: 'Dev' },
  { name: 'Vimeo', url: 'https://vimeo.com/{}', category: 'Video' },
  { name: 'SoundCloud', url: 'https://soundcloud.com/{}', category: 'Music' },
  { name: 'Behance', url: 'https://www.behance.net/{}', category: 'Design' },
  { name: 'Dribbble', url: 'https://dribbble.com/{}', category: 'Design' },
  { name: 'Dev.to', url: 'https://dev.to/{}', category: 'Dev' },
  { name: 'About.me', url: 'https://about.me/{}', category: 'Personal' },
];



export const SherlockWeb = () => {
  const [username, setUsername] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<{name: string, url: string, status: 'found' | 'not_found' | 'error'}[]>([]);
  const [progress, setProgress] = useState(0);

  const startScan = async () => {
    if (!username) {
      toast({ title: "Error", description: "Please enter a username", variant: "destructive" });
      return;
    }

    setIsScanning(true);
    setResults([]);
    setProgress(0);

    const checkPlatform = async (platform: typeof SOCIAL_PLATFORMS[0]) => {
      const targetUrl = platform.url.replace('{}', username);
      let status: 'found' | 'not_found' | 'error' = 'error';

      try {

        const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
            }
        });

        if (response.status === 200) {
            status = 'found';
        } else if (response.status === 404) {
            status = 'not_found';
        } else {

            status = 'error';
        }

      } catch (error) {
        console.warn(`Primary proxy failed for ${platform.name}, trying backup...`);
        
        try {
            const backupUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            const response = await fetch(backupUrl);
            const data = await response.json();
            
            if (data.status.http_code === 200) {
                status = 'found';
            } else if (data.status.http_code === 404) {
                status = 'not_found';
            }
        } catch (backupError) {
            console.error(`All proxies failed for ${platform.name}`, backupError);
            status = 'error';
        }
      }

      return { name: platform.name, url: targetUrl, status };
    };


    const chunkSize = 3;
    for (let i = 0; i < SOCIAL_PLATFORMS.length; i += chunkSize) {
        const chunk = SOCIAL_PLATFORMS.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(chunk.map(checkPlatform));
        
        setResults(prev => [...prev, ...chunkResults]);
        setProgress(Math.min(((i + chunkSize) / SOCIAL_PLATFORMS.length) * 100, 100));
    }

    setIsScanning(false);
    toast({ title: "Scan Complete", description: `Finished checking ${SOCIAL_PLATFORMS.length} platforms.` });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Sherlock Web</h1>
        <p className="text-muted-foreground">Cross-check username availability across major social platforms using real-time requests via proxy.</p>
        <p className="text-xs text-yellow-500/80 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Note: Results depend on public proxy availability and platform anti-bot measures.
        </p>
      </div>

      <Card className="bg-card/30 border-white/10 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="username" className="text-white">Target Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="username"
                  placeholder="e.g. john_doe"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startScan()}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full md:w-auto px-8"
                disabled={isScanning}
                onClick={startScan}
              >
                {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Scan Platforms
              </Button>
            </div>
          </div>

          {isScanning && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Scanning platforms...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((res, i) => (
          <Card key={i} className={`bg-card/30 border-white/5 hover:border-white/10 transition-colors ${res.status === 'not_found' ? 'opacity-50' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {res.status === 'found' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : res.status === 'not_found' ? (
                  <XCircle className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className={res.status === 'found' ? "text-white font-medium" : "text-muted-foreground"}>
                  {res.name}
                </span>
              </div>
              {res.status === 'found' && (
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};