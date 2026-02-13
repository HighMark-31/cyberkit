import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Link as LinkIcon, RefreshCw, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UrlParser = () => {
  const { toast } = useToast();
  const [inputUrl, setInputUrl] = useState('');
  const [protocol, setProtocol] = useState('https:');
  const [hostname, setHostname] = useState('');
  const [pathname, setPathname] = useState('');
  const [hash, setHash] = useState('');
  const [params, setParams] = useState<{key: string, value: string}[]>([]);

  useEffect(() => {
    if (inputUrl) {
      try {
        const url = new URL(inputUrl);
        setProtocol(url.protocol);
        setHostname(url.hostname);
        setPathname(url.pathname);
        setHash(url.hash);
        
        const newParams: {key: string, value: string}[] = [];
        url.searchParams.forEach((value, key) => {
          newParams.push({ key, value });
        });
        setParams(newParams);
      } catch (e) {
      }
    }
  }, [inputUrl]);

  const rebuildUrl = () => {
    try {
      const url = new URL('https://example.com'); 
      url.protocol = protocol.replace(/:$/, '') + ':';
      url.hostname = hostname;
      url.pathname = pathname.startsWith('/') ? pathname : '/' + pathname;
      url.hash = hash;
      
      params.forEach(p => {
        if (p.key) url.searchParams.append(p.key, p.value);
      });

      return url.toString();
    } catch (e) {
      return 'Invalid Configuration';
    }
  };

  const builtUrl = rebuildUrl();

  const addParam = () => {
    setParams([...params, { key: '', value: '' }]);
  };

  const removeParam = (index: number) => {
    const newParams = [...params];
    newParams.splice(index, 1);
    setParams(newParams);
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(builtUrl);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">URL Parser & Builder</h1>
        <p className="text-muted-foreground">
          Analyze, modify, and reconstruct URLs for testing and debugging
        </p>
      </div>

      <div className="space-y-6">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="https://example.com/api/v1/users?id=123&token=abc" 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <Button variant="outline" onClick={() => setInputUrl('')}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Protocol</Label>
                <Input value={protocol} onChange={(e) => setProtocol(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Hostname</Label>
                <Input value={hostname} onChange={(e) => setHostname(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Path</Label>
                <Input value={pathname} onChange={(e) => setPathname(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Fragment (Hash)</Label>
                <Input value={hash} onChange={(e) => setHash(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Query Parameters</CardTitle>
              <Button size="sm" variant="ghost" onClick={addParam}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto max-h-[400px] space-y-3">
              {params.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No query parameters
                </div>
              )}
              {params.map((param, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input 
                    placeholder="Key" 
                    value={param.key} 
                    onChange={(e) => updateParam(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input 
                    placeholder="Value" 
                    value={param.value} 
                    onChange={(e) => updateParam(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeParam(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="cyber-card bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Result URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background/50 rounded-lg break-all font-mono border border-white/10">
              {builtUrl}
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => { setInputUrl(builtUrl) }} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Load as Input
              </Button>
              <Button onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
